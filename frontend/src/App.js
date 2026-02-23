import React, { useState, useEffect, useMemo } from 'react';
import './styles.css';

import Sidebar            from './components/Sidebar';
import SkyBackground      from './components/SkyBackground';
import HeroSection        from './components/HeroSection';
import ForecastSection    from './components/ForecastSection';
import ExposureCalculator from './components/ExposureCalculator';
import SafeTimeFinder     from './components/SafeTimeFinder';
import FactorAnalysis     from './components/FactorAnalysis';
import TrendAnalysis      from './components/TrendAnalysis';
import AIInsights         from './components/AIInsights';
import { InstitutionPanel, CityCompare } from './components/InstitutionPanel';

import {
  CITIES,
  getDayNightTheme,
  generateForecast,
  getAQICategory,
} from './utils/aqiData';

export default function App() {
  const [city,      setCity]      = useState('Delhi');
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [mode,      setMode]      = useState('Individual');
  const [now,       setNow]       = useState(new Date());

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour      = now.getHours();
  const theme     = useMemo(() => getDayNightTheme(hour), [hour]);
  const cityData  = CITIES[city];

  // Dynamic AQI with sine-wave variation
  const aqi = useMemo(() => {
    const morningPeak = Math.exp(-Math.pow(hour - 9, 2) / 8) * 50;
    const eveningPeak = Math.exp(-Math.pow(hour - 18, 2) / 6) * 65;
    return Math.max(25, Math.round(cityData.base + morningPeak + eveningPeak));
  }, [cityData, hour]);

  const forecast = useMemo(() => generateForecast(cityData.base), [cityData]);
  const cat      = getAQICategory(aqi);

  // ─── PAGE VIEWS ───────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return (
          <>
            <HeroSection city={city} onCityChange={setCity} aqi={aqi} forecast={forecast} now={now} />
            <div className="sections-grid">
              <ForecastSection forecast={forecast} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <SafeTimeFinder forecast={forecast} />
                <AIInsights aqi={aqi} city={city} forecast={forecast} />
              </div>
            </div>
            <div className="sections-grid">
              <ExposureCalculator aqi={aqi} />
              <FactorAnalysis aqi={aqi} />
            </div>
            <TrendAnalysis cityBase={cityData.base} />
            {mode !== 'Individual' && (
              <div style={{ marginTop: 20 }}>
                <InstitutionPanel mode={mode} aqi={aqi} />
              </div>
            )}
          </>
        );

      case 'Forecast':
        return (
          <>
            <HeroSection city={city} onCityChange={setCity} aqi={aqi} forecast={forecast} now={now} />
            <ForecastSection forecast={forecast} />
            <SafeTimeFinder forecast={forecast} />
          </>
        );

      case 'Calculator':
        return (
          <>
            <HeroSection city={city} onCityChange={setCity} aqi={aqi} forecast={forecast} now={now} />
            <ExposureCalculator aqi={aqi} />
            <AIInsights aqi={aqi} city={city} forecast={forecast} />
          </>
        );

      case 'SafeTime':
        return (
          <>
            <HeroSection city={city} onCityChange={setCity} aqi={aqi} forecast={forecast} now={now} />
            <SafeTimeFinder forecast={forecast} />
            <ForecastSection forecast={forecast} />
          </>
        );

      case 'Trends':
        return (
          <>
            <HeroSection city={city} onCityChange={setCity} aqi={aqi} forecast={forecast} now={now} />
            <TrendAnalysis cityBase={cityData.base} />
            <FactorAnalysis aqi={aqi} />
          </>
        );

      case 'Compare':
        return (
          <>
            <HeroSection city={city} onCityChange={setCity} aqi={aqi} forecast={forecast} now={now} />
            <CityCompare selectedCity={city} onCityChange={setCity} />
            <TrendAnalysis cityBase={cityData.base} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      {/* Dynamic Sky Background */}
      <SkyBackground theme={theme} hour={hour} />

      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        mode={mode}
        onModeChange={setMode}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Top status bar */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          gap: 16, marginBottom: 20, fontSize: 12, color: '#475569',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
              background: '#22c55e', boxShadow: '0 0 6px #22c55e',
              animation: 'pulse-dot 2s infinite',
            }}/>
            LIVE DATA
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span style={{
            padding: '3px 10px', borderRadius: 6,
            background: `${cat.color}15`, border: `1px solid ${cat.color}40`,
            color: cat.color, fontWeight: 700,
          }}>
            {city} · AQI {aqi}
          </span>
        </div>

        {renderContent()}

        {/* Footer */}
        <div style={{
          marginTop: 32, paddingTop: 16,
          borderTop: '1px solid #1e2d44',
          fontSize: 11, color: '#334155',
          textAlign: 'center', fontFamily: "'JetBrains Mono', monospace",
        }}>
          AQI Intelligence Dashboard · Data refreshes every minute · For information purposes only
        </div>
      </main>
    </div>
  );
}
