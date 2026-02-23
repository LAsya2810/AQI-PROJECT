import React from 'react';
import { CITIES, getAQICategory, INSTITUTION_RULES } from '../utils/aqiData';

export function InstitutionPanel({ mode, aqi }) {
  const rules = INSTITUTION_RULES[mode];
  const triggered = mode !== 'Individual' && aqi > rules.threshold;

  if (mode === 'Individual') return null;

  return (
    <div
      className="card fade-in"
      style={{
        borderColor: triggered ? '#f9731650' : '#1e2d44',
        background:  triggered ? '#1c0a0510' : undefined,
      }}
    >
      <div className="card-title">
        🏫 {mode.toUpperCase()} MODE
        <span
          className="badge"
          style={{ background: triggered ? '#ef4444' : '#22c55e', color: '#000' }}
        >
          {triggered ? 'ALERT ACTIVE' : 'ALL CLEAR'}
        </span>
      </div>

      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
        Alert threshold: AQI &gt; {rules.threshold} &nbsp;|&nbsp; Current: <strong style={{ color: getAQICategory(aqi).color }}>{aqi}</strong>
      </div>

      {triggered ? (
        <div className="institution-warnings">
          {rules.warnings.map((w, i) => (
            <div key={i} className="inst-warn" style={{ animationDelay: `${i * 0.1}s` }}>
              {w}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '16px', borderRadius: 10, background: '#052e1615',
          border: '1px solid #22c55e30', color: '#22c55e',
          fontSize: 14, fontWeight: 600,
        }}>
          ✅ Air quality within acceptable range for {mode.toLowerCase()} operations
        </div>
      )}
    </div>
  );
}

export function CityCompare({ selectedCity, onCityChange }) {
  const cityAQIs = Object.entries(CITIES).map(([name, data]) => {
    const hour = new Date().getHours();
    const variation = Math.sin(hour * 0.5) * 20;
    return { name, aqi: Math.round(data.base + variation), state: data.state };
  });

  return (
    <div className="card fade-in">
      <div className="card-title">📍 MULTI-CITY COMPARISON</div>
      <div className="city-compare-grid">
        {cityAQIs.map(c => {
          const cat = getAQICategory(c.aqi);
          return (
            <div
              key={c.name}
              className={`city-compare-card ${selectedCity === c.name ? 'selected' : ''}`}
              onClick={() => onCityChange(c.name)}
              style={{
                borderColor: selectedCity === c.name ? cat.color : undefined,
                background:  selectedCity === c.name ? `${cat.color}10` : undefined,
              }}
            >
              <div className="ccc-city">{c.state}</div>
              <div className="ccc-aqi" style={{ color: cat.color, textShadow: `0 0 20px ${cat.glow}` }}>
                {c.aqi}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', margin: '4px 0 2px' }}>{c.name}</div>
              <div className="ccc-cat" style={{ color: cat.color }}>{cat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
