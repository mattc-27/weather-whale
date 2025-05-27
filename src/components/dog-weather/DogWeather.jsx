import React, { useEffect, useState, useRef } from 'react';
import DogComfortPupup from './DogComfortPupup';
import '../../stylesheets/dogcomfort.css';

export default function DogWeather({ dogWeather }) {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef();

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClose = () => {
        setOpen(false); // ✅ always closes
    }


    return (
        <div className="dog-weather-card">
            <h3 className="dog-weather-title">🐾 Pawcast</h3>
            <div className="dog-weather-info">
                <div className="dog-weather-row">
                    <span className="dog-weather-label">Feels Like:</span>

                    <span className="dog-weather-value">{dogWeather.adjustedFeelsLike}°F</span>
                </div>
                <div className="dog-weather-row">
                    <span className="dog-weather-label">Comfort Level:</span>
                    <span className="dog-weather-value">{dogWeather.comfort}</span>
                </div>
                <div className="dog-weather-row">
                    <span className="dog-weather-label">Advice:</span>
                    <span className="dog-weather-value">{dogWeather.advice}</span>
                </div>
            </div>
            <div className="dog-weather-action">
                <button
                    className="dog-weather-toggle"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-haspopup="true"
                    aria-expanded={open}
                >
                    More Info
                </button>
            </div>
            {open && (
                <div ref={popoverRef} className="dog-weather-popover-wrapper">

                    <DogComfortPupup handleClose={handleClose} />
                </div>
            )}
        </div>
    )
}