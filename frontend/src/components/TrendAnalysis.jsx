import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { getAQICategory, generate7Day } from '../utils/aqiData';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const cat = getAQICategory(val);
  return (
    <div className="custom-tooltip">
      <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: cat.color }}>{val}</div>
      <div style={{ fontSize: 12, color: cat.color }}>{cat.label}</div>
    </div>
  );
}

export default function TrendAnalysis({ cityBase }) {
  const data = generate7Day(cityBase);
  const avg  = Math.round(data.reduce((s, d) => s + d.aqi, 0) / data.length);
  const max  = Math.max(...data.map(d => d.aqi));
  const min  = Math.min(...data.map(d => d.aqi));
  const maxDay = data.find(d => d.aqi === max)?.day;

  // Compare first half vs second half for trend
  const firstHalf = data.slice(0, 3).reduce((s, d) => s + d.aqi, 0) / 3;
  const secondHalf = data.slice(4).reduce((s, d) => s + d.aqi, 0) / 3;
  const trendPct = Math.abs(Math.round(((secondHalf - firstHalf) / firstHalf) * 100));
  const improving = secondHalf < firstHalf;

  return (
    <div className="card fade-in">
      <div className="card-title">🌱 7-DAY TREND ANALYSIS</div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={getAQICategory(d.aqi).color}
                opacity={d.isToday ? 1 : 0.6}
                stroke={d.isToday ? '#fff' : 'none'}
                strokeWidth={d.isToday ? 1.5 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="trend-stats-row">
        <div className="trend-stat">
          <div className="t-label">WEEKLY AVG</div>
          <div className="t-value" style={{ color: getAQICategory(avg).color }}>{avg}</div>
        </div>
        <div className="trend-stat">
          <div className="t-label">WORST DAY</div>
          <div className="t-value" style={{ color: '#ef4444' }}>{maxDay} · {max}</div>
        </div>
        <div className="trend-stat">
          <div className="t-label">BEST AQI</div>
          <div className="t-value" style={{ color: '#22c55e' }}>{min}</div>
        </div>
        <div className="trend-stat">
          <div className="t-label">TREND</div>
          <div className="t-value" style={{ color: improving ? '#22c55e' : '#ef4444' }}>
            {improving ? '↓' : '↑'} {trendPct}%
            <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'Rajdhani', marginLeft: 4 }}>
              {improving ? 'Improving' : 'Worsening'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
