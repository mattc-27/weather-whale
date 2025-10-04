// src/views/parks/components/ForecastDailyCards.jsx
import React from 'react';

export default function ForecastDailyCards({ daily = [] }) {
  return (
    <div className="forecast-cards">
      {daily.slice(0, 3).map((d) => (
        <div
          key={d.date}
          className="conditions-card"
          style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}
        >
          <div style={{ fontWeight: 600 }}>{d.date}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div><strong>Hi:</strong> {Math.round(d.max)}°F</div>
            <div><strong>Lo:</strong> {Math.round(d.min)}°F</div>
          </div>
          <div style={{ opacity: 0.8 }}>{d.condition || '—'}</div>
        </div>
      ))}
    </div>
  );
}
