import React from 'react';

export default function TempRangeFilter({ range, onChange, min, max }) {
    const handleMinChange = (e) => {
        const newMin = +e.target.value;
        if (newMin <= range[1]) {
            onChange([newMin, range[1]]);
        }
    };

    const handleMaxChange = (e) => {
        const newMax = +e.target.value;
        if (newMax >= range[0]) {
            onChange([range[0], newMax]);
        }
    };

    const handleReset = () => {
        console.log('[TempRangeFilter] Resetting to full range:', [min, max]);
        onChange([min, max]);
    };

    return (
        <div className="temp-range-filter">
            <label>Temperature Range (°F)</label>
            <div className='temp-range-filter-inputs'>
                <input
                    type="number"
                    value={range[1]}
                    min={range[0]}
                    max={max}
                    onChange={handleMaxChange}
                    placeholder="Max"
                    style={{ color: '#b34646ff' }}
                />
                <input
                    type="number"
                    value={range[0]}
                    min={min}
                    max={range[1]}
                    onChange={handleMinChange}
                    placeholder="Min"
                    style={{ color: '#2780df' }}
                />

            </div>
            <button onClick={handleReset}>
                Reset
            </button>
        </div>
    );
}
// * Detailed view link (changes to the view containing forecast, historical, etc... basic cards/info.. d3 charts after)
// Compare link (changes to compare view... can select 2 parks... default displays current conditions with basic info, we'll add d3 chart after)