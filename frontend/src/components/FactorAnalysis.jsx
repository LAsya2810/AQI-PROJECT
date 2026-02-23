import React from 'react';
import { getFeatureImportance } from '../utils/aqiData';

export default function FactorAnalysis({ aqi }) {
  const features = getFeatureImportance(aqi);

  return (
    <div className="card fade-in">
      <div className="card-title">
        📊 POLLUTION FACTOR ANALYSIS
        <span className="badge">EXPLAINABLE AI</span>
      </div>

      <div style={{ fontSize: 12, color: '#475569', marginBottom: 20, lineHeight: 1.6 }}>
        Feature importance from ML model — why AQI is at {aqi} today
      </div>

      {features.map((f) => (
        <div key={f.name} className="feature-bar-row">
          <div className="feature-name">{f.name}</div>
          <div className="feature-track">
            <div
              className="feature-fill"
              style={{
                width:      `${f.value}%`,
                background: `linear-gradient(90deg, ${f.color}60, ${f.color})`,
                boxShadow:  `0 0 8px ${f.color}40`,
              }}
            />
          </div>
          <div className="feature-pct" style={{ color: f.color }}>
            {f.value}%
          </div>
        </div>
      ))}

      {/* Explanation chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
        {[
          { label: 'PM2.5 is the dominant pollutant', icon: '🔴' },
          { label: 'Low wind is trapping particles',  icon: '💨' },
          { label: 'High humidity worsens particle suspension', icon: '💧' },
        ].map(c => (
          <div
            key={c.label}
            style={{
              padding: '6px 12px',
              background: '#0d1f35',
              border: '1px solid #1e3a5f',
              borderRadius: 8,
              fontSize: 12,
              color: '#94a3b8',
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
          >
            {c.icon} {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
