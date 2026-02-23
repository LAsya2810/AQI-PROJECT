import React from 'react';
import { getAQICategory, findSafeWindows } from '../utils/aqiData';

export default function SafeTimeFinder({ forecast }) {
  const windows = findSafeWindows(forecast);
  const safeCat = getAQICategory(windows.minAQI);
  const peakCat = getAQICategory(windows.maxAQI);

  // Timeline visualization: 24 blocks
  const hour24 = forecast.slice(0, 24);

  return (
    <div className="card fade-in">
      <div className="card-title">🕒 SAFE OUTDOOR TIME FINDER</div>

      <div className="safe-time-grid">
        <div className="time-window-card safe">
          <div className="window-label" style={{ color: '#22c55e' }}>✅ BEST WINDOW</div>
          <div className="window-time" style={{ color: '#22c55e' }}>
            {windows.safeStart} – {windows.safeEnd}
          </div>
          <div className="window-aqi" style={{ color: safeCat.color }}>{windows.minAQI}</div>
          <div className="window-desc">Lowest pollution — ideal for outdoor activities</div>
        </div>

        <div className="time-window-card avoid">
          <div className="window-label" style={{ color: '#ef4444' }}>🚫 AVOID GOING OUT</div>
          <div className="window-time" style={{ color: '#ef4444' }}>
            {windows.peakStart} – {windows.peakEnd}
          </div>
          <div className="window-aqi" style={{ color: peakCat.color }}>{windows.maxAQI}</div>
          <div className="window-desc">Peak pollution — stay indoors if possible</div>
        </div>

        {windows.maxAQI > 250 && (
          <div className="spike-alert">
            <span style={{ fontSize: 20 }}>⚠️</span>
            POLLUTION SPIKE ALERT — AQI expected to reach {windows.maxAQI} during peak hours
          </div>
        )}
      </div>

      {/* 24-hour heatmap timeline */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          HOURLY RISK HEATMAP
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {hour24.map((h, i) => {
            const cat = getAQICategory(h.aqi);
            return (
              <div
                key={i}
                title={`${h.time}: AQI ${h.aqi} (${cat.label})`}
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: 4,
                  background: cat.color,
                  opacity: 0.7,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.transform = 'scaleY(1.2)'; }}
                onMouseLeave={e => { e.target.style.opacity = 0.7; e.target.style.transform = 'scaleY(1)'; }}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>
    </div>
  );
}
