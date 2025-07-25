import React, { useMemo, useState } from 'react';
import { useParks } from '../../../context/ParksContext';
import ParkCard from '../park-components/ParkCard';
import { FaTimes } from 'react-icons/fa';

export default function ParkComparisonView() {
    const { state, dispatch } = useParks();
    const { compareParks, parks } = state;

    const [searchInput, setSearchInput] = useState('');

    const parkObjects = useMemo(() =>
        compareParks.map(p => parks?.[p.parkCode]).filter(Boolean),
        [compareParks, parks]
    );

    const handleRemove = (parkCode) => {
        dispatch({ type: 'REMOVE_COMPARE_PARK', payload: parkCode });
    };

    return (
        <div style={{ padding: '2rem' }}>
            {parkObjects.length === 0 && (
                <p style={{ fontSize: '1rem', color: '#555' }}>
                    Add 1–2 parks from the sidebar to begin comparison.
                </p>
            )}

            {parkObjects.map((park) => (
                <div key={park.parkCode} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => handleRemove(park.parkCode)}
                        title="Remove"
                        style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            background: 'transparent',
                            border: 'none',
                            color: '#555',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            zIndex: 1
                        }}
                    >
                        <FaTimes />
                    </button>
                    <ParkCard park={park} />
                </div>
            ))}
        </div>
    );
}
