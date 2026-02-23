# 🚀 Quick Start Guide - AQI Project

Complete step-by-step setup guide to get the AQI application running on your machine.

---

## ⏱️ Estimated Setup Time: 10-15 minutes

---

## 📋 Prerequisites Check

Before starting, verify you have:

```bash
# Check Python version (should be 3.8+)
python --version
python -m pip --version

# Check Node.js version (should be 14+)
node --version
npm --version
```

If any are missing, install them:
- **Python**: https://www.python.org/downloads/
- **Node.js**: https://nodejs.org/

---

## 🔧 Step-by-Step Setup

### STEP 1: Navigate to Project Directory

```bash
cd c:\Users\Admin\OneDrive\Desktop\AQI_PROJECT
```

---

### STEP 2: Setup Backend (Flask)

#### 2.1 Create Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

#### 2.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- Flask (web framework)
- Flask-CORS (cross-origin requests)
- Flask-SQLAlchemy (database ORM)
- SQLAlchemy (database toolkit)
- python-dotenv (environment variables)

#### 2.3 Verify Backend Works

```bash
# Just check if Flask starts (Ctrl+C to stop)
python app.py
```

Expected output:
```
 * Running on http://0.0.0.0:5000
 * Press CTRL+C to quit
```

✅ Backend is working! Keep it running.

---

### STEP 3: Setup Frontend (React)

Open a **NEW terminal window** (keep backend running in the first one).

#### 3.1 Navigate to Frontend

```bash
cd frontend
```

#### 3.2 Install Node Dependencies

```bash
npm install
```

This downloads React, dependencies, and tools (~500MB).

#### 3.3 Verify Environment File

Check if `.env` exists. If not, create it:

```bash
# Windows
echo. > .env

# macOS/Linux
touch .env
```

Open `.env` and add:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

#### 3.4 Start Frontend Development Server

```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view aqi-project in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

### STEP 4: Open in Browser

Open your browser and go to: **http://localhost:3000**

🎉 **You should see the AQI Dashboard!**

---

## ✅ Verification Checklist

After starting, verify everything is working:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Frontend loads without errors
- [ ] Can see "Delhi" as default city
- [ ] Dashboard displays AQI data
- [ ] Can switch between cities
- [ ] Can interact with components

---

## 🔍 Browser Console Check

1. Open DevTools: `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Shift+I` (Mac)
2. Go to **Console** tab
3. You should **NOT** see red error messages
4. You may see warnings (those are okay)

---

## 📊 Initialize Sample Data (Optional)

To populate database with sample data:

```bash
# In a NEW terminal (keep backend and frontend running)
cd backend

# Make sure venv is activated
venv\Scripts\activate  # Windows

# Run initialization script
python init_data.py
```

This will:
- Create database tables
- Add 6 cities
- Generate sample AQI readings
- Run test queries

---

## 🎮 Try Out Features

### 1. View Current AQI
- Dashboard should show AQI for current city (default: Delhi)
- Try changing city with dropdown

### 2. Check Forecast
- Click "Forecast" section
- Should show 24-hour chart

### 3. Calculate Exposure
- Open "Exposure Calculator"
- Change user type to "Child"
- Drag duration slider
- See exposure score update

### 4. View Trends
- Open "Trend Analysis"
- Should show 7-day line chart

### 5. Find Safe Times
- Open "Safe Time Finder"
- Should show peak and safe hours

---

## 🔌 API Testing (Optional)

Test API endpoints directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all cities
curl http://localhost:5000/api/cities

# Get current AQI
curl http://localhost:5000/api/current/Delhi

# Calculate exposure
curl -X POST http://localhost:5000/api/exposure \
  -H "Content-Type: application/json" \
  -d '{"aqi":200,"user_type":"Adult","activity":"Walking","duration":2}'
```

---

## 🛑 Stopping the Servers

### Backend
```bash
# Press Ctrl+C in the backend terminal
```

### Frontend
```bash
# Press Ctrl+C in the frontend terminal
```

---

## ⚠️ Troubleshooting

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Windows - kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Use different port
PORT=3001 npm start
```

### Problem: "Backend not connecting"

**Check:**
1. Is backend running? (should see "Running on 0.0.0.0:5000")
2. Does `.env` have correct API URL? (should be `http://localhost:5000/api`)
3. Check browser console (F12) for CORS errors

**Solution:**
```bash
# Restart both servers
# Backend: Ctrl+C, then python app.py
# Frontend: Ctrl+C, then npm start
```

### Problem: "ModuleNotFoundError" in backend

**Solution:**
```bash
cd backend
pip install -r requirements.txt  # Reinstall dependencies
```

### Problem: "npm dependencies issue"

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: Database errors

**Solution:**
```bash
# Delete and recreate database
cd backend
rm aqi_data.db
python init_data.py
```

---

## 📱 Development Workflow

### Making Changes to Frontend

1. Edit files in `frontend/src/`
2. Save file (Ctrl+S)
3. Browser automatically refreshes
4. Check browser console for errors

### Making Changes to Backend

1. Edit files in `backend/`
2. Save file (Ctrl+S)
3. Flask auto-reloads (if debug mode enabled)
4. Frontend should still work (might need hard refresh: Ctrl+Shift+R)

---

## 📝 Project Structure Reminder

```
AQI_PROJECT/
├── backend/
│   ├── app.py              # Main Flask app
│   ├── utils.py            # Calculations
│   ├── requirements.txt     # Dependencies
│   ├── aqi_data.db         # Database (auto-created)
│   └── venv/               # Virtual environment (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   ├── node_modules/       # Dependencies (auto-created)
│   └── .env
│
└── README.md
```

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| Frontend Runs On | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Backend Docs | See backend/README.md |
| Frontend Docs | See frontend/README.md |
| Full Project Docs | See README.md |

---

## 🆘 Still Having Issues?

1. **Check all terminals** - are both running without errors?
2. **Verify ports** - use `netstat` or `lsof` to check
3. **Clear cache** - Ctrl+Shift+Delete in browser
4. **Hard refresh** - Ctrl+Shift+R (clears browser cache)
5. **Check console** - F12 → Console tab for error messages
6. **Read error messages carefully** - they usually tell you what's wrong

---

## 🎓 Next Steps

Once everything is running:

1. **Explore Code**: Read through `App.js` and `app.py`
2. **Try API**: Use the test endpoints to understand data flow
3. **Modify Data**: Change initial AQI values in `utils.py`
4. **Read Docs**: 
   - [Backend README](backend/README.md) - API documentation
   - [Frontend README](frontend/README.md) - Component guide
   - [Main README](README.md) - Full project overview

---

## 💾 Saving Your Progress

After making changes:

```bash
# Check what changed
git status

# Stage changes
git add .

# Commit with message
git commit -m "Describe your changes"

# Push to repository
git push
```

---

## 🎯 Common Modifications

### Change Default City
Edit `frontend/src/App.js` line ~23:
```javascript
const [city, setCity] = useState('Mumbai');  // Change from 'Delhi'
```

### Adjust Base AQI
Edit `backend/utils.py`, search for `CITIES` dictionary and modify values.

### Change Server Port
Edit `backend/app.py` last line:
```python
app.run(debug=True, port=8000, host='0.0.0.0')  # Change from 5000
```

---

## 📞 Quick Support

| Issue | Quick Fix |
|-------|-----------|
| Nothing displaying | Refresh browser (Ctrl+R) or hard refresh (Ctrl+Shift+R) |
| Errors in console | Check that both servers are running |
| Data not updating | Check if backend is serving fresh data |
| Slowness | Close other applications, increase RAM allocation |
| Network errors | Check internet connection, firewall settings |

---

## ✨ You're All Set!

🎉 Congratulations! Your AQI Project is now running.

**What's next?**
- Explore the application
- Read the code documentation
- Try making small changes
- Deploy when ready (see deployment guide)

---

**Happy Coding! 🚀**

---

*Last Updated: February 23, 2026*  
*Version: 1.0*
