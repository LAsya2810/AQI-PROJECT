import React, { useMemo } from 'react';

// Pre-generate random star positions
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  top:  `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2.5 + 0.5,
  dur:  `${Math.random() * 4 + 2}s`,
  delay:`${Math.random() * 4}s`,
}));

export default function SkyBackground({ theme, hour }) {
  const showStars = theme.star;

  const skyGradient = useMemo(() => {
    const gradients = {
      dawn:      'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 30%, #6b2d6b 60%, #d97706 100%)',
      morning:   'linear-gradient(180deg, #0a1628 0%, #0f2040 40%, #1a3a6e 100%)',
      afternoon: 'linear-gradient(180deg, #060e1a 0%, #0a1e35 50%, #0d2544 100%)',
      dusk:      'linear-gradient(180deg, #1a0e2e 0%, #2d1244 30%, #7c2d52 60%, #c2410c 100%)',
      night:     'linear-gradient(180deg, #030711 0%, #060d1a 50%, #09122a 100%)',
      midnight:  'linear-gradient(180deg, #020509 0%, #04080f 50%, #060c1e 100%)',
    };

    const tod = (() => {
      if (hour >= 5  && hour < 8)  return 'dawn';
      if (hour >= 8  && hour < 12) return 'morning';
      if (hour >= 12 && hour < 17) return 'afternoon';
      if (hour >= 17 && hour < 20) return 'dusk';
      if (hour >= 20 && hour < 24) return 'night';
      return 'midnight';
    })();

    return gradients[tod];
  }, [hour]);

  // Sun/moon position based on hour
  const orbStyle = useMemo(() => {
    // sun: rises at 6 (left), sets at 18 (right)
    const isSun = hour >= 6 && hour < 20;
    const progress = isSun
      ? (hour - 6) / 14
      : hour >= 20 ? (hour - 20) / 8 : (hour + 4) / 8;

    const xPct = progress * 80 + 5;
    const yPct = isSun
      ? Math.sin(progress * Math.PI) * -30 + 20
      : Math.sin(progress * Math.PI) * -15 + 15;

    return {
      left:    `${xPct}%`,
      top:     `${yPct}%`,
      opacity: isSun ? 0.9 : 0.7,
      isSun,
    };
  }, [hour]);

  return (
    <>
      {/* Sky gradient */}
      <div
        className="sky-bg"
        style={{ background: skyGradient }}
      />

      {/* Stars (night only) */}
      {showStars && (
        <div className="stars-layer" style={{ opacity: hour >= 20 || hour < 5 ? 1 : 0.3 }}>
          {STARS.map((s) => (
            <div
              key={s.id}
              className="star"
              style={{
                top:    s.top,
                left:   s.left,
                width:  s.size,
                height: s.size,
                '--dur':   s.dur,
                '--delay': s.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Sun or Moon orb */}
      <div
        className={`sky-orb ${orbStyle.isSun ? 'sun' : 'moon'}`}
        style={{
          left:    orbStyle.left,
          top:     orbStyle.top,
          opacity: orbStyle.opacity,
          position: 'fixed',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
