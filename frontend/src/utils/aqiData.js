// ─── CITY DATA - ALL 36 INDIAN STATES & UTS ────────────────────────────────────────────────────────────
export const CITIES = {
  // States
  "Port Blair": { base: 65, state: "Andaman and Nicobar" },
  "Visakhapatnam": { base: 102, state: "Andhra Pradesh" },
  "Itanagar": { base: 55, state: "Arunachal Pradesh" },
  "Guwahati": { base: 85, state: "Assam" },
  "Patna": { base: 150, state: "Bihar" },
  "Raipur": { base: 95, state: "Chhattisgarh" },
  "Panaji": { base: 70, state: "Goa" },
  "Ahmedabad": { base: 110, state: "Gujarat" },
  "Faridabad": { base: 175, state: "Haryana" },
  "Shimla": { base: 60, state: "Himachal Pradesh" },
  "Ranchi": { base: 120, state: "Jharkhand" },
  "Bangalore": { base: 78, state: "Karnataka" },
  "Kochi": { base: 50, state: "Kerala" },
  "Indore": { base: 105, state: "Madhya Pradesh" },
  "Mumbai": { base: 112, state: "Maharashtra" },
  "Imphal": { base: 65, state: "Manipur" },
  "Shillong": { base: 75, state: "Meghalaya" },
  "Aizawl": { base: 60, state: "Mizoram" },
  "Kohima": { base: 70, state: "Nagaland" },
  "Bhubaneswar": { base: 100, state: "Odisha" },
  "Ludhiana": { base: 145, state: "Punjab" },
  "Jaipur": { base: 130, state: "Rajasthan" },
  "Gangtok": { base: 55, state: "Sikkim" },
  "Chennai": { base: 95, state: "Tamil Nadu" },
  "Hyderabad": { base: 102, state: "Telangana" },
  "Agartala": { base: 80, state: "Tripura" },
  "Lucknow": { base: 165, state: "Uttar Pradesh" },
  "Dehradun": { base: 75, state: "Uttarakhand" },
  "Kolkata": { base: 145, state: "West Bengal" },
  // Union Territories
  "Chandigarh": { base: 140, state: "Chandigarh" },
  "Silvassa": { base: 100, state: "Dadra and Nagar Haveli" },
  "Daman": { base: 85, state: "Daman and Diu" },
  "Delhi": { base: 187, state: "Delhi" },
  "Kavaratti": { base: 45, state: "Lakshadweep" },
  "Puducherry": { base: 70, state: "Puducherry" },
  "Leh": { base: 50, state: "Ladakh" },
};

// ─── AQI CLASSIFICATION ────────────────────────────────────────────────────────
export const getAQICategory = (aqi) => {
  if (aqi <= 50)  return { label: "Good",        color: "#22c55e", glow: "#22c55e50", risk: "Low",       bg: "#052e1620" };
  if (aqi <= 100) return { label: "Satisfactory", color: "#84cc16", glow: "#84cc1650", risk: "Low",       bg: "#1a2e0520" };
  if (aqi <= 200) return { label: "Moderate",     color: "#eab308", glow: "#eab30850", risk: "Medium",    bg: "#1c1a0520" };
  if (aqi <= 300) return { label: "Poor",         color: "#f97316", glow: "#f9731650", risk: "High",      bg: "#1c0a0520" };
  if (aqi <= 400) return { label: "Very Poor",    color: "#ef4444", glow: "#ef444450", risk: "Very High", bg: "#1c050520" };
  return           { label: "Severe",             color: "#c084fc", glow: "#c084fc50", risk: "Hazardous", bg: "#0f051720" };
};

// ─── TIME OF DAY ───────────────────────────────────────────────────────────────
export const getTimeOfDay = (hour) => {
  if (hour >= 5  && hour < 8)  return "dawn";
  if (hour >= 8  && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "dusk";
  if (hour >= 20 && hour < 24) return "night";
  return "midnight";
};

export const getDayNightTheme = (hour) => {
  const tod = getTimeOfDay(hour);
  const themes = {
    dawn:      { bg1: "#0d1b2a", bg2: "#1a2744", bg3: "#2d1b4e", accent: "#fb923c", star: false, sun: true  },
    morning:   { bg1: "#0a1628", bg2: "#0f2040", bg3: "#162a52", accent: "#38bdf8", star: false, sun: true  },
    afternoon: { bg1: "#060e1a", bg2: "#0a1628", bg3: "#0f1f3d", accent: "#60a5fa", star: false, sun: true  },
    dusk:      { bg1: "#1a0e2e", bg2: "#2d1244", bg3: "#1c0a1a", accent: "#f472b6", star: false, sun: true  },
    night:     { bg1: "#030711", bg2: "#060d1a", bg3: "#090f24", accent: "#818cf8", star: true,  sun: false },
    midnight:  { bg1: "#020509", bg2: "#040a14", bg3: "#060c1e", accent: "#6366f1", star: true,  sun: false },
  };
  return themes[tod];
};

// ─── FORECAST DATA GENERATOR ───────────────────────────────────────────────────
export const generateForecast = (base, hours = 24) => {
  const now = new Date();
  return Array.from({ length: hours + 1 }, (_, i) => {
    const t = new Date(now.getTime() + i * 3600000);
    const h = t.getHours();
    // Pollution pattern: high in morning rush, evening rush, low at night
    const morningPeak  = Math.exp(-Math.pow(h - 9,  2) / 8) * 80;
    const eveningPeak  = Math.exp(-Math.pow(h - 18, 2) / 6) * 100;
    const nightDip     = h >= 1 && h <= 5 ? -40 : 0;
    const noise        = (Math.random() - 0.5) * 25;
    const aqi = Math.max(20, Math.round(base + morningPeak + eveningPeak + nightDip + noise));
    return {
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      hour: h,
      aqi,
      index: i,
    };
  });
};

// ─── SAFE WINDOWS ──────────────────────────────────────────────────────────────
export const findSafeWindows = (forecast) => {
  const minAQI = Math.min(...forecast.map(f => f.aqi));
  const maxAQI = Math.max(...forecast.map(f => f.aqi));
  const safeIdx = forecast.findIndex(f => f.aqi === minAQI);
  const peakIdx = forecast.findIndex(f => f.aqi === maxAQI);
  return {
    safeStart: forecast[Math.max(0, safeIdx - 1)]?.time,
    safeEnd:   forecast[Math.min(forecast.length - 1, safeIdx + 1)]?.time,
    peakStart: forecast[Math.max(0, peakIdx - 1)]?.time,
    peakEnd:   forecast[Math.min(forecast.length - 1, peakIdx + 1)]?.time,
    minAQI,
    maxAQI,
  };
};

// ─── 7-DAY TREND ───────────────────────────────────────────────────────────────
export const generate7Day = (base) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  return days.map((d, i) => ({
    day: d,
    aqi: Math.max(30, Math.round(base + (Math.sin(i * 1.2) * 40) + (Math.random() - 0.5) * 30)),
    isToday: i === (today === 0 ? 6 : today - 1),
  }));
};

// ─── FEATURE IMPORTANCE ────────────────────────────────────────────────────────
export const getFeatureImportance = (aqi) => {
  // Slightly vary by AQI level to feel dynamic
  const pm25 = 35 + (aqi > 200 ? 10 : 0);
  return [
    { name: "PM2.5",       value: pm25,        color: "#ef4444" },
    { name: "Wind Speed",  value: 25,           color: "#38bdf8" },
    { name: "Humidity",    value: 18,           color: "#818cf8" },
    { name: "Temperature", value: 12,           color: "#f97316" },
    { name: "NO₂",         value: 10 - (aqi > 200 ? 0 : 3), color: "#a78bfa" },
  ];
};

// ─── EXPOSURE CALCULATOR ───────────────────────────────────────────────────────
export const USER_MULTIPLIERS  = { Child: 1.4, Adult: 1.0, Elderly: 1.3, "Asthma patient": 1.6 };
export const ACTIVITY_MULTIPLIERS = { Resting: 0.7, Walking: 1.0, Running: 1.8, "Heavy work": 2.2 };

export const calculateExposure = (aqi, userType, activity, durationHours) => {
  const um = USER_MULTIPLIERS[userType];
  const am = ACTIVITY_MULTIPLIERS[activity];
  const exposureScore = Math.round(aqi * um * am * durationHours);
  const maxSafeTime = Math.max(0.5, +(200 / (aqi * um * am)).toFixed(1));
  const maskNeeded = aqi > 100 || (userType !== "Adult" && aqi > 75);
  const n95Needed  = aqi > 200;
  return { exposureScore, maxSafeTime, maskNeeded, n95Needed };
};

// ─── INSTITUTION THRESHOLDS ────────────────────────────────────────────────────
export const INSTITUTION_RULES = {
  Individual: { threshold: 300, warnings: [] },
  School: {
    threshold: 150,
    warnings: [
      "🚫 Outdoor sports not recommended",
      "🏠 Shift physical activities indoors",
      "😷 Ensure all students wear masks",
      "🌬 Activate air purifiers in classrooms",
    ],
  },
  Office: {
    threshold: 200,
    warnings: [
      "🚫 Avoid outdoor lunch breaks",
      "🏠 Work from home recommended",
      "🌬 Keep HVAC filters checked",
      "😷 Masks mandatory in common areas",
    ],
  },
};
