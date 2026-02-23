import React, { useState } from 'react';
import { getAQICategory, calculateExposure, USER_MULTIPLIERS, ACTIVITY_MULTIPLIERS } from '../utils/aqiData';

export default function ExposureCalculator({ aqi }) {
  const [userType, setUserType]   = useState('Adult');
  const [activity, setActivity]   = useState('Walking');
  const [duration, setDuration]   = useState(2);

  const { exposureScore, maxSafeTime, maskNeeded, n95Needed } =
    calculateExposure(aqi, userType, activity, duration);

  const cat = getAQICategory(exposureScore / 4);

  return (
    <div className="card fade-in">
      <div className="card-title">🧮 PERSONAL EXPOSURE CALCULATOR</div>

      <div className="calc-grid">
        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* User Type */}
          <div className="input-group">
            <label>USER TYPE</label>
            <div className="pill-select">
              {Object.keys(USER_MULTIPLIERS).map(t => (
                <button
                  key={t}
                  className={`pill-btn ${userType === t ? 'active' : ''}`}
                  onClick={() => setUserType(t)}
                  style={{ '--accent-color': '#38bdf8' }}
                >
                  {t === 'Child' ? '👶' : t === 'Adult' ? '🧑' : t === 'Elderly' ? '👴' : '🫁'} {t}
                </button>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="input-group">
            <label>ACTIVITY LEVEL</label>
            <div className="pill-select">
              {Object.keys(ACTIVITY_MULTIPLIERS).map(a => (
                <button
                  key={a}
                  className={`pill-btn ${activity === a ? 'active' : ''}`}
                  onClick={() => setActivity(a)}
                  style={{ '--accent-color': '#f97316' }}
                >
                  {a === 'Resting' ? '🛋' : a === 'Walking' ? '🚶' : a === 'Running' ? '🏃' : '⛏'} {a}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="input-group">
            <label>PLANNED DURATION</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <input
                type="range" min={0.5} max={8} step={0.5}
                value={duration}
                onChange={e => setDuration(+e.target.value)}
                className="duration-slider"
                style={{ flex: 1 }}
              />
              <div>
                <span className="duration-value">{duration}</span>
                <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="exposure-output" style={{ borderColor: `${cat.color}40`, background: `${cat.color}06` }}>
          <div style={{ fontSize: 11, color: '#64748b', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
            EXPOSURE SCORE
          </div>
          <div
            className="exposure-score-num"
            style={{ color: cat.color, textShadow: `0 0 30px ${cat.glow}` }}
          >
            {exposureScore}
          </div>

          <div className="output-row">
            <span className="output-key">RISK LEVEL</span>
            <span className="output-val" style={{ color: cat.color }}>{cat.risk}</span>
          </div>

          <div className="output-row">
            <span className="output-key">MAX SAFE TIME</span>
            <span className="output-val" style={{ color: '#38bdf8' }}>
              {maxSafeTime >= 1 ? `${maxSafeTime} hrs` : `${Math.round(maxSafeTime * 60)} min`}
            </span>
          </div>

          <div className="output-row">
            <span className="output-key">AQI EXPOSURE</span>
            <span className="output-val" style={{ color: '#e2e8f0' }}>{aqi} × {USER_MULTIPLIERS[userType]}× {ACTIVITY_MULTIPLIERS[activity]}</span>
          </div>

          <div className="output-row" style={{ border: 'none', paddingBottom: 0 }}>
            <span className="output-key">MASK</span>
            <div>
              {n95Needed ? (
                <span className="mask-badge" style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444440' }}>
                  😷 N95 Required
                </span>
              ) : maskNeeded ? (
                <span className="mask-badge" style={{ background: '#eab30815', color: '#eab308', border: '1px solid #eab30840' }}>
                  😷 Recommended
                </span>
              ) : (
                <span className="mask-badge" style={{ background: '#22c55e15', color: '#22c55e', border: '1px solid #22c55e40' }}>
                  ✅ Not Required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
