// src/views/parks/ParkForecastView.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParks } from '../../../context/ParksContext';
import ParkForecastChart from '../d3-components/ParkForecastChart';
import ForecastDailyCards from '../park-components/ForecastDailyCards';

const toDate = (s) => {
    if (!s) return null;
    const iso = s.includes('T') ? s : `${s}:00`.replace(' ', 'T') + 'Z';
    const d = new Date(iso);
    return Number.isNaN(+d) ? null : d;
};

export default function ParkForecastView({ parkName, currentConditions }) {
    const { state } = useParks();
    const parkCode =
        state.activePark?.parkCode || state.activePark || currentConditions?.parkCode;

    const [horizon, setHorizon] = useState(72); // 24 | 48 | 72
    const [hourly, setHourly] = useState([]);
    const [daily, setDaily] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchForecastLatest = useCallback(async (code) => {
        const r = await fetch(`/api/park-conditions-forecast?parks=${code}`);
        if (!r.ok) return null;
        const j = await r.json();
        return j.data?.find((d) => d.park === code) || null;
    }, []);

    useEffect(() => {
        (async () => {
            if (!parkCode) return;
            setLoading(true);
            try {
                const entry = await fetchForecastLatest(parkCode);
                console.log(entry)
                if (!entry) return;
                setHourly(entry.hourly || []);
                setDaily(entry.daily || []);
            } finally {
                setLoading(false);
            }
        })();
    }, [parkCode, fetchForecastLatest]);

    const chartData = useMemo(() => {
        const trimmed = hourly.slice(0, horizon);
        return trimmed
            .map((h) => ({
                park: parkName || state.parks?.[parkCode]?.fullName || parkCode,
                datetime: toDate(h.datetime || h.time),
                temp: h.temp ?? h.temp_f ?? null,
                precip: h.precip ?? h.precip_in ?? 0,
                cloud: h.cloud ?? 0,
            }))
            .filter((d) => d.datetime instanceof Date && !Number.isNaN(+d.datetime))
            .sort((a, b) => +a.datetime - +b.datetime);
    }, [hourly, horizon, parkCode, parkName, state.parks]);

    return (
        <div className="forecast-view">
            <div className="history-controls">
                <div className="zoom-buttons">
                    <span className="zoom-label">Horizon:</span>
                    {[24, 48, 72].map((h) => (
                        <button
                            key={h}
                            onClick={() => setHorizon(h)}
                            className={h === horizon ? 'active' : ''}
                        >
                            {h}h
                        </button>
                    ))}
                </div>
                <div className="history-date-range">
                    {chartData.length ? 'Latest issued forecast • next 72h available' : 'Loading…'}
                </div>
            </div>

            <section className="chart-section">
                <h3>Forecast (next {horizon} hours)</h3>
                <ParkForecastChart
                    data={chartData}
                    layers={{ temp: true, precip: true, cloud: false }}
                    showTooltips
                />
            </section>

            {daily?.length ? (
                <section className="chart-section">
                    <h3>Daily outlook</h3>
                    <ForecastDailyCards daily={daily} />
                </section>
            ) : null}

            {loading && <div className="history-date-range">Loading forecast…</div>}
        </div>
    );
}
