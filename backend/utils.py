"""
AQI Utility Functions
Contains all calculation and classification logic
"""

from datetime import datetime, timedelta
import math

# ─────────────────────────────────────────────────────────────────────────────
# AQI CLASSIFICATION
# ─────────────────────────────────────────────────────────────────────────────

def get_aqi_category(aqi):
    """
    Classify AQI value into categories with color codes
    """
    if aqi <= 50:
        return {
            'label': 'Good',
            'color': '#22c55e',
            'glow': '#22c55e50',
            'risk': 'Low',
            'bg': '#052e1620',
            'health_advice': 'Excellent air quality. All outdoor activities are safe.'
        }
    elif aqi <= 100:
        return {
            'label': 'Satisfactory',
            'color': '#84cc16',
            'glow': '#84cc1650',
            'risk': 'Low',
            'bg': '#1a2e0520',
            'health_advice': 'Acceptable air quality. Outdoor activities are fine.'
        }
    elif aqi <= 200:
        return {
            'label': 'Moderate',
            'color': '#eab308',
            'glow': '#eab30850',
            'risk': 'Medium',
            'bg': '#1c1a0520',
            'health_advice': 'Moderate pollution. Sensitive groups should limit outdoor exposure.'
        }
    elif aqi <= 300:
        return {
            'label': 'Poor',
            'color': '#f97316',
            'glow': '#f9731650',
            'risk': 'High',
            'bg': '#1c0a0520',
            'health_advice': 'Poor air quality. Reduce outdoor activities. Wear N95 masks.'
        }
    elif aqi <= 400:
        return {
            'label': 'Very Poor',
            'color': '#ef4444',
            'glow': '#ef444450',
            'risk': 'Very High',
            'bg': '#1c050520',
            'health_advice': 'Very poor air quality. Avoid outdoor activities. Wear N95 masks indoors.'
        }
    else:
        return {
            'label': 'Severe',
            'color': '#c084fc',
            'glow': '#c084fc50',
            'risk': 'Hazardous',
            'bg': '#0f051720',
            'health_advice': 'Severe airpollution. Stay indoors. All outdoor activities prohibited.'
        }

# ─────────────────────────────────────────────────────────────────────────────
# EXPOSURE CALCULATION
# ─────────────────────────────────────────────────────────────────────────────

USER_MULTIPLIERS = {
    'Child': 2.5,
    'Adult': 1.0,
    'Elderly': 2.0,
    'Asthmatic': 3.0
}

ACTIVITY_MULTIPLIERS = {
    'Resting': 0.5,
    'Walking': 1.0,
    'Running': 2.5,
    'Outdoor Work': 3.0
}

def calculate_exposure(aqi, user_type='Adult', activity='Walking', duration_hours=2):
    """
    Calculate personal health exposure based on AQI and individual factors
    
    Returns:
        dict with exposure_score, max_safe_time, mask_needed, n95_needed
    """
    user_mult = USER_MULTIPLIERS.get(user_type, 1.0)
    activity_mult = ACTIVITY_MULTIPLIERS.get(activity, 1.0)
    
    # Exposure score = AQI × user_multiplier × activity_multiplier × duration
    exposure_score = aqi * user_mult * activity_mult * duration_hours * 4
    
    # Calculate max safe time (in hours) before needing protection
    if aqi <= 50:
        max_safe = 8 / (user_mult * activity_mult)
    elif aqi <= 100:
        max_safe = 4 / (user_mult * activity_mult)
    elif aqi <= 200:
        max_safe = 2 / (user_mult * activity_mult)
    elif aqi <= 300:
        max_safe = 1 / (user_mult * activity_mult)
    else:
        max_safe = 0.25 / (user_mult * activity_mult)
    
    # Determine if mask is needed
    mask_needed = aqi > 100
    
    # Determine if N95 is needed (more stringent)
    n95_needed = aqi > 200
    
    # Health warning
    if exposure_score > 600:
        health_warning = 'HIGH RISK: Stay indoors'
    elif exposure_score > 400:
        health_warning = 'Medium risk: Use N95 mask'
    elif exposure_score > 200:
        health_warning = 'Low risk: Use regular mask'
    else:
        health_warning = 'Minimal risk'
    
    return {
        'exposure_score': round(exposure_score, 2),
        'max_safe_time': round(max_safe, 2),
        'mask_needed': mask_needed,
        'n95_needed': n95_needed,
        'health_warning': health_warning,
        'recommendation': get_exposure_recommendation(exposure_score, user_type)
    }

def get_exposure_recommendation(score, user_type):
    """
    Get detailed health recommendation based on exposure score
    """
    recommendations = {
        'Child': [
            'Keep child indoors in air-conditioned spaces',
            'Ensure mask use if outdoor exposure necessary',
            'Monitor for respiratory symptoms',
            'Consult pediatrician if symptoms persist',
            'Use air purifier in child bedroom'
        ],
        'Adult': [
            'Consider rescheduling outdoor activities',
            'Wear N95 mask if exposure necessary',
            'Monitor air quality regularly',
            'Stay hydrated and avoid strenuous activity',
            'Keep windows closed'
        ],
        'Elderly': [
            'Strictly avoid outdoor activities',
            'Keep medication accessible',
            'Maintain indoor air purification',
            'Consult physician about precautions',
            'Monitor vital signs regularly'
        ],
        'Asthmatic': [
            'Stay absolutely indoors',
            'Have rescue inhaler readily available',
            'Use air purifier continuously',
            'Avoid all outdoor exposure',
            'Contact healthcare provider immediately'
        ]
    }
    
    return recommendations.get(user_type, recommendations['Adult'])

# ─────────────────────────────────────────────────────────────────────────────
# FORECAST GENERATION
# ─────────────────────────────────────────────────────────────────────────────

def generate_forecast(base_aqi, hours=24):
    """
    Generate realistic 24-hour AQI forecast with pollution patterns
    
    Pollution patterns:
    - Morning peak (8-10 AM): traffic rush + inversion
    - Evening peak (5-7 PM): traffic rush + temperature inversion
    - Night minimum (1-5 AM): atmospheric mixing improves
    """
    now = datetime.utcnow()
    forecast = []
    
    for i in range(hours + 1):
        forecast_time = now + timedelta(hours=i)
        hour = forecast_time.hour
        
        # Morning rush peak (8-10 AM)
        morning_peak = math.exp(-math.pow(hour - 9, 2) / 8) * 80
        
        # Evening rush peak (5-7 PM)
        evening_peak = math.exp(-math.pow(hour - 18, 2) / 6) * 100
        
        # Night dip (1-5 AM) - atmospheric mixing improves
        night_dip = -40 if (hour >= 1 and hour <= 5) else 0
        
        # Random noise for variability
        noise = (hash(f"{forecast_time.isoformat()}") % 50 - 25) / 2
        
        # Calculate AQI
        aqi = max(20, round(base_aqi + morning_peak + evening_peak + night_dip + noise))
        
        forecast.append({
            'time': forecast_time.strftime('%H:%M'),
            'hour': hour,
            'aqi': aqi,
            'category': get_aqi_category(aqi)['label'],
            'color': get_aqi_category(aqi)['color'],
            'index': i
        })
    
    return forecast

# ─────────────────────────────────────────────────────────────────────────────
# 7-DAY TREND GENERATION
# ─────────────────────────────────────────────────────────────────────────────

def generate_7day_trend(base_aqi):
    """
    Generate 7-day AQI trend
    """
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    today = datetime.utcnow().weekday()
    
    trend = []
    for i in range(7):
        # Sine wave variation for realistic trends
        variation = math.sin(i * 1.2) * 40
        noise = (hash(f"day_{i}") % 60 - 30)
        
        aqi = max(30, round(base_aqi + variation + noise))
        
        trend.append({
            'day': days[i],
            'aqi': aqi,
            'category': get_aqi_category(aqi)['label'],
            'color': get_aqi_category(aqi)['color'],
            'is_today': i == today
        })
    
    return trend

# ─────────────────────────────────────────────────────────────────────────────
# FEATURE IMPORTANCE ANALYSIS
# ─────────────────────────────────────────────────────────────────────────────

def get_feature_importance(aqi, reading=None):
    """
    Calculate feature importance (explainable AI for AQI drivers)
    
    Features: PM2.5, Wind Speed, Humidity, Temperature
    """
    # Adjust importance based on AQI level
    pm25_importance = 35 + (aqi > 200) * 10 + (aqi > 300) * 15
    wind_importance = 25 - (aqi > 200) * 5  # Lower wind = worse AQI
    humidity_importance = 18 + (aqi > 200) * 8
    temp_importance = 12 + (aqi > 200) * 7
    
    # Normalize to 100
    total = pm25_importance + wind_importance + humidity_importance + temp_importance
    
    features = [
        {
            'name': 'PM2.5',
            'value': round((pm25_importance / total) * 100),
            'color': '#ef4444',
            'unit': 'μg/m³',
            'impact': 'dominant' if aqi > 200 else 'high',
            'explanation': 'Fine particulate matter is the primary AQI driver'
        },
        {
            'name': 'Wind Speed',
            'value': round((wind_importance / total) * 100),
            'color': '#38bdf8',
            'unit': 'm/s',
            'impact': 'moderate',
            'explanation': 'Lower wind speeds trap pollutants in atmosphere'
        },
        {
            'name': 'Humidity',
            'value': round((humidity_importance / total) * 100),
            'color': '#818cf8',
            'unit': '%',
            'impact': 'moderate',
            'explanation': 'High humidity increases particle suspension'
        },
        {
            'name': 'Temperature',
            'value': round((temp_importance / total) * 100),
            'color': '#f97316',
            'unit': '°C',
            'impact': 'low',
            'explanation': 'Temperature affects atmospheric stability'
        }
    ]
    
    return features

# ─────────────────────────────────────────────────────────────────────────────
# SAFE WINDOWS
# ─────────────────────────────────────────────────────────────────────────────

def find_safe_windows(forecast):
    """
    Find safe time windows for outdoor activities from 24h forecast
    """
    aqi_values = [f['aqi'] for f in forecast]
    min_aqi = min(aqi_values)
    max_aqi = max(aqi_values)
    
    min_idx = next(i for i, f in enumerate(forecast) if f['aqi'] == min_aqi)
    max_idx = next(i for i, f in enumerate(forecast) if f['aqi'] == max_aqi)
    
    # Get time window (1-3 hours around peak)
    safe_start_idx = max(0, min_idx - 1)
    safe_end_idx = min(len(forecast) - 1, min_idx + 1)
    peak_start_idx = max(0, max_idx - 1)
    peak_end_idx = min(len(forecast) - 1, max_idx + 1)
    
    return {
        'safe_time': {
            'start': forecast[safe_start_idx]['time'],
            'end': forecast[safe_end_idx]['time'],
            'aqi': min_aqi
        },
        'peak_pollution': {
            'start': forecast[peak_start_idx]['time'],
            'end': forecast[peak_end_idx]['time'],
            'aqi': max_aqi
        },
        'recommended_activity': generate_activity_recommendations(min_aqi),
        'warnings': generate_warnings(max_aqi)
    }

def generate_activity_recommendations(min_aqi):
    """Get activity recommendations based on AQI level"""
    if min_aqi <= 50:
        return ['Walking', 'Running', 'Cycling', 'Sports', 'All outdoor activities recommended']
    elif min_aqi <= 100:
        return ['Walking', 'Cycling', 'Light exercise', 'Short outdoor visits']
    elif min_aqi <= 200:
        return ['Walking (with mask)', 'Brief outdoor exposure', 'Avoid strenuous activity']
    else:
        return ['Minimize outdoor exposure', 'Use N95 mask if necessary', 'Keep time limited']

def generate_warnings(max_aqi):
    """Generate health warnings for peak pollution times"""
    cat = get_aqi_category(max_aqi)
    
    if max_aqi <= 100:
        return []
    elif max_aqi <= 200:
        return [
            f"⚠️ Moderate pollution during peak hours",
            "🏥 Sensitive groups should stay indoors",
            "😷 Consider wearing a face mask"
        ]
    elif max_aqi <= 300:
        return [
            f"⚠️ Poor air quality - avoid outdoor activities",
            "👶 Children, elderly, and patients at risk",
            "😷 N95 mask required for outdoor exposure",
            "🏢 Especially harmful if you have respiratory conditions"
        ]
    else:
        return [
            f"🚨 SEVERE pollution - stay indoors",
            "🚫 All outdoor activities prohibited",
            "🏠 Keep window and doors closed",
            "💨 Use air purifiers and close all ventilation"
        ]

# ─────────────────────────────────────────────────────────────────────────────
# INSTITUTION RULES & ALERTS
# ─────────────────────────────────────────────────────────────────────────────

INSTITUTION_RULES = {
    'School': {
        'threshold': 200,
        'warnings': [
            '🏫 Classes moved to indoor air-conditioned sections',
            '⛔ Outdoor PE/sports suspended',
            '😷 Masks mandatory for students',
            '🚌 Special precautions for activities'
        ],
        'actions': [
            'Cancel outdoor activities',
            'Distribute masks to all students',
            'Close windows in classrooms',
            'Use HEPA air purifiers',
            'Notify parents of health conditions'
        ]
    },
    'Hospital': {
        'threshold': 150,
        'warnings': [
            '🏥 Respiratory ward on high alert',
            '⚠️ Additional oxygen supply on standby',
            '👨‍⚕️ Increased ICU monitoring',
            '🚑 Emergency protocols activated'
        ],
        'actions': [
            'Seal patient rooms - no opening windows',
            'Increase HEPA filtration',
            'Monitor respiratory patients closely',
            'Stock emergency supplies',
            'Prepare for incoming emergency cases'
        ]
    },
    'Factory': {
        'threshold': 300,
        'warnings': [
            '🏭 Production suspended',
            '⛔ Outdoor worker activity halted',
            '😷 All staff to indoor areas',
            '🚨 Emergency response activated'
        ],
        'actions': [
            'Halt outdoor operations',
            'Move workers indoors',
            'Distribute respirators',
            'Activate emergency ventilation',
            'Report to environmental authorities'
        ]
    }
}

def get_institution_rules(institution_type):
    """Get alert rules for institution types"""
    return INSTITUTION_RULES.get(institution_type)

def get_all_institution_types():
    """Get list of all institution types"""
    return list(INSTITUTION_RULES.keys())

# ─────────────────────────────────────────────────────────────────────────────
# STATISTICS & ANALYSIS
# ─────────────────────────────────────────────────────────────────────────────

def calculate_aqi_statistics(readings):
    """Calculate statistics from AQI readings"""
    if not readings:
        return None
    
    aqi_values = [r.aqi for r in readings]
    
    return {
        'mean': round(sum(aqi_values) / len(aqi_values), 2),
        'median': sorted(aqi_values)[len(aqi_values) // 2],
        'min': min(aqi_values),
        'max': max(aqi_values),
        'std_dev': calculate_std_dev(aqi_values),
        'trend': calculate_trend(aqi_values)
    }

def calculate_std_dev(values):
    """Calculate standard deviation"""
    if len(values) < 2:
        return 0
    mean = sum(values) / len(values)
    variance = sum((x - mean) ** 2 for x in values) / len(values)
    return round(math.sqrt(variance), 2)

def calculate_trend(values):
    """Determine if trend is improving or worsening"""
    if len(values) < 2:
        return 'stable'
    
    first_half = sum(values[:len(values)//2]) / (len(values)//2)
    second_half = sum(values[len(values)//2:]) / (len(values) - len(values)//2)
    
    diff = second_half - first_half
    if diff > 10:
        return 'worsening'
    elif diff < -10:
        return 'improving'
    else:
        return 'stable'
