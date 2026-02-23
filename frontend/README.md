# 🌫 AQI Intelligence Dashboard

A production-grade, real-time Air Quality Index dashboard built with React.

## ✨ Features

| Section | Description |
|---|---|
| 🌍 Hero | Live AQI gauge, city selector, real-time clock, 6-hour sparkline |
| 📈 24h Forecast | Interactive area chart with safe/peak windows, model accuracy |
| 🧮 Exposure Calc | Personalized risk based on user type, activity, duration |
| 🕒 Safe Time Finder | Best/worst outdoor windows + hourly heatmap |
| 📊 Factor Analysis | Explainable AI - feature importance bar chart |
| 🌱 7-Day Trend | Weekly AQI history, trend direction, weekly average |
| 🏫 Institution Mode | School/Office alerts when AQI exceeds threshold |
| 📍 City Compare | Multi-city AQI comparison panel |
| 🤖 AI Advisory | Claude AI-powered personalized health advice |

## 🌅 Day/Night Theme

The background automatically changes based on the **real current time**:
- 🌅 Dawn (5–8 AM): Purple-orange gradient + rising sun
- ☀️ Morning (8–12): Deep blue sky
- 🌤 Afternoon (12–5 PM): Navy sky
- 🌆 Dusk (5–8 PM): Pink-purple gradient + setting sun
- 🌙 Night (8 PM–12): Star field with moon
- ⭐ Midnight (12–5 AM): Deep black with stars

## 📁 File Structure

```
aqi-dashboard/
├── public/
│   └── index.html              # HTML entry point (Google Fonts loaded here)
├── src/
│   ├── index.js                # React DOM entry
│   ├── App.js                  # Root component — routes/pages
│   ├── styles.css              # ALL CSS — variables, animations, layout
│   ├── utils/
│   │   └── aqiData.js          # Data generators, AQI logic, constants
│   └── components/
│       ├── Sidebar.jsx         # Navigation sidebar + mode toggle
│       ├── SkyBackground.jsx   # Day/night animated sky + stars
│       ├── HeroSection.jsx     # AQI gauge, city selector, sparkline
│       ├── ForecastSection.jsx # 24h forecast area chart
│       ├── ExposureCalculator.jsx  # Personal exposure risk calculator
│       ├── SafeTimeFinder.jsx  # Best/worst outdoor windows + heatmap
│       ├── FactorAnalysis.jsx  # Pollution factor importance bars
│       ├── TrendAnalysis.jsx   # 7-day bar chart + stats
│       ├── InstitutionPanel.jsx # School/Office mode + city compare
│       └── AIInsights.jsx      # Claude API advisory panel
└── package.json
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
# http://localhost:3000
```

## 🔌 Connect to Real AQI Data (Optional)

In `src/utils/aqiData.js`, replace `CITIES` base values with a real API call.

**Recommended free APIs:**
- [OpenAQ](https://openaq.org/) — Free, covers India
- [CPCB](https://airquality.cpcb.gov.in/) — India's official AQI
- [AQI.in](https://www.aqi.in/dashboard/india) — India-specific

## 🤖 AI Advisory (Claude API)

The AI Insights component calls the Anthropic API.
In production, **proxy this call through your backend** to protect your API key.

## 🎨 Customization

- Colors: Edit CSS variables in `src/styles.css` under `:root`
- Cities: Add to `CITIES` object in `src/utils/aqiData.js`
- AQI thresholds: Edit `getAQICategory()` in `src/utils/aqiData.js`
