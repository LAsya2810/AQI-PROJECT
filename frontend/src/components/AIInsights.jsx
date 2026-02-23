import React, { useState } from 'react';
import { getAQICategory } from '../utils/aqiData';

export default function AIInsights({ aqi, city, forecast }) {
  const [insight, setInsight]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [asked, setAsked]       = useState(false);

  const minForecast = Math.min(...forecast.map(f => f.aqi));
  const maxForecast = Math.max(...forecast.map(f => f.aqi));
  const cat = getAQICategory(aqi);

  const fetchInsight = async () => {
    setLoading(true);
    setAsked(true);
    try {
      // Call backend AI advisor endpoint
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${API_URL}/ai-advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: city,
          aqi: aqi,
          min_forecast: minForecast,
          max_forecast: maxForecast
        }),
      });
      
      if (!res.ok) throw new Error('API request failed');
      
      const data = await res.json();
      setInsight(data.insight || 'Unable to generate insight.');
    } catch (err) {
      console.error('Error fetching insight:', err);
      setInsight('AI insight unavailable. Backend service may be down. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in" style={{ borderColor: '#818cf840' }}>
      <div className="card-title">
        🤖 AI HEALTH ADVISORY
        <span className="badge" style={{ background: '#818cf8', color: '#000' }}>CLAUDE AI</span>
      </div>

      {!asked ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
            Get a personalized health advisory based on current AQI data
          </div>
          <button
            onClick={fetchInsight}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #818cf820, #6366f120)',
              border: '1px solid #818cf840',
              borderRadius: 10,
              color: '#818cf8',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 1,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => e.target.style.background = '#818cf830'}
            onMouseLeave={e => e.target.style.background = 'linear-gradient(135deg, #818cf820, #6366f120)'}
          >
            ✨ Generate AI Advisory
          </button>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', color: '#818cf8' }}>
          <div style={{ animation: 'spin 1s linear infinite', fontSize: 20 }}>⟳</div>
          <span style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
            Claude is analyzing air quality data...
          </span>
        </div>
      ) : (
        <div>
          <div style={{
            padding: '16px',
            background: '#818cf808',
            borderRadius: 10,
            border: '1px solid #818cf830',
            fontSize: 14,
            lineHeight: 1.7,
            color: '#cbd5e1',
            marginBottom: 12,
          }}>
            {insight}
          </div>
          <button
            onClick={fetchInsight}
            style={{
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid #1e2d44',
              borderRadius: 8,
              color: '#475569',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            ↻ Refresh
          </button>
        </div>
      )}
    </div>
  );
}
