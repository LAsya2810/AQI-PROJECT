# 🌍 AQI PROJECT - Air Quality Index Health & Prediction Platform

A full-stack web application for real-time Air Quality Index (AQI) monitoring, health advisory, and pollution forecasting across major Indian cities.

**Stack**: React (Frontend) + Flask (Backend) + SQLite (Database)

---

## 📊 Features

### 🔍 **Real-Time AQI Monitoring**
- Current AQI for 6 major cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad)
- Detailed pollutant breakdown (PM2.5, PM10, NO₂, O₃, CO, SO₂)
- Live weather data (wind speed, humidity, temperature)
- AQI classification with color-coded risk levels

### 📈 **Forecasting & Trends**
- 24-hour AQI forecast with hourly predictions
- 7-day trend analysis
- Peak pollution time identification
- Safe time windows for outdoor activities

### 👥 **Health Advisory**
- Personal exposure calculator
- User-specific recommendations (Child, Adult, Elderly, Asthmatic)
- Activity-based risk assessment (Resting, Walking, Running, Outdoor Work)
- Mask requirements and health warnings

### 🏫 **Institution Alerts**
- School air quality protocols
- Hospital emergency preparedness
- Factory operation guidelines
- Automatic alert activation based on AQI thresholds

### 🤖 **AI Features**
- Feature importance analysis (explainable AQI drivers)
- AI-powered health insights using Claude
- Pollution factor breakdown
- Data-driven recommendations

### 🌙 **Beautiful UI**
- Dynamic day/night theme based on time of day
- Animated sky background with day/night transitions
- Responsive design for mobile & desktop
- Real-time updates and glowing effects

---

## 🏗️ Project Structure

```
AQI_PROJECT/
├── frontend/                    # React.js frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AIInsights.jsx
│   │   │   ├── ExposureCalculator.jsx
│   │   │   ├── FactorAnalysis.jsx
│   │   │   ├── ForecastSection.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── InstitutionPanel.jsx
│   │   │   ├── SafeTimeFinder.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SkyBackground.jsx
│   │   │   └── TrendAnalysis.jsx
│   │   ├── utils/
│   │   │   ├── api.js         # Backend API client
│   │   │   └── aqiData.js     # Utility functions & mock data
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env                    # Frontend config
│   └── README.md
│
├── backend/                     # Flask backend
│   ├── app.py                  # Main Flask application
│   ├── utils.py                # Utility functions & calculations
│   ├── requirements.txt         # Python dependencies
│   ├── .env                    # Backend config
│   ├── init_data.py            # Data initialization script
│   ├── aqi_data.db             # SQLite database (auto-created)
│   └── README.md               # Backend API documentation
│
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 14+ (for frontend)
- **Python** 3.8+ (for backend)
- **Git**

### Installation & Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/AQI_PROJECT.git
cd AQI_PROJECT
```

#### 2️⃣ Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database with sample data
python init_data.py

# Start backend server
python app.py
```

Server runs on `http://localhost:5000`

#### 3️⃣ Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if not exists)
# echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

---

## 📝 Configuration

### Backend Configuration
Edit `backend/.env`:
```env
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///aqi_data.db
PORT=5000
HOST=0.0.0.0
```

### Frontend Configuration
Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## 🔌 API Overview

The backend provides RESTful endpoints for all AQI operations:

### Key Endpoints
- `GET /api/cities` - Get all cities with current AQI
- `GET /api/current/<city>` - Get current AQI data
- `GET /api/forecast/<city>` - Get 24-hour forecast
- `GET /api/trend/<city>` - Get 7-day trend
- `GET /api/safe-windows/<city>` - Get safe activity times
- `GET /api/factor-analysis/<city>` - Get pollution drivers
- `POST /api/exposure` - Calculate health exposure
- `GET /api/institution-alert/<city>/<type>` - Get institution alerts

**Full API Documentation**: See [backend/README.md](backend/README.md)

---

## 🎯 How It Works

### Data Flow
```
Frontend (React)
    ↓
API Client (api.js)
    ↓
Backend (Flask)
    ↓
Database (SQLite)
    ↓
Calculations (utils.py)
    ↓
JSON Response
    ↓
Components (JSX)
    ↓
UI (HTML/CSS)
```

### Key Workflows

#### 1️⃣ **User Opens Dashboard**
- App loads city list from backend
- Fetches current AQI for selected city
- Displays real-time data with theme based on time of day

#### 2️⃣ **User Checks Forecast**
- Fetches 24-hour forecast from backend
- Displays chart with hourly predictions
- Highlights peak pollution times

#### 3️⃣ **User Calculates Exposure**
- Inputs user type, activity, duration
- Sends to backend exposure endpoint
- Gets personalized health recommendations

#### 4️⃣ **Institutional Alerts**
- Backend checks AQI against thresholds
- Triggers alerts for schools/hospitals/factories
- Shows specific action items

---

## 📊 Data Models

### AQIReading (Database)
```python
- id: Integer (Primary Key)
- city: String (Indexed)
- aqi: Integer
- pm25, pm10, no2, o3, co, so2: Float
- timestamp: DateTime (Indexed)
```

### CityProfile (Database)
```python
- id: Integer (Primary Key)
- city: String (Unique)
- state: String
- latitude, longitude: Float
- base_aqi, wind_speed, humidity, temperature: Float
```

### Frontend State
```javascript
- city: String (current city)
- activeNav: String (current page)
- mode: String (Individual/School/Hospital/Factory)
- now: Date (current time for theme)
- aqi: Integer (calculated dynamically)
- forecast: Array (24h data)
- trend: Array (7-day data)
```

---

## 🛠️ Available Scripts

### Backend
```bash
# Start development server
python app.py

# Initialize database (run once)
python init_data.py

# Run tests (when added)
pytest
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (advanced - not reversible)
npm eject
```

---

## 🎨 UI/UX Features

### Color Scheme
- **🟢 Good**: #22c55e
- **🟡 Satisfactory**: #84cc16
- **🟠 Moderate**: #eab308
- **🔴 Poor**: #f97316
- **🔴 Very Poor**: #ef4444
- **🟣 Severe**: #c084fc

### Responsive Design
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

### Animations
- Fade-in transitions
- Glowing effects for AQI values
- Smooth transitions on theme changes
- Animated charts and graphs

---

## 🔐 Security Considerations

### Current (Development)
- ✅ CORS enabled for localhost
- ✅ SQLite for development
- ❌ No authentication

### For Production
- 🔒 Restrict CORS to frontend domain
- 🔒 Use PostgreSQL/MySQL
- 🔒 Add user authentication
- 🔒 Implement rate limiting
- 🔒 Add API key validation
- 🔒 Use HTTPS
- 🔒 Implement input validation
- 🔒 Add request logging

---

## 📈 Future Enhancements

### Phase 2
- [ ] User authentication & profiles
- [ ] Personal health history tracking
- [ ] Notification system (email/SMS/push)
- [ ] Real-time data from WAQI API
- [ ] ML-based AQI forecasting
- [ ] Mobile app (React Native)

### Phase 3
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Community feature (user reports)
- [ ] AI chatbot for health insights
- [ ] Integration with weather APIs
- [ ] Historical data analysis

### Phase 4
- [ ] IoT sensor integration
- [ ] Device management system
- [ ] Advanced ML models (LSTM, Prophet)
- [ ] Real-time collaboration
- [ ] Gamification (health challenges)
- [ ] API versioning

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Database errors**
```bash
# Reset database
rm backend/aqi_data.db
python backend/init_data.py
```

**Import errors**
```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use**
```bash
PORT=3001 npm start  # Use different port
```

**Module not found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection refused**
- Ensure backend is running on port 5000
- Check .env file for correct API_URL
- Check browser console for CORS errors

---

## 📚 Learn More

- [Backend API Documentation](backend/README.md)
- [Frontend Component Guide](frontend/README.md)
- [React Documentation](https://reactjs.org)
- [Flask Documentation](https://flask.palletsprojects.com)
- [SQLAlchemy Documentation](https://www.sqlalchemy.org)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Team Lead**: Your Name
- **Backend Developer**: Backend Dev
- **Frontend Developer**: Frontend Dev
- **UI/UX Designer**: Designer Name

---

## 📧 Support & Contact

- 💬 Issues: [GitHub Issues](https://github.com/yourusername/AQI_PROJECT/issues)
- 📧 Email: support@aqiproject.com
- 🐦 Twitter: [@aqiproject](https://twitter.com/aqiproject)

---

## 🙏 Acknowledgments

- WHO for AQI guidelines
- CPCB (Central Pollution Control Board)
- WAQI (World Air Quality Index)
- Anthropic Claude for AI insights
- React & Flask communities

---

## 📞 Quick Support

**Problem**: Backend won't start  
**Solution**: Check Python version (3.8+), install dependencies, check port 5000

**Problem**: Frontend can't connect to backend  
**Solution**: Ensure backend is running, check .env file, check CORS settings

**Problem**: Database errors  
**Solution**: Delete `aqi_data.db` and run `init_data.py`

---

## 🚀 Deployment

### Quick Deployment to Render (Recommended) 

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 2: Deploy on Render**
1. Go to [render.com](https://render.com)
2. Click **"New Blueprint"**
3. Connect your GitHub repo
4. Render will auto-deploy using `render.yaml`

✅ **Both backend and frontend deploy automatically!**

### Cloud Deployment Options

| Platform | Backend | Frontend | Database | Cost |
|----------|---------|----------|----------|------|
| **Render** | ✅ Docker | ✅ Static | ✅ SQLite | Free |
| **Heroku** | ✅ Python | ✅ Node | ✅ PostgreSQL | $7+ |
| **AWS** | ✅ EC2/Lambda | ✅ S3 | ✅ RDS | $5+ |

---

### 📖 Full Deployment Guide  

For complete step-by-step instructions, see **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

Includes:
- ✅ Local Docker testing
- ✅ Render deployment walkthrough  
- ✅ Environment variables
- ✅ Database setup
- ✅ Troubleshooting

### Test Locally Before Deploying

**Windows (PowerShell):**
```bash
.\test-deployment.ps1
```

**macOS/Linux:**
```bash
bash test-deployment.sh
```

### Docker Deployment

```bash
docker-compose up
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

**Last Updated**: February 23, 2026  
**Version**: 1.0.0  
**Status**: ✅ Deployment Ready

