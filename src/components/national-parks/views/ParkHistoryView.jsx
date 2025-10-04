import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ParkHistoryChart from '../d3-components/ParkHistoryChart';
import { useParks } from '../../../context/ParksContext';
// earliest file we have

const EARLIEST_DATE = '2025-07-18';

const ymd = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));
const parseLooseTime = (s) => {
    if (!s) return null;
    const iso = s.includes('T') ? s : `${s}:00`.replace(' ', 'T') + 'Z';
    const d = new Date(iso);
    return Number.isNaN(+d) ? null : d;
};

export default function ParkHistoryView({ parkName, currentConditions }) {
    const { state } = useParks();
    const parkCode =
        state.activePark?.parkCode || state.activePark || currentConditions?.parkCode;

    const [windowDays, setWindowDays] = useState(5);
    const [endDate, setEndDate] = useState(() => new Date());
    const [daysByDate, setDaysByDate] = useState({});

    const fetchWindow = useCallback(async (code, end, days) => {
        if (!code) return;
        const endStr = ymd(end);
        const res = await fetch(
            `/api/park-conditions-history?parks=${code}&end=${endStr}&days=${days}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return;
        const { data } = await res.json();
        const entry = (data || []).find((e) => e.park.toLowerCase() === code.toLowerCase());
        setDaysByDate(entry?.hourly || {});
        if (Object.keys(entry?.hourly || {}).length) {
            const maxDate = Object.keys(entry.hourly).sort().at(-1);
            if (maxDate) setEndDate(new Date(maxDate + 'T00:00:00Z'));
        }
    }, []);

    useEffect(() => {
        if (parkCode) fetchWindow(parkCode, endDate, windowDays);
    }, [parkCode, windowDays]); // eslint-disable-line react-hooks/exhaustive-deps

    const canPrev = useMemo(() => {
        const start = addDays(endDate, -(windowDays - 1));
        return ymd(start) > EARLIEST_DATE;
    }, [endDate, windowDays]);

    const goPrev = useCallback(() => {
        const newEnd = addDays(endDate, -windowDays);
        const startCandidate = addDays(newEnd, -(windowDays - 1));
        const earliest = new Date(EARLIEST_DATE + 'T00:00:00Z');
        const delta = earliest - startCandidate;
        const endClamped =
            delta > 0 ? addDays(newEnd, Math.ceil(delta / 86400000)) : newEnd;
        setEndDate(endClamped);
        fetchWindow(parkCode, endClamped, windowDays);
    }, [endDate, windowDays, parkCode, fetchWindow]);

    const goNext = useCallback(() => {
        const newEnd = addDays(endDate, windowDays);
        setEndDate(newEnd);
        fetchWindow(parkCode, newEnd, windowDays);
    }, [endDate, windowDays, parkCode, fetchWindow]);

    const windowData = useMemo(() => {
        const dates = Object.keys(daysByDate).sort();
        return dates.flatMap((d) => {
            const hours = daysByDate[d] || [];
            return hours.map((h) => ({
                park: parkName || state.parks?.[parkCode]?.fullName || parkCode,
                datetime: parseLooseTime(h.time || h.datetime),
                temp: h.tempF ?? h.temp ?? null,
                precip: h.precipIn ?? h.precip ?? 0,
                cloud: h.cloud ?? 0,
            }));
        });
    }, [daysByDate, parkCode, parkName, state.parks]);

    const headingStart = useMemo(() => {
        const sorted = Object.keys(daysByDate).sort();
        return sorted[0] || null;
    }, [daysByDate]);

    const headingEnd = useMemo(() => {
        const sorted = Object.keys(daysByDate).sort();
        return sorted.at(-1) || null;
    }, [daysByDate]);

    return (
        <div className="history-view">
            <div className="conditions-card">
                <div className="conditions-meta">
                    <h2>{parkName || state.parks?.[parkCode]?.fullName || parkCode}</h2>
                    <p><strong>High:</strong> {currentConditions?.high ?? '—'}°F</p>
                    <p><strong>Low:</strong> {currentConditions?.low ?? '—'}°F</p>
                    <p><strong>Alerts:</strong> {currentConditions?.alerts ?? 'None'}</p>
                </div>
                <div className="conditions-temp">{currentConditions?.temp ?? '—'}°F</div>
            </div>

            <div className="history-controls">
                <div className="history-nav">
                    <button onClick={goPrev} disabled={!canPrev}>← Prev {windowDays}d</button>
                    <button onClick={goNext}>Next {windowDays}d →</button>
                </div>

                <div className="zoom-buttons">
                    <span className="zoom-label">Zoom:</span>
                    {[5, 10, 15, 30].map((d) => (
                        <button
                            key={d}
                            onClick={() => setWindowDays(d)}
                            className={d === windowDays ? 'active' : ''}
                        >
                            {d}d
                        </button>
                    ))}
                </div>

                <div className="history-date-range">
                    {headingStart && headingEnd
                        ? `Showing ${headingStart} — ${headingEnd}`
                        : 'Loading…'}
                </div>
            </div>

            <section className="chart-section">
                <h3>Historical ({windowDays}-day window)</h3>
                <ParkHistoryChart
                    data={windowData}
                    layers={{ temp: true, precip: true, cloud: false }}
                    showMonthTicks
                    showTooltips
                />
            </section>
        </div>
    );
}