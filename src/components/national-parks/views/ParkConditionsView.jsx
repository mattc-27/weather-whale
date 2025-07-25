import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParks } from '../../../context/ParksContext';
import ParkCard from '../park-components/ParkCard';

export default function ParkConditionsView() {
    const { state, dispatch, fetchCurrentConditions } = useParks();
    const { activePark, parks, primaryPark, detailedPark } = state;
    const navigate = useNavigate();

    // Load latest data when activePark changes
    useEffect(() => {
        const parkCode = activePark?.parkCode || activePark;
        if (!parkCode) return;

        const load = async () => {
            await fetchCurrentConditions(parkCode);
            const updated = parks?.[parkCode];
            if (updated) {
                dispatch({ type: 'SET_PRIMARY_PARK', payload: updated });
            }
        };

        load();
    }, [activePark]);

    const parkToShow = detailedPark || primaryPark;

    const handleCompare = () => {
        if (!parkToShow) return;
        dispatch({ type: 'ADD_COMPARE_PARK', payload: parkToShow });
        dispatch({ type: 'SET_VIEW_MODE', payload: 'compare' });
        navigate('/parks/compare');
    };

    return (
        <div style={{ padding: '2rem' }}>
            {parkToShow ? (
                <>
                    <ParkCard park={parkToShow} />
                    <button
                        className="compare-button"
                        onClick={handleCompare}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            fontSize: '1rem',
                            background: '#eef',
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                        }}
                    >
                        Compare with Another Park
                    </button>
                </>
            ) : (
                <p style={{ fontSize: '1rem', color: '#777' }}>
                    Select a park to view current conditions.
                </p>
            )}
        </div>
    );
}
