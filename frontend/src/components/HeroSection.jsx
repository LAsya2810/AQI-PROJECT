import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { CITIES, getAQICategory } from '../utils/aqiData';

function AQIGauge({ aqi, cat }) {
  const pct = Math.min(aqi / 500, 1);
  const angle = pct * 180 - 90;
  const r = 80;
  const cx = 100, cy = 100;
  const needleX = cx + (r - 10) * Math.cos((angle * Math.PI) / 180);
  const needleY = cy + (r - 10) * Math.sin((angle * Math.PI) / 180);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="200" height="110" viewBox="0 0 200 110" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="35%"  stopColor="#eab308" />
            <stop offset="65%"  stopColor="#f97316" />
            <stop offset="85%"  stopColor="#ef4444" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1e2d44" strokeWidth="14" strokeLinecap="round"/>
        {/* Fill */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${pct * 251.3} 251.3`}
          style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.16,1,0.3,1)' }}
        />
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={needleX} y2={needleY}
          stroke={cat.color} strokeWidth="3" strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: 'all 1.5s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <circle cx={cx} cy={cy} r="6" fill={cat.color} filter="url(#glow)"/>
        {/* Tick labels */}
        {['0','100','200','300','500'].map((v, i) => {
          const a = (i / 4) * 180 - 90;
          const tx = cx + 92 * Math.cos((a * Math.PI) / 180);
          const ty = cy + 92 * Math.sin((a * Math.PI) / 180);
          return (
            <text key={v} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: 9, fill: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>
              {v}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function HeroSection({ city, onCityChange, aqi, forecast, now }) {
  const cat = getAQICategory(aqi);
  const spark = forecast.slice(0, 7);

  const timeStr  = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr  = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="card fade-in" style={{ marginBottom: 20 }}>
      <div className="card-title">
        🌍 LIVE SITUATIONAL AWARENESS
        <span className="badge">LIVE</span>
      </div>

      <div className="hero-section">
        {/* Big AQI number + gauge */}
        <div className="hero-aqi-block">
          <AQIGauge aqi={aqi} cat={cat}/>
          <div
            className="aqi-number number-glow"
            style={{ color: cat.color, textShadow: `0 0 60px ${cat.glow}` }}
          >
            {aqi}
          </div>
          <div className="aqi-label">AQI INDEX</div>
        </div>

        {/* City + Time */}
        <div className="hero-info-block">
          <div className="city-selector-wrap">
            <label>MONITORING CITY</label>
            <select className="city-selector" value={city} onChange={e => onCityChange(e.target.value)}>
              {Object.keys(CITIES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="datetime-block">
            <div className="time-display">{timeStr}</div>
            <div className="date-display">{dateStr}</div>
          </div>
        </div>

        {/* Category + Risk */}
        <div className="category-block">
          <div
            className="category-pill"
            style={{ color: cat.color, borderColor: `${cat.color}60`, background: `${cat.color}10` }}
          >
            <span style={{ fontSize: 20 }}>
              {aqi <= 50 ? '😊' : aqi <= 100 ? '😐' : aqi <= 200 ? '😷' : aqi <= 300 ? '⚠️' : '☠️'}
            </span>
            {cat.label}
          </div>
          <div className="risk-pill" style={{ color: cat.color }}>
            <div className="risk-dot" style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }}/>
            HEALTH RISK: {cat.risk.toUpperCase()}
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
            {city}, India
          </div>
        </div>

        {/* 6-Hour Sparkline */}
        <div className="sparkline-block">
          <div className="sparkline-label">6-HOUR TREND</div>
          <ResponsiveContainer width="100%" height={70}>
            <LineChart data={spark}>
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor={cat.color} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={cat.color} stopOpacity={1}/>
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="aqi"
                stroke={`url(#sparkGrad)`}
                strokeWidth={2.5}
                dot={false}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569' }}>
            <span>-6h</span>
            <span>NOW</span>
          </div>
        </div>

        {/* Visual scene removed per request — no data changes */}
      </div>
    </div>
  );
}
