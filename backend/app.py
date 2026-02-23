from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
import requests
import json

# Initialize Flask and database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aqi_data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Enable CORS for frontend communication
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Import real AQI data functions
from real_aqi_data import get_aqi_with_fallback, create_city_profile_data

# ─────────────────────────────────────────────────────────────────────────────
# DATABASE MODELS
# ─────────────────────────────────────────────────────────────────────────────

class AQIReading(db.Model):
    """Store AQI readings for cities over time"""
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100), nullable=False, index=True)
    aqi = db.Column(db.Integer, nullable=False)
    pm25 = db.Column(db.Float, nullable=False)
    pm10 = db.Column(db.Float, nullable=False)
    no2 = db.Column(db.Float, nullable=False)
    o3 = db.Column(db.Float, nullable=False)
    co = db.Column(db.Float, nullable=False)
    so2 = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, index=True, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'city': self.city,
            'aqi': self.aqi,
            'pm25': self.pm25,
            'pm10': self.pm10,
            'no2': self.no2,
            'o3': self.o3,
            'co': self.co,
            'so2': self.so2,
            'timestamp': self.timestamp.isoformat()
        }

class CityProfile(db.Model):
    """Store city information and weather data"""
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.String(100), unique=True, nullable=False, index=True)
    state = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    base_aqi = db.Column(db.Integer, default=100)
    wind_speed = db.Column(db.Float, default=15.0)
    humidity = db.Column(db.Float, default=60.0)
    temperature = db.Column(db.Float, default=25.0)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'city': self.city,
            'state': self.state,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'base_aqi': self.base_aqi,
            'wind_speed': self.wind_speed,
            'humidity': self.humidity,
            'temperature': self.temperature
        }

class UserProfile(db.Model):
    """Store user health profiles for exposure calculation"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), unique=True, nullable=False, index=True)
    age_group = db.Column(db.String(50), default='Adult')  # Child, Adult, Elderly, Asthmatic
    sensitivity = db.Column(db.String(50), default='Normal')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'age_group': self.age_group,
            'sensitivity': self.sensitivity
        }

# ─────────────────────────────────────────────────────────────────────────────
# UTILITY FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

from utils import (
    get_aqi_category, 
    calculate_exposure, 
    generate_forecast,
    generate_7day_trend,
    get_feature_importance,
    get_institution_rules,
    find_safe_windows
)

# ─────────────────────────────────────────────────────────────────────────────
# API ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()}), 200

@app.route('/api/cities', methods=['GET'])
def get_all_cities():
    """Get list of all available cities with current AQI"""
    cities = CityProfile.query.all()
    result = []
    
    for city_profile in cities:
        latest_reading = AQIReading.query.filter_by(city=city_profile.city).order_by(
            AQIReading.timestamp.desc()
        ).first()
        
        aqi = latest_reading.aqi if latest_reading else city_profile.base_aqi
        cat = get_aqi_category(aqi)
        
        result.append({
            'name': city_profile.city,
            'state': city_profile.state,
            'aqi': aqi,
            'category': cat['label'],
            'color': cat['color'],
            'risk': cat['risk'],
            'coordinates': {
                'lat': city_profile.latitude,
                'lng': city_profile.longitude
            }
        })
    
    return jsonify(result), 200

@app.route('/api/current/<city>', methods=['GET'])
def get_current_aqi(city):
    """Get current AQI data for a specific city"""
    city_profile = CityProfile.query.filter_by(city=city).first()
    if not city_profile:
        return jsonify({'error': 'City not found'}), 404
    
    # Try to fetch real-time data first
    real_aqi_data = get_aqi_with_fallback(city, city_profile.state, city_profile.base_aqi)
    
    if real_aqi_data and real_aqi_data.get('is_real'):
        # Use real data from WAQI API
        reading = {
            'aqi': real_aqi_data.get('aqi', city_profile.base_aqi),
            'pm25': real_aqi_data.get('pm25', 0),
            'pm10': real_aqi_data.get('pm10', 0),
            'no2': real_aqi_data.get('no2', 0),
            'o3': real_aqi_data.get('o3', 0),
            'co': real_aqi_data.get('co', 0),
            'so2': real_aqi_data.get('so2', 0),
            'timestamp': datetime.utcnow().isoformat(),
            'data_source': 'Real-time (WAQI)'
        }
        # Optionally save to database for historical tracking
        try:
            aqi_reading = AQIReading(
                city=city,
                aqi=reading['aqi'],
                pm25=reading.get('pm25', 0),
                pm10=reading.get('pm10', 0),
                no2=reading.get('no2', 0),
                o3=reading.get('o3', 0),
                co=reading.get('co', 0),
                so2=reading.get('so2', 0)
            )
            db.session.add(aqi_reading)
            db.session.commit()
        except:
            pass  # Silently fail if can't save to DB
    else:
        # Fall back to database or mock data
        latest_reading = AQIReading.query.filter_by(city=city).order_by(
            AQIReading.timestamp.desc()
        ).first()
        
        if not latest_reading:
            # Generate mock data with realistic patterns
            aqi = real_aqi_data.get('aqi', city_profile.base_aqi) if real_aqi_data else city_profile.base_aqi
            reading = {
                'aqi': aqi,
                'pm25': aqi * 0.35,
                'pm10': aqi * 0.65,
                'no2': aqi * 0.2,
                'o3': aqi * 0.15,
                'co': aqi * 0.008,
                'so2': aqi * 0.1,
                'timestamp': datetime.utcnow().isoformat(),
                'data_source': 'Simulated (Based on base AQI)'
            }
        else:
            reading = latest_reading.to_dict()
            reading['data_source'] = 'Historical Data'
    
    cat = get_aqi_category(reading['aqi'])
    reading.update({
        'category': cat['label'],
        'color': cat['color'],
        'glow': cat['glow'],
        'risk': cat['risk'],
        'background': cat['bg'],
        'city': city,
        'state': city_profile.state,
        'wind_speed': city_profile.wind_speed,
        'humidity': city_profile.humidity,
        'temperature': city_profile.temperature
    })
    
    return jsonify(reading), 200

@app.route('/api/forecast/<city>', methods=['GET'])
def get_forecast(city):
    """Get 24-hour AQI forecast for a city"""
    city_profile = CityProfile.query.filter_by(city=city).first()
    if not city_profile:
        return jsonify({'error': 'City not found'}), 404
    
    latest_reading = AQIReading.query.filter_by(city=city).order_by(
        AQIReading.timestamp.desc()
    ).first()
    
    base_aqi = latest_reading.aqi if latest_reading else city_profile.base_aqi
    forecast = generate_forecast(base_aqi, hours=24)
    
    return jsonify({
        'city': city,
        'forecast': forecast,
        'generated_at': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/trend/<city>', methods=['GET'])
def get_trend(city):
    """Get 7-day AQI trend for a city"""
    city_profile = CityProfile.query.filter_by(city=city).first()
    if not city_profile:
        return jsonify({'error': 'City not found'}), 404
    
    latest_reading = AQIReading.query.filter_by(city=city).order_by(
        AQIReading.timestamp.desc()
    ).first()
    
    base_aqi = latest_reading.aqi if latest_reading else city_profile.base_aqi
    trend = generate_7day_trend(base_aqi)
    
    return jsonify({
        'city': city,
        'trend': trend,
        'generated_at': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/safe-windows/<city>', methods=['GET'])
def get_safe_times(city):
    """Get safe time windows for outdoor activities"""
    city_profile = CityProfile.query.filter_by(city=city).first()
    if not city_profile:
        return jsonify({'error': 'City not found'}), 404
    
    latest_reading = AQIReading.query.filter_by(city=city).order_by(
        AQIReading.timestamp.desc()
    ).first()
    
    base_aqi = latest_reading.aqi if latest_reading else city_profile.base_aqi
    forecast = generate_forecast(base_aqi, hours=24)
    safe_windows = find_safe_windows(forecast)
    
    return jsonify({
        'city': city,
        'safe_windows': safe_windows,
        'generated_at': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/factor-analysis/<city>', methods=['GET'])
def get_factors(city):
    """Get feature importance for AQI drivers"""
    city_profile = CityProfile.query.filter_by(city=city).first()
    if not city_profile:
        return jsonify({'error': 'City not found'}), 404
    
    latest_reading = AQIReading.query.filter_by(city=city).order_by(
        AQIReading.timestamp.desc()
    ).first()
    
    aqi = latest_reading.aqi if latest_reading else city_profile.base_aqi
    factors = get_feature_importance(aqi, latest_reading)
    
    return jsonify({
        'city': city,
        'current_aqi': aqi,
        'factors': factors,
        'generated_at': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/exposure', methods=['POST'])
def calculate_exposure_endpoint():
    """Calculate personal health exposure"""
    data = request.json
    aqi = data.get('aqi', 100)
    user_type = data.get('user_type', 'Adult')
    activity = data.get('activity', 'Walking')
    duration = data.get('duration', 2)
    
    exposure = calculate_exposure(aqi, user_type, activity, duration)
    
    return jsonify({
        'exposure_score': exposure['exposure_score'],
        'max_safe_time': exposure['max_safe_time'],
        'mask_needed': exposure['mask_needed'],
        'n95_needed': exposure['n95_needed'],
        'health_warning': exposure['health_warning']
    }), 200

@app.route('/api/institution-alert/<city>/<institution>', methods=['GET'])
def get_institution_alert(city, institution):
    """Get institution-specific alert status"""
    city_profile = CityProfile.query.filter_by(city=city).first()
    if not city_profile:
        return jsonify({'error': 'City not found'}), 404
    
    latest_reading = AQIReading.query.filter_by(city=city).order_by(
        AQIReading.timestamp.desc()
    ).first()
    
    aqi = latest_reading.aqi if latest_reading else city_profile.base_aqi
    rules = get_institution_rules(institution)
    
    if rules is None:
        return jsonify({'error': 'Institution type not found'}), 404
    
    alert_triggered = aqi > rules['threshold']
    
    return jsonify({
        'city': city,
        'institution': institution,
        'current_aqi': aqi,
        'threshold': rules['threshold'],
        'alert_triggered': alert_triggered,
        'warnings': rules['warnings'] if alert_triggered else [],
        'actions': rules['actions']
    }), 200

# ─────────────────────────────────────────────────────────────────────────────
# ADMIN ENDPOINTS - Data Management
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/api/admin/add-reading', methods=['POST'])
def add_aqi_reading():
    """Add a new AQI reading (for admin/data ingestion)"""
    data = request.json
    
    reading = AQIReading(
        city=data.get('city'),
        aqi=data.get('aqi'),
        pm25=data.get('pm25', 0),
        pm10=data.get('pm10', 0),
        no2=data.get('no2', 0),
        o3=data.get('o3', 0),
        co=data.get('co', 0),
        so2=data.get('so2', 0)
    )
    
    db.session.add(reading)
    db.session.commit()
    
    return jsonify({'success': True, 'id': reading.id}), 201

@app.route('/api/admin/init-cities', methods=['POST'])
def initialize_cities():
    """Initialize all city profiles for 36 Indian states/UTs"""
    cities_data = create_city_profile_data()
    
    for city_data in cities_data:
        existing = CityProfile.query.filter_by(city=city_data['city']).first()
        if not existing:
            city = CityProfile(
                city=city_data['city'],
                state=city_data['state'],
                base_aqi=city_data['base_aqi'],
                latitude=city_data['latitude'],
                longitude=city_data['longitude']
            )
            db.session.add(city)
    
    db.session.commit()
    return jsonify({'success': True, 'message': f'Initialized {len(cities_data)} Indian states/UTs'}), 201

# ─────────────────────────────────────────────────────────────────────────────
# AI HEALTH ADVISOR
# ─────────────────────────────────────────────────────────────────────────────

@app.route('/api/ai-advisor', methods=['POST'])
def ai_health_advisor():
    """
    Provide AI-powered health advisory based on AQI and personal factors
    Uses Claude AI from Anthropic
    """
    data = request.json
    city = data.get('city', 'Unknown')
    aqi = data.get('aqi', 100)
    min_forecast = data.get('min_forecast', aqi)
    max_forecast = data.get('max_forecast', aqi)
    
    try:
        # Get AQI category
        cat = get_aqi_category(aqi)

        # Create prompt for Claude/OpenAI
        prompt = f"""You are a health advisor expert on air quality. Provide a concise, practical health advisory (2-3 sentences) for residents of {city} based on this data:

- Current AQI: {aqi} ({cat['label']})
- Health Risk Level: {cat['risk']}
- 24h Forecast Range: {min_forecast}–{max_forecast}

Be specific, practical, and data-driven. No generic advice. Focus on actionable recommendations."""

        # 1) Try Anthropic Claude if key is present
        anthropic_key = os.environ.get('ANTHROPIC_API_KEY')
        if anthropic_key and anthropic_key != 'not-set':
            try:
                response = requests.post(
                    'https://api.anthropic.com/v1/messages',
                    headers={
                        'Content-Type': 'application/json',
                        'x-api-key': anthropic_key,
                        'anthropic-version': '2023-06-01'
                    },
                    json={
                        'model': 'claude-3-5-sonnet-20241022',
                        'max_tokens': 200,
                        'messages': [{'role': 'user', 'content': prompt}]
                    },
                    timeout=10
                )
                print(f"Claude API status: {response.status_code}")
                print(f"Claude response: {response.text}")
                if response.status_code == 200:
                    result = response.json()
                    # Try multiple common response shapes
                    insight = ''
                    try:
                        insight = result.get('content', [{}])[0].get('text', '')
                    except Exception:
                        insight = result.get('completion') or result.get('result') or ''
                    if insight:
                        return jsonify({
                            'insight': insight,
                            'source': 'claude-ai',
                            'city': city,
                            'aqi': aqi
                        }), 200
            except Exception as e:
                print(f"Claude API error: {e}")

        # 2) Fallback to OpenAI if Anthropic unavailable and key present
        openai_key = os.environ.get('OPENAI_API_KEY')
        if openai_key:
            try:
                oa_resp = requests.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {openai_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': 'gpt-3.5-turbo',
                        'messages': [{'role': 'user', 'content': prompt}],
                        'max_tokens': 200
                    },
                    timeout=10
                )
                print(f"OpenAI status: {oa_resp.status_code}")
                print(f"OpenAI response: {oa_resp.text}")
                if oa_resp.status_code == 200:
                    j = oa_resp.json()
                    choices = j.get('choices', [])
                    if choices:
                        insight = choices[0].get('message', {}).get('content', '')
                        if insight:
                            return jsonify({
                                'insight': insight,
                                'source': 'openai',
                                'city': city,
                                'aqi': aqi
                            }), 200
            except Exception as e:
                print(f"OpenAI API error: {e}")

        # 3) Final fallback: Generate local AI-like response
        local_insights = {
            'Good': f"Air quality in {city} is excellent. All outdoor activities are safe. You can enjoy outdoor exercise without concerns.",
            'Satisfactory': f"Air quality in {city} is acceptable. Most people can engage in outdoor activities. Sensitive groups may want to limit strenuous outdoor exercise.",
            'Moderate': f"Air quality in {city} is moderate. Limit prolonged outdoor exertion, especially for children and elderly. Consider wearing a mask for outdoor activities.",
            'Poor': f"Air quality in {city} is poor. Sensitive groups should avoid outdoor activities. If you go outside, wear an N95 mask. Consider staying indoors in air-conditioned spaces.",
            'Very Poor': f"Air quality in {city} is very poor. Avoid outdoor activities if possible. Wear N95 masks if you must go outside. Keep windows closed and use air purifiers.",
            'Severe': f"Air quality in {city} is severe and hazardous. Stay indoors. Close all windows and doors. Use high-efficiency air purifiers continuously. Consult a doctor if you experience respiratory symptoms."
        }
        
        insight = local_insights.get(cat['label'], f"Air quality in {city} is at {cat['label']} level with AQI {aqi}.")
        
        return jsonify({
            'insight': insight,
            'source': 'local-ai',
            'city': city,
            'aqi': aqi
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Error generating health advisory: {str(e)}',
            'source': 'error'
        }), 500

# ─────────────────────────────────────────────────────────────────────────────
# ERROR HANDLERS
# ─────────────────────────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Initialize all Indian states/UTs (37 total)
        current_count = CityProfile.query.count()
        if current_count < 37:
            # Clear old data if partial
            if current_count > 0:
                CityProfile.query.delete()
                db.session.commit()
            
            cities_data = create_city_profile_data()
            
            for city_data in cities_data:
                city = CityProfile(
                    city=city_data['city'],
                    state=city_data['state'],
                    base_aqi=city_data['base_aqi'],
                    latitude=city_data['latitude'],
                    longitude=city_data['longitude']
                )
                db.session.add(city)
            
            db.session.commit()
            print(f"✅ Initialized {len(cities_data)} Indian states/UTs")
        else:
            print(f"✅ Database already has {current_count} cities")
    
    app.run(debug=True, port=5000, host='0.0.0.0')
