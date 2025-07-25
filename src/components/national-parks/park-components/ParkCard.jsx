import React from 'react';
import { WeatherIconsReformatted } from '../../../assets/WeatherIconsReformatted';

export default function ParkCard({ park }) {
    const humidity = park.current?.humidity ?? '—';
    const windDir = park.current?.wind_dir ?? '—';
    const windMph = park.current?.wind_mph ?? '—';

    const condition = park.current?.condition?.code;
    const iconMatch = WeatherIconsReformatted.find(({ code }) => code === condition);
    const IconComponent = iconMatch?.IconComponent;

    return (
        <div className="park-card">
            {park.fullName ? (
                <>
                    <h2 className="park-name">{park.fullName}</h2>
                    <p className="park-state">{park.state}</p>
                </>
            ) : (
                <h2 className="park-name">{park.state}</h2>
            )}

            <div className="park-icon">
                {IconComponent ? (
                    <IconComponent size={48} title={iconMatch?.label || `Condition ${condition}`} />
                ) : (
                    <p>{condition ?? '—'}</p>
                )}
            </div>

            <div className="park-conditions">
                <p><strong>Temperature:</strong> {park.temp_f ?? '—'}°F</p>
                <p><strong>Humidity:</strong> {humidity}%</p>
                <p><strong>Wind:</strong> {windDir} {windMph} mph</p>
            </div>
        </div>
    );
}
