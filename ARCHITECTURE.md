# 🏗️ Backend Architecture Document

Comprehensive guide to the AQI Backend architecture, design decisions, and system design.

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React.js)                       │
│  App.js → Components → utils/api.js → API Calls             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/JSON
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Flask REST API)                    │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes (app.py)                                      │   │
│  │ - /api/health                                       │   │
│  │ - /api/cities                                       │   │
│  │ - /api/current/<city>                              │   │
│  │ - /api/forecast/<city>                             │   │
│  │ - /api/trend/<city>                                │   │
│  │ - /api/exposure (POST)                             │   │
│  │ - /api/factor-analysis/<city>                      │   │
│  │ - /api/institution-alert/<city>/<type>            │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────↓──────────────────────────────┐   │
│  │ Utility Functions (utils.py)                        │   │
│  │ - get_aqi_category()                               │   │
│  │ - calculate_exposure()                             │   │
│  │ - generate_forecast()                              │   │
│  │ - get_feature_importance()                         │   │
│  │ - find_safe_windows()                              │   │
│  │ - get_institution_rules()                          │   │
│  └──────────────────────↓──────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────↓──────────────────────────────┐   │
│  │ Database Models (SQLAlchemy)                        │   │
│  │ - AQIReading (historical data)                     │   │
│  │ - CityProfile (metadata)                           │   │
│  │ - UserProfile (user health info)                   │   │
│  └──────────────────────↓──────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────↓──────────────────────────────┐   │
│  │ Database (SQLite)                                   │   │
│  │                                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure & Responsibilities

### `app.py` - Main Application
**Responsibilities:**
- Flask app initialization
- Database configuration
- CORS setup
- Route definitions
- Error handling

**Key Sections:**
```python
1. Imports & Initialization (lines 1-15)
2. Database Models (lines 21-87)
3. Utilities Import (lines 89-97)
4. API Routes (lines 99-340)
5. Admin Routes (lines 342-378)
6. Error Handlers (lines 380-390)
7. Main Block (lines 392-409)
```

### `utils.py` - Business Logic
**Responsibilities:**
- AQI categorization
- Exposure calculation
- Forecast generation
- Feature importance analysis
- Safe time window finding
- Institution alert rules

**Key Functions:**
- `get_aqi_category()` - AQI → Category/Color/Risk
- `calculate_exposure()` - Health risk calculation
- `generate_forecast()` - 24h AQI predictions
- `generate_7day_trend()` - Weekly trends
- `get_feature_importance()` - Explainable AI
- `find_safe_windows()` - Outdoor activity times
- `get_institution_rules()` - Alert thresholds

---

## 🗄️ Database Schema

### AQIReading Table
Purpose: Store historical AQI measurements

```sql
CREATE TABLE aqi_reading (
    id INTEGER PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    aqi INTEGER NOT NULL,
    pm25 FLOAT NOT NULL,
    pm10 FLOAT NOT NULL,
    no2 FLOAT NOT NULL,
    o3 FLOAT NOT NULL,
    co FLOAT NOT NULL,
    so2 FLOAT NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (city) REFERENCES city_profile(city),
    INDEX idx_city_timestamp (city, timestamp)
);
```

**Purpose:** Track AQI over time for:
- Historical analysis
- Trend calculation
- Forecast validation
- Statistics

**Indexing Strategy:**
- `city` - fast lookup by city
- `timestamp` - fast historical queries
- Combined index for efficient range queries

### CityProfile Table
Purpose: Store city metadata and current conditions

```sql
CREATE TABLE city_profile (
    id INTEGER PRIMARY KEY,
    city VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100) NOT NULL,
    latitude FLOAT,
    longitude FLOAT,
    base_aqi INTEGER,
    wind_speed FLOAT,
    humidity FLOAT,
    temperature FLOAT,
    updated_at DATETIME
);
```

**Purpose:**
- City information (name, state, coordinates)
- Current weather conditions
- Base AQI for forecasting
- Geographic location

**Updates:**
- Manually or via data integration script
- Represents latest observed conditions

### UserProfile Table
Purpose: Store user health information (for personalization)

```sql
CREATE TABLE user_profile (
    id INTEGER PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    age_group VARCHAR(50),
    sensitivity VARCHAR(50),
    created_at DATETIME
);
```

**Purpose:**
- User health profiles
- Personalized recommendations
- Sensitivity adjustments
- Activity recommendations

---

## 🔄 Data Flow Examples

### Example 1: Getting Current AQI

```
Frontend Request:
GET /api/current/Delhi

Backend Processing:
1. Query CityProfile for "Delhi"
2. Get latest AQIReading for Delhi (order by timestamp DESC)
3. Call get_aqi_category(aqi_value)
4. Merge data with city metadata
5. Return JSON response

JSON Response:
{
  "city": "Delhi",
  "aqi": 187,
  "category": "Poor",
  "color": "#f97316",
  ...weather data...
}

Frontend Integration:
App.js receives response → Update state → Re-render components
```

### Example 2: Calculate Exposure

```
Frontend Request (POST):
/api/exposure
{
  "aqi": 200,
  "user_type": "Child",
  "activity": "Running",
  "duration": 2
}

Backend Processing:
1. Extract parameters
2. Call calculate_exposure()
   - Look up USER_MULTIPLIERS["Child"] = 2.5
   - Look up ACTIVITY_MULTIPLIERS["Running"] = 2.5
   - Exposure = 200 × 2.5 × 2.5 × 2 × 4 = 4000
   - Determine mask_needed, n95_needed
   - Get recommendation list
3. Return JSON

JSON Response:
{
  "exposure_score": 4000.0,
  "max_safe_time": 0.1,
  "mask_needed": true,
  "n95_needed": true,
  "health_warning": "HIGH RISK: Stay indoors",
  "recommendation": [...]
}

Frontend Integration:
ExposureCalculator.jsx receives response → Display results
```

### Example 3: Get Forecast

```
Frontend Request:
GET /api/forecast/Delhi

Backend Processing:
1. Query CityProfile for "Delhi" → base_aqi = 187
2. Call generate_forecast(187, hours=24)
   - For each hour 0-24:
     - Calculate morning peak (sin around 9 AM)
     - Calculate evening peak (sin around 6 PM)
     - Add night dip (1-5 AM)
     - Add random noise
     - Return {time, aqi, category, color}
3. Return all 24 hours

JSON Response:
{
  "city": "Delhi",
  "forecast": [
    {"time": "10:00", "aqi": 195, "category": "Poor", ...},
    {"time": "11:00", "aqi": 200, "category": "Poor", ...},
    ...
  ]
}

Frontend Integration:
ForecastSection.jsx → Chart library renders line chart
```

---

## 🔐 Request/Response Pattern

All API endpoints follow RESTful conventions:

### Successful Response (200/201)
```json
{
  "data": {...},
  "status": "success",
  "timestamp": "2026-02-23T10:30:00"
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "Error message",
  "status": "error",
  "code": 404
}
```

### Status Codes Used
- **200** - GET successful
- **201** - POST successful  
- **400** - Bad request
- **404** - Not found
- **500** - Server error

---

## 🛡️ Error Handling Strategy

### Validation
```python
# Input validation
if not city:
    return error(400, "City required")

# Database queries
if not CityProfile.query.filter_by(city=city).first():
    return error(404, "City not found")
```

### Database Errors
```python
try:
    db.session.add(reading)
    db.session.commit()
except Exception as e:
    db.session.rollback()
    return error(500, str(e))
```

### API Error Handlers
```python
@app.errorhandler(404)
def not_found(e):
    return error(404, "Endpoint not found")

@app.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    return error(500, "Internal server error")
```

---

## 🧮 Key Calculations

### AQI Category
- 0-50: Good (#22c55e)
- 51-100: Satisfactory (#84cc16)
- 101-200: Moderate (#eab308)
- 201-300: Poor (#f97316)
- 301-400: Very Poor (#ef4444)
- 400+: Severe (#c084fc)

### Exposure Score
```
Exposure = AQI × User_Multiplier × Activity_Multiplier × Duration × 4
```

**User Multipliers:**
- Child: 2.5
- Adult: 1.0
- Elderly: 2.0
- Asthmatic: 3.0

**Activity Multipliers:**
- Resting: 0.5
- Walking: 1.0
- Running: 2.5
- Outdoor Work: 3.0

### Forecast Generation
```
Hour_AQI = Base_AQI + Morning_Peak + Evening_Peak + Night_Dip + Noise

Where:
- Morning_Peak = exp(-(hour-9)²/8) × 80
- Evening_Peak = exp(-(hour-18)²/6) × 100
- Night_Dip = -40 if (1 ≤ hour ≤ 5) else 0
- Noise = random(-12.5 to 12.5)
```

---

## 🔗 Integration Points

### Frontend to Backend
```javascript
// Frontend API calls (frontend/utils/api.js)
const getCurrentAQI = (city) => fetch(`${API_URL}/current/${city}`)
const getForecast = (city) => fetch(`${API_URL}/forecast/${city}`)
```

### Backend to Database
```python
# SQLAlchemy ORM queries
reading = AQIReading.query.filter_by(city=city).first()
db.session.add(reading)
db.session.commit()
```

### Backend to Utils
```python
# Utility function calls
cat = get_aqi_category(aqi_value)
exposure = calculate_exposure(aqi, user_type, activity, duration)
```

---

## 🔄 CORS Configuration

```python
CORS(app, resources={
    r"/api/*": {
        "origins": "*",              # Allow all origins (dev only!)
        "methods": ["GET", "POST"],  # Allowed HTTP methods
        "allow_headers": ["Content-Type"]
    }
})
```

**For Production:**
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## 📊 Performance Considerations

### Database Indexing
- City index for fast lookups
- Timestamp index for time-range queries
- Combined index for efficient filtering

### Query Optimization
```python
# Good: Use filter and order_by
reading = AQIReading.query.filter_by(city=city).order_by(
    AQIReading.timestamp.desc()
).first()

# Bad: Fetch all and filter in Python
all_readings = AQIReading.query.all()
reading = [r for r in all_readings if r.city == city][-1]
```

### Caching Opportunities (Future)
- Cache city list (rarely changes)
- Cache forecasts (regenerate every hour)
- Cache 7-day trends (regenerate daily)
- User exposure cache (regenerate per session)

---

## 🔌 Extensibility & Future Features

### Adding New Data Sources
```python
# In app.py, add new route
@app.route('/api/external-aqi/<city>', methods=['GET'])
def get_external_aqi(city):
    # Call WAQI API, parse response
    response = requests.get(f'https://api.waqi.info/...')
    # Transform to standard format
    return jsonify(formatted_response)
```

### Adding User Preferences
```python
# Extend UserProfile model
class UserProfile(db.Model):
    # ... existing fields ...
    preferred_units = db.Column(db.String(20))  # metric/imperial
    notification_threshold = db.Column(db.Integer)
    language = db.Column(db.String(10))
```

### Adding Historical Analytics
```python
# New route for analytics
@app.route('/api/analytics/<city>', methods=['GET'])
def get_analytics(city):
    readings = AQIReading.query.filter_by(city=city).all()
    return calculate_aqi_statistics(readings)
```

---

## 🚀 Deployment Checklist

### Before Production
- [ ] Update CORS to specific domain
- [ ] Switch from SQLite to PostgreSQL
- [ ] Add environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Set `debug=False`
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Add automated backups
- [ ] Test all endpoints thoroughly
- [ ] Load testing
- [ ] Security audit

### Deployment Platforms
- **Backend**: Heroku, AWS, DigitalOcean, Azure
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront

---

## 📈 Monitoring & Logging

### Future Logging Strategy
```python
import logging

logger = logging.getLogger(__name__)

@app.route('/api/current/<city>')
def get_current_aqi(city):
    logger.info(f"AQI request for {city}")
    try:
        # ... code ...
    except Exception as e:
        logger.error(f"Error getting AQI for {city}: {e}")
```

### Metrics to Monitor
- Response times
- Error rates
- Database query times
- API usage per endpoint
- User device information
- Caching hit rates

---

## 🔍 Testing Strategy

### Unit Tests
```python
# tests/test_utils.py
def test_aqi_category():
    assert get_aqi_category(25)['label'] == 'Good'
    assert get_aqi_category(150)['label'] == 'Moderate'
```

### Integration Tests
```python
# tests/test_api.py
def test_get_current_aqi():
    response = client.get('/api/current/Delhi')
    assert response.status_code == 200
    assert 'aqi' in response.json
```

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/cities
```

---

## 📚 Architecture Principles

1. **Separation of Concerns**
   - Routes in app.py
   - Logic in utils.py
   - Models in app.py

2. **DRY (Don't Repeat Yourself)**
   - Reuse utility functions
   - Create constants for multipliers

3. **SOLID Principles**
   - Single Responsibility: Each function does one thing
   - Open/Closed: Easy to extend, hard to break
   - Dependency Inversion: Use abstractions (SQLAlchemy)

4. **Scalability**
   - Indexed database queries
   - Separate calculation logic
   - Stateless API design

---

## 🎓 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org)
- [REST API Best Practices](https://restfulapi.net)
- [Database Design](https://www.postgresql.org/docs/current/ddl.html)

---

**Last Updated**: February 23, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready (with caveats mentioned)
