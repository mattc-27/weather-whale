import React from 'react';
import '../../../stylesheets/parkstyles.css';

export default function ParkDetailModal({ parkName, onClose, onShowMore, data }) {
    if (!data) return null;

    const {
        fullName,
        elevation,
        location,
        url,
        current,
        forecast = [],
        alerts,
    } = data;

    const tempF = current?.temp_f ?? null;
    const condition = current?.condition?.text ?? '—';
    const conditionIcon = current?.condition?.icon;

    return (
        <div className="park-modal" role="dialog" aria-labelledby="modal-title">
            <button className="close-button" onClick={onClose} aria-label="Close modal">×</button>
            <h2 id="modal-title">{fullName || parkName}</h2>

            {tempF !== null && (
                <p className="temp">
                    {tempF}°F
                    {conditionIcon && (
                        <img
                            src={`https:${conditionIcon}`}
                            alt={condition}
                            className="condition-icon"
                        />
                    )}
                </p>
            )}

            <p className="condition">{condition}</p>

            <div className="forecast">
                {forecast.length > 0 ? (
                    forecast.map(({ day, high, low }, i) => (
                        <p key={i}><strong>{day}</strong>: {high} / {low}</p>
                    ))
                ) : (
                    <p>Forecast unavailable</p>
                )}
            </div>

            {elevation && <p className="elevation">Elevation: {elevation} ft</p>}

            {location?.name && (
                <p className="location">
                    Location: {location.name}, {location.region}
                </p>
            )}

            {url && (
                <p className="nps-link">
                    <a href={url} target="_blank" rel="noopener noreferrer">View on NPS.gov</a>
                </p>
            )}

            <p className="alerts">Alerts: {alerts || 'None'}</p>
            <button className="more-button" onClick={() => onShowMore(parkName)}>
                See more →
            </button>
        </div>
    );
}
