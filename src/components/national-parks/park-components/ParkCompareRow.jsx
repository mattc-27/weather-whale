import React from 'react';

export default function ParkCompareRow({ parks }) {
  if (!Array.isArray(parks) || parks.length < 2) return null;

  return (
    <div style={{ display: 'flex', borderTop: '1px solid #ccc', marginTop: '2rem' }}>
      {parks.map((park, index) => (
        <div
          key={park.parkCode || index}
          style={{
            flex: 1,
            padding: '1rem',
            borderLeft: index === 1 ? '1px solid #ddd' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{park.fullName}</h2>
          <a href={park.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem' }}>
            {park.url}
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src={park.condition_icon} alt={park.condition_text} />
            <span>{park.condition_text}</span>
          </div>
          <div>
            <strong>Temp:</strong> {park.temp_f}°F
          </div>
          <div>
            <strong>Humidity:</strong> {park.current?.humidity}%
          </div>
          <div>
            <strong>Wind:</strong> {park.current?.wind_mph} mph {park.current?.wind_dir}
          </div>
          <div>
            <strong>Local Time:</strong> {park.location?.localtime}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            {park.location?.name}, {park.state}
          </div>
        </div>
      ))}
    </div>
  );
}
