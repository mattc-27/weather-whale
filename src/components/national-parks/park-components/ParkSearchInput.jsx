// components/ParkSearchInput.js
import React, { useMemo, useState } from 'react';
import { useParks } from '../../../context/ParksContext';

export default function ParkSearchInput({
    searchInput,
    setSearchInput,
    onSelect,
    placeholder = 'Search park...',
    limit = 10,
    exclude = [],
}) {
    const { state } = useParks();
    const { parks } = state;

    const matchedResults = useMemo(() => {
        const term = searchInput.trim().toLowerCase();
        if (!term) return [];
        return Object.values(parks)
            .filter(
                (p) =>
                    (p.name?.toLowerCase().includes(term) || p.fullName?.toLowerCase().includes(term)) &&
                    !exclude.includes(p.parkCode)
            )
            .slice(0, limit);
    }, [searchInput, parks, exclude, limit]);
    return (
        <div className="filter-group" style={{ maxWidth: '400px', marginBottom: '1rem' }}>
            <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={placeholder}
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            />
            {searchInput && matchedResults.length > 0 && (
                <ul className="search-results">
                    {matchedResults.map((park) => (
                        <li
                            key={park.parkCode}
                            className="search-result-item"
                            onClick={() => {
                                onSelect(park);
                                setSearchInput('');
                            }}
                            style={{ cursor: 'pointer', padding: '0.5rem 0' }}
                        >
                            {park.fullName || park.name} — {park.state}
                        </li>
                    ))}
                </ul>
            )}
            {searchInput && matchedResults.length === 0 && (
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>No matching parks found.</p>
            )}
        </div>
    );
}
