import React, { useMemo, useState } from 'react';
import { useParks } from '../../../context/ParksContext';
import ParkHistoryView from './ParkHistoryView';
import ParkForecastView from './ParkForecastView';

export default function ParkChartsView() {
    const { state } = useParks();
    const [tab, setTab] = useState('history'); // 'history' | 'forecast'
    const activeCode = state.activePark?.parkCode || state.activePark || null;

    const current = useMemo(() => {
        if (!activeCode) return null;
        return state.parks?.[activeCode] || null;
    }, [state.parks, activeCode]);

    return (
        <div className="charts-view">
            <div className="chart-toggle">
                <button
                    className={tab === 'history' ? 'active' : ''}
                    onClick={() => setTab('history')}
                >
                    History
                </button>
                <button
                    className={tab === 'forecast' ? 'active' : ''}
                    onClick={() => setTab('forecast')}
                >
                    Forecast
                </button>
            </div>

            <div className="conditions-card">
                <div className="conditions-meta">
                    <h2>
                        {current?.fullName ||
                            state.parks?.[activeCode]?.fullName ||
                            activeCode ||
                            'Select a park'}
                    </h2>
                    <p><strong>High:</strong> {current?.high ?? '—'}°F</p>
                    <p><strong>Low:</strong> {current?.low ?? '—'}°F</p>
                    <p><strong>Alerts:</strong> {current?.alerts ?? 'None'}</p>
                </div>
                <div className="conditions-temp">{current?.temp ?? '—'}°F</div>
            </div>

            {tab === 'history' ? (
                <ParkHistoryView parkName={current?.fullName} currentConditions={current} />
            ) : (
                <ParkForecastView parkName={current?.fullName} currentConditions={current} />
            )}
        </div>
    );
}