# AQI Project Backend API

A comprehensive Flask REST API for Air Quality Index (AQI) data management, forecasting, and health advisory.

## 📋 Overview

This backend provides real-time AQI data, health exposure calculations, 24-hour forecasts, and institution-specific alerts for multiple Indian cities.

## 🚀 Quick Start

### Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Server

```bash
python app.py
```

Server starts at `http://localhost:5000`

## 🔌 API Endpoints

### Health Check
- **GET** `/api/health`
  - Returns server status
  - Response: `{"status": "healthy", "timestamp": "..."}`

---

### Cities & AQI Data

#### Get All Cities
- **GET** `/api/cities`
  - Returns AQI for all available cities
  - Response:
    ```json
    [
      {
        "name": "Delhi",
        "state": "NCT",
        "aqi": 187,
        "category": "Poor",
        "color": "#f97316",
        "risk": "High",
        "coordinates": {"lat": 28.7041, "lng": 77.1025}
      }
    ]
    ```

#### Get Current AQI
- **GET** `/api/current/<city>`
  - Get current AQI and pollutant levels for a city
  - Example: `/api/current/Delhi`
  - Response:
    ```json
    {
      "city": "Delhi",
      "state": "NCT",
      "aqi": 187,
      "category": "Poor",
      "color": "#f97316",
      "risk": "High",
      "pm25": 45.0,
      "pm10": 80.0,
      "no2": 35.0,
      "o3": 25.0,
      "co": 1.2,
      "so2": 15.0,
      "wind_speed": 15.0,
      "humidity": 60.0,
      "temperature": 25.0,
      "timestamp": "2026-02-23T10:30:00"
    }
    ```

---

### Forecasts & Trends

#### Get 24-Hour Forecast
- **GET** `/api/forecast/<city>`
  - Get 24-hour AQI forecast
  - Example: `/api/forecast/Delhi`
  - Response:
    ```json
    {
      "city": "Delhi",
      "generated_at": "2026-02-23T10:30:00",
      "forecast": [
        {
          "time": "10:00",
          "hour": 10,
          "aqi": 195,
          "category": "Poor",
          "color": "#f97316",
          "index": 0
        }
      ]
    }
    ```

#### Get 7-Day Trend
- **GET** `/api/trend/<city>`
  - Get 7-day AQI trend
  - Example: `/api/trend/Delhi`
  - Response:
    ```json
    {
      "city": "Delhi",
      "generated_at": "2026-02-23T10:30:00",
      "trend": [
        {
          "day": "Mon",
          "aqi": 185,
          "category": "Poor",
          "color": "#f97316",
          "is_today": true
        }
      ]
    }
    ```

---

### Health & Safety Features

#### Get Safe Time Windows
- **GET** `/api/safe-windows/<city>`
  - Find safest times for outdoor activities
  - Example: `/api/safe-windows/Delhi`
  - Response:
    ```json
    {
      "city": "Delhi",
      "generated_at": "2026-02-23T10:30:00",
      "safe_windows": {
        "safe_time": {
          "start": "04:00",
          "end": "06:00",
          "aqi": 120
        },
        "peak_pollution": {
          "start": "17:00",
          "end": "19:00",
          "aqi": 280
        },
        "recommended_activity": ["Walking", "Light exercise"],
        "warnings": ["⚠️ Avoid peak hours"]
      }
    }
    ```

#### Calculate Personal Exposure
- **POST** `/api/exposure`
  - Calculate health risk based on personal factors
  - Request body:
    ```json
    {
      "aqi": 200,
      "user_type": "Adult",         // Child, Adult, Elderly, Asthmatic
      "activity": "Running",        // Resting, Walking, Running, Outdoor Work
      "duration": 2                 // hours
    }
    ```
  - Response:
    ```json
    {
      "exposure_score": 600.0,
      "max_safe_time": 1.5,        // hours
      "mask_needed": true,
      "n95_needed": true,
      "health_warning": "HIGH RISK: Stay indoors",
      "recommendation": ["Stay indoors", "Use N95 mask", ...]
    }
    ```

#### Get Factor Analysis
- **GET** `/api/factor-analysis/<city>`
  - Explainable AI - understand what drives AQI
  - Example: `/api/factor-analysis/Delhi`
  - Response:
    ```json
    {
      "city": "Delhi",
      "current_aqi": 187,
      "generated_at": "2026-02-23T10:30:00",
      "factors": [
        {
          "name": "PM2.5",
          "value": 45,              // importance %
          "color": "#ef4444",
          "unit": "μg/m³",
          "impact": "dominant",
          "explanation": "Fine particulate matter..."
        }
      ]
    }
    ```

---

### Institution Alerts

#### Get Institution Alert Status
- **GET** `/api/institution-alert/<city>/<institution>`
  - Get institution-specific alerts (Schools, Hospitals, Factories)
  - Example: `/api/institution-alert/Delhi/School`
  - Supported institutions: "School", "Hospital", "Factory"
  - Response:
    ```json
    {
      "city": "Delhi",
      "institution": "School",
      "current_aqi": 187,
      "threshold": 200,
      "alert_triggered": false,
      "warnings": [],
      "actions": ["Cancel outdoor activities", "Use HEPA filters"]
    }
    ```

---

### Admin Endpoints

#### Add AQI Reading
- **POST** `/api/admin/add-reading`
  - Add a new AQI reading to database
  - Request body:
    ```json
    {
      "city": "Delhi",
      "aqi": 185,
      "pm25": 85.5,
      "pm10": 150.0,
      "no2": 45.2,
      "o3": 35.1,
      "co": 1.5,
      "so2": 20.3
    }
    ```
  - Response: `{"success": true, "id": 1}`

#### Initialize Cities
- **POST** `/api/admin/init-cities`
  - Initialize default city profiles (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad)
  - Response: `{"success": true, "message": "Cities initialized"}`

---

## 📊 Supported Cities

| City | State | Base AQI |
|------|-------|----------|
| Delhi | NCT | 187 |
| Mumbai | Maharashtra | 112 |
| Bangalore | Karnataka | 78 |
| Chennai | Tamil Nadu | 95 |
| Kolkata | West Bengal | 145 |
| Hyderabad | Telangana | 102 |

---

## 🎨 AQI Categories & Colors

| Category | AQI Range | Color | Risk Level |
|----------|-----------|-------|-----------|
| Good | 0-50 | 🟢 #22c55e | Low |
| Satisfactory | 51-100 | 🟡 #84cc16 | Low |
| Moderate | 101-200 | 🟠 #eab308 | Medium |
| Poor | 201-300 | 🔴 #f97316 | High |
| Very Poor | 301-400 | 🔴 #ef4444 | Very High |
| Severe | 400+ | 🟣 #c084fc | Hazardous |

---

## 👥 User Types for Exposure Calculation

- **Child**: 2.5x sensitivity multiplier
- **Adult**: 1.0x sensitivity multiplier (baseline)
- **Elderly**: 2.0x sensitivity multiplier
- **Asthmatic**: 3.0x sensitivity multiplier

---

## 🏃 Activity Levels for Exposure

- **Resting**: 0.5x activity multiplier
- **Walking**: 1.0x activity multiplier (baseline)
- **Running**: 2.5x activity multiplier
- **Outdoor Work**: 3.0x activity multiplier

---

## 🏫 Institution Alert Thresholds

| Institution | Threshold | Status |
|------------|-----------|--------|
| School | AQI > 200 | Alert triggered if exceeded |
| Hospital | AQI > 150 | Alert triggered if exceeded |
| Factory | AQI > 300 | Alert triggered if exceeded |

---

## 📁 Database Schema

### AQIReading Table
- Stores historical AQI measurements
- Includes pollutant breakdown (PM2.5, PM10, NO₂, O₃, CO, SO₂)
- Indexed by city and timestamp for fast queries

### CityProfile Table
- Stores city metadata (state, coordinates)
- Maintains current weather (wind, humidity, temperature)
- Stores base AQI for forecasting

### UserProfile Table
- Stores user health profiles (optional)
- Tracks age group and health sensitivity
- Used for personalized exposure calculations

---

## 🔄 Integration with Frontend

1. **City Selection**: Frontend calls `/api/cities` to get list
2. **Dashboard Load**: Calls `/api/current/<city>` for main data
3. **Forecast Chart**: Calls `/api/forecast/<city>`
4. **Trends Graph**: Calls `/api/trend/<city>`
5. **Exposure Calculator**: POSTs to `/api/exposure` with user inputs
6. **Safe Times**: Calls `/api/safe-windows/<city>`
7. **Factor Analysis**: Calls `/api/factor-analysis/<city>`
8. **Institution Alerts**: Calls `/api/institution-alert/<city>/<type>`

---

## 🛡️ CORS Configuration

- Enabled for all origins (`*`) for development
- Update `CORS(app, resources={...})` in `app.py` to restrict in production

---

## 💾 Database

- Uses SQLite (`aqi_data.db`) - lightweight, file-based
- Auto-creates on first run
- To reset database, delete `aqi_data.db` file

---

## 🔧 Configuration

Edit `app.py` to modify:
- Port (default: 5000)
- Debug mode (default: True)
- Database location
- CORS origins
- City profiles

---

## 📝 Notes

- All timestamps in UTC
- AQI values represent 24-hour average index
- Forecasts are generated algorithmically based on historical patterns
- For production, integrate with real AQI data sources (WAQI, EPA, CPCB)

---

## 🚀 Next Steps

1. **Data Integration**: Connect to real AQI APIs (WAQI.info, CPCB)
2. **ML Models**: Replace forecast with trained ML models
3. **Authentication**: Add user authentication for profiles
4. **Caching**: Add Redis for performance optimization
5. **Notifications**: Implement push notifications for alerts
6. **Analytics**: Add user analytics and data logging

---

**Author**: AQI Project Team  
**Version**: 1.0  
**Last Updated**: February 23, 2026
