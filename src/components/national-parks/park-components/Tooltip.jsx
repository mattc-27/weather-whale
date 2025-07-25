// ParkTooltip.jsx
import React from 'react';

export default function ParkTooltip({ x, y, park, temp, onMoreClick }) {
  return (
    <div
      className="park-tooltip"
      style={{
        position: 'absolute',
        top: y - 40,
        left: x + 10,
        background: '#333',
        color: 'white',
        padding: '0.5rem 0.75rem',
        borderRadius: '5px',
        pointerEvents: 'auto',
        zIndex: 10
      }}
    >
      <div><strong>{park}</strong></div>
      <div>{temp} °F</div>
      <button onClick={onMoreClick} style={{ marginTop: '6px' }}>More</button>
    </div>
  );
}
