import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { getAQICategory, findSafeWindows } from '../utils/aqiData';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const cat = getAQICategory(val);
  return (
    <div className="custom-tooltip">
      <div className="tooltip-time">{label}</div>
      <div className="tooltip-aqi" style={{ color: cat.color }}>{val}</div>
      <div className="tooltip-label">{cat.label}</div>
    </div>
  );
}

export default function ForecastSection({ forecast }) {
  const windows = findSafeWindows(forecast);

  // Color gradient stops
  const gradientStops = forecast.map((f, i) => ({
    offset: `${(i / (forecast.length - 1)) * 100}%`,
    color: getAQICategory(f.aqi).color,
  }));

  const peakAQI  = windows.maxAQI;
  const lowestAQI = windows.minAQI;
  const peakCat  = getAQICategory(peakAQI);
  const safeCat  = getAQICategory(lowestAQI);

  return (
    <div className="card fade-in">
      <div className="card-title">
        📈 24-HOUR FORECAST
        <span className="accuracy-badge">
          RMSE&nbsp;8.4 &nbsp;|&nbsp; MAE&nbsp;6.1
        </span>
      </div>

      {/* Peak / Safe stats */}
      <div className="forecast-stats">
        <div className="forecast-stat" style={{ borderColor: `${safeCat.color}40`, background: `${safeCat.color}08` }}>
          <span className="stat-label">LOWEST (SAFE)</span>
          <span className="stat-value" style={{ color: safeCat.color }}>{lowestAQI}</span>
          <span className="stat-time">⏰ {windows.safeStart} – {windows.safeEnd}</span>
        </div>
        <div className="forecast-stat" style={{ borderColor: `${peakCat.color}40`, background: `${peakCat.color}08` }}>
          <span className="stat-label">PEAK POLLUTION</span>
          <span className="stat-value" style={{ color: peakCat.color }}>{peakAQI}</span>
          <span className="stat-time">⏰ {windows.peakStart} – {windows.peakEnd}</span>
        </div>
        <div className="forecast-stat">
          <span className="stat-label">SAFETY SCORE</span>
          <span className="stat-value" style={{ color: peakAQI > 300 ? '#ef4444' : '#22c55e' }}>
            {peakAQI > 300 ? 'POOR' : peakAQI > 200 ? 'FAIR' : 'GOOD'}
          </span>
          <span className="stat-time">Today's outlook</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
            </linearGradient>
            {/* Dynamic stroke gradient */}
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              {gradientStops.map((g, i) => (
                <stop key={i} offset={g.offset} stopColor={g.color} />
              ))}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />

          {/* Safe zone reference */}
          <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.5}
            label={{ value: 'SAFE', fill: '#22c55e', fontSize: 10, fontFamily: 'Orbitron' }} />
          {/* Danger zone */}
          <ReferenceLine y={300} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5}
            label={{ value: 'SEVERE', fill: '#ef4444', fontSize: 10, fontFamily: 'Orbitron' }} />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#475569' }}
            interval={3}
            tickLine={false}
            axisLine={{ stroke: '#1e2d44' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#475569' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="aqi"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            fill="url(#forecastGrad)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        {[
          { color: '#22c55e', label: 'Good (0–100)'   },
          { color: '#eab308', label: 'Moderate (100–200)' },
          { color: '#f97316', label: 'Poor (200–300)'  },
          { color: '#ef4444', label: 'Severe (300+)'   },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
            <div style={{ width: 24, height: 3, borderRadius: 2, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
