import React, { useEffect, useState, useRef } from 'react';
import DogComfortPupup from './DogComfortPupup';
import { Info } from 'lucide-react';
import '../../stylesheets/dogcomfort.css';
import '../../stylesheets/style.css';

export default function DogWeather({ dogWeather }) {

    const [open, setOpen] = useState(false);
    const popoverRef = useRef();
    const btnRef = useRef(null);

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
        <section className="dog-weather-card" aria-label="Pawcast">
            <div className="dog-card-head">
                <h3 className="dog-weather-title">🐾 Pawcast</h3>
                <button
                    className="dog-info-btn"
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-controls="pawcast-pop"
                    onClick={() => setOpen(v => !v)}
                    aria-label="Open dog weather details"
                >
                    <Info aria-hidden="true" />
                    <span className="tooltip" role="tooltip">What affects dog comfort?</span>
                </button>
            </div>
            <dl className="dog-weather-info">
                <div className="dog-weather-row">
                    <dt className="dog-weather-label">Feels Like</dt>
                    <dd className="dog-weather-value">{dogWeather.adjustedFeelsLike}°F</dd>
                </div>
                <div className="dog-weather-row">
                    <dt className="dog-weather-label">Comfort Level</dt>
                    <dd className="dog-weather-value">{dogWeather.comfort}</dd>
                </div>
                <div className="dog-weather-row">
                    <dt className="dog-weather-label">Advice</dt>
                    <dd className="dog-weather-value">{dogWeather.advice}</dd>
                </div>
            </dl>
            {open && (
                <div ref={popoverRef} className="dog-modal-overlay"
                    role="presentation"
                    onClick={(e) => {
                        // close when clicking the dimmed backdrop, not the dialog itself
                        if (e.target.classList.contains('dog-modal-overlay')) setOpen(false);
                    }}
                >
                    <DogComfortPupup id="pawcast-pop" handleClose={() => setOpen(false)} />
                </div>
            )}
        </section>
    )
}