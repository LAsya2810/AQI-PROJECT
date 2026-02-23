# 🔧 Real AQI Data Integration Guide

## How to Enable Real-Time AQI Data

Your AQI application now supports **real-time accurate AQI data** from the World Air Quality Index (WAQI) API instead of mock data.

---

## 📊 Current Setup

- **Frontend**: All 36 Indian states/UTs available
- **Backend**: Configured for all 36 Indian states/UTs
- **AI Health Advisor**: Working with backend support
- **Real Data**: Currently in **fallback mode** (mock data with realistic patterns)

---

## 🚀 To Enable Real AQI Data

### Step 1: Get a Free WAQI API Key

1. Visit: https://aqicn.org/data-platform/
2. Sign up for a free account
3. Go to Account → API Tokens
4. Copy your API token

### Step 2: Add API Key to Backend

Edit `backend/real_aqi_data.py` and replace:

```python
WAQI_API_KEY = "demo"  # Replace with your API key from https://aqicn.org/api/
```

With your actual key:

```python
WAQI_API_KEY = "your_api_token_here"
```

### Step 3: Restart Backend

```bash
cd backend
python app.py
```

---

## 🌍 How It Works

### Data Flow with Real Data

```
Frontend Request
      ↓
Backend /api/current/<city>
      ↓
Try Real WAQI API
      ↓
    ✅ Success      ❌ Failure
      ↓              ↓
   Real Data    Fallback to Mock Data
      ↓
    Display to Frontend
```

### Real Data Sources

Your application automatically tries to fetch data from:
1. **WAQI API** (World Air Quality Index) - Free, 1000 requests/day
2. **Database** (Historical data stored locally)
3. **Mock Data** (Realistic simulations for development)

---

## 📍 Supported Cities (36 Total)

### States (28)
- Andhra Pradesh, Arunachal Pradesh, Assam, Bihar
- Chhattisgarh, Goa, Gujarat, Haryana
- Himachal Pradesh, Jharkhand, Karnataka, Kerala
- Madhya Pradesh, Maharashtra, Manipur, Meghalaya
- Mizoram, Nagaland, Odisha, Punjab
- Rajasthan, Sikkim, Tamil Nadu, Telangana
- Tripura, Uttar Pradesh, Uttarakhand, West Bengal

### Union Territories (8)
- Andaman and Nicobar Islands, Chandigarh
- Dadra and Nagar Haveli, Daman and Diu
- Delhi, Lakshadweep, Puducherry, Ladakh

---

## 🧪 Test Real Data

### Test with Mock Data (No API Key Needed)
```bash
curl http://localhost:5000/api/current/Delhi
```

Expected response:
```json
{
  "aqi": 187,
  "data_source": "Simulated (Based on base AQI)",
  "category": "Moderate",
  ...
}
```

### Test with Real Data (Needs API Key)
After adding your API key:
```bash
curl http://localhost:5000/api/current/Delhi
```

Expected response:
```json
{
  "aqi": 195,
  "data_source": "Real-time (WAQI)",
  "category": "Poor",
  ...
}
```

---

## 🤖 AI Health Advisor

Now works with backend support! 

### Test Endpoint
```bash
curl -X POST http://localhost:5000/api/ai-advisor \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Delhi",
    "aqi": 187,
    "min_forecast": 150,
    "max_forecast": 220
  }'
```

### Two Modes

1. **With Claude AI** (Optional)
   - Set `ANTHROPIC_API_KEY` environment variable
   - Backend will use Claude for advanced insights
   
2. **Local AI** (Always Available)
   - Smart, rule-based health recommendations
   - No API key needed
   - Runs instantly

---

## 🔑 Environment Variables

### Optional: Claude AI for Better Insights

```bash
# In backend/.env or system env
ANTHROPIC_API_KEY=your_claude_api_key_here
```

Then restart backend: `python app.py`

### Required: WAQI API for Real Data

Edit `backend/real_aqi_data.py`:
```python
WAQI_API_KEY = "your_waqi_api_key_here"
```

---

## 📊 Data Accuracy

### What Determines AQI?

Your AQI is determined by priority:

1. **Real WAQI Data** (if available & API key set) ← Most Accurate
2. **Historical Database** (if data exists)
3. **Mock Simulation** (fallback) ← For development

### Updating Frequency

- **Real Data**: Fresh with every API request
- **Database**: Stored when real data available
- **Historical**: Persists across restarts

---

## 🚨 Troubleshooting

### Problem: Still Showing Mock Data

**Solution 1**: Check API key is correct
```python
# backend/real_aqi_data.py
WAQI_API_KEY = "your_actual_api_key"
```

**Solution 2**: WAQI API might have quota limits
```
Free tier: 1000 requests/day
Premium: More requests
```

**Solution 3**: Check backend logs
```bash
# Backend logs should show:
# "Real data from WAQI" or "Fallback: API failed"
```

### Problem: "Data Source" Always Shows Mock

Check that you:
1. ✅ Got API key from https://aqicn.org/data-platform
2. ✅ Added it to `real_aqi_data.py`
3. ✅ Restarted backend
4. ✅ API quota not exceeded

---

## 📈 Production Deployment

### For Production:

1. **Use Environment Variables** (not hardcoded):
   ```python
   WAQI_API_KEY = os.environ.get('WAQI_API_KEY')
   ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
   ```

2. **Set in Deployment Platform**:
   - Heroku: `heroku config:set WAQI_API_KEY=xxx`
   - AWS: Use Secrets Manager
   - Docker: Use `.env` file

3. **Monitor API Usage**:
   - WAQI: Check dashboard for quota
   - Claude: Monitor token usage

---

## 🔄 Alternative Data Sources

If WAQI doesn't work for your needs:

### CPCB API (India-Specific)
```
Free, covers major Indian cities
No API key needed
https://www.cpcb.goc.in/
```

### OpenWeather API
```
Includes AQI data
Free tier available
https://openweathermap.org/api
```

### AirVisual API
```
Global coverage
Free tier: 100 calls/month
https://airvisual.com/api
```

---

## 📝 Implementation Notes

### Backend Logic
- `real_aqi_data.py`: Handles API calls & mock data
- `app.py`: Uses real data with smart fallback
- Automatically saves real data to database

### Frontend Integration
- Uses `/api/current/<city>` endpoint
- Displays data source to user
- Works with any backend configuration

### Health Data Notes
- AI Advisor uses local database first
- Falls back to Claude if available
- Works without any API keys

---

## 🎯 Next Steps

1. **Immediate**: Restart backend to load all 36 states
2. **Optional**: Add WAQI API key for real data
3. **Advanced**: Add Claude API key for better AI insights
4. **Production**: Move to environment variables

---

## 📚 Useful Resources

- [WAQI API Documentation](https://aqicn.org/api)
- [AQI Standards](https://www.epa.gov/air-quality/air-quality-index-aqi)
- [Claude API Reference](https://docs.anthropic.com)
- [Indian Pollution Data](https://www.cpcb.goc.in)

---

## ✅ Verification Checklist

After setup:

- [ ] Backend running with all 36 states loaded
- [ ] Frontend shows all Indian states in dropdown
- [ ] AI Health Advisor button works
- [ ] API response shows `data_source` field
- [ ] Test real data fetching (with API key)
- [ ] Historical data saving to database

---

**Questions or Issues?** Check the backend logs or review this guide again.

Last Updated: February 23, 2026
