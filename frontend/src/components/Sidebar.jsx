import React from 'react';

const NAV_ITEMS = [
  { id: 'Dashboard',    icon: '🏠', label: 'Dashboard'         },
  { id: 'Forecast',     icon: '📈', label: 'Forecast'          },
  { id: 'Calculator',   icon: '🧮', label: 'Exposure Calc'     },
  { id: 'SafeTime',     icon: '🕒', label: 'Safe Time Planner' },
  { id: 'Trends',       icon: '📊', label: 'Trends & Analysis' },
  { id: 'Compare',      icon: '📍', label: 'City Compare'      },
];

const MODES = ['Individual', 'School', 'Office'];

export default function Sidebar({ activeNav, onNavChange, mode, onModeChange }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">🌫</span>
        <h1>AQI<br />Intelligence</h1>
        <p>REAL-TIME AIR MONITOR</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Mode Toggle */}
      <div className="sidebar-footer">
        <div className="mode-toggle-group">
          <label>MODE</label>
          <div className="mode-pills">
            {MODES.map((m) => (
              <button
                key={m}
                className={`mode-pill ${mode === m ? 'active' : ''}`}
                onClick={() => onModeChange(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
