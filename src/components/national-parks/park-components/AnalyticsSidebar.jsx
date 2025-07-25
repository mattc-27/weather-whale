import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TempRangeFilter from './TempRangeFilter';
import ParkSearchInput from './ParkSearchInput';
import { useParks } from '../../../context/ParksContext';
import { openParkDetails } from '../../../util/handlers';

export default function AnalyticsSidebar({ viewPath, sidebarWidth, startResizing, closeSidebar }) {

    const [searchInput, setSearchInput] = useState('');
    const { state, dispatch, fetchCurrentConditions } = useParks();
    const {
        searchTerm,
        filteredParks,
        tempRange,
        minTemp,
        maxTemp,
        compareParks,
        primaryPark,
    } = state;

    const navigate = useNavigate();

    const handleClearSearch = () => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: '' });
        setSearchInput('');
    };

    const handleAddCompare = async (park) => {
        const code = park.parkCode;
        const alreadyAdded = compareParks.some(p => p.parkCode === code);
        if (alreadyAdded || compareParks.length >= 2) return;

        await fetchCurrentConditions();
        dispatch({ type: 'ADD_COMPARE_PARK', payload: park });
        setSearchInput('');
        if (closeSidebar) closeSidebar(); // ✅ here too
    };

    const renderCompareSearch = () => {
        if (compareParks.length < 2) {
            return (
                <ParkSearchInput
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSelect={handleAddCompare}
                    placeholder="Add park to compare..."
                    exclude={compareParks.map(p => p.parkCode)}
                />
            );
        }

        return (
            <>
                <p className="sidebar-note">Max parks added. Remove one or reset.</p>
                <button
                    className="reset-comparison"
                    onClick={() => dispatch({ type: 'RESET_ALL_PARKS' })}
                >
                    Reset Comparison
                </button>
            </>
        );
    };

    const renderDetailsSearch = () => (
        <ParkSearchInput
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onSelect={(park) => {
                dispatch({ type: 'SET_DETAILED_PARK', payload: park });
                openParkDetails(dispatch, park, navigate);
                setSearchInput('');
                if (closeSidebar) closeSidebar(); // ✅ Add this
            }}
            placeholder="Search for park..."
            exclude={compareParks.map((p) => p.parkCode)}
        />
    );

    const renderMapFilters = () => (
        <TempRangeFilter
            range={tempRange}
            min={minTemp}
            max={maxTemp}
            onChange={(newRange) => dispatch({ type: 'SET_TEMP_RANGE', payload: newRange })}
        />
    );

    const renderSearchUI = () => {
        if (viewPath === '/parks/compare') return renderCompareSearch();
        if (viewPath === '/parks/details') return renderDetailsSearch();
        return renderMapFilters();
    };

    return (
        <aside className="sidebar" style={{ width: `${sidebarWidth}px` }}>
            <div className="sidebar-title">
                {/* Close button (mobile only) */}
                <button className="sidebar-close" onClick={closeSidebar} aria-label="Close Sidebar">
                    ×
                </button>

                <h2>Park Weather Tools</h2>
                <p>
                    Explore current conditions, filter by temperature, and view detailed data or compare parks.
                </p>
                {searchTerm && (
                    <button onClick={handleClearSearch} className="clear-search">
                        Clear
                    </button>
                )}
            </div>

            {renderSearchUI()}

            <div className="sidebar-resizer" onMouseDown={startResizing} />

            <div className="sidebar-info">
                <p>{filteredParks.length} park(s) shown</p>
            </div>
        </aside>
    );
}
