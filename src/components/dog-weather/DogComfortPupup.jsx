import { useState, useEffect, useRef } from 'react';
import '../../stylesheets/dogcomfort.css';
import { X, Thermometer, Sun, Cloud, Wind, Snowflake, PawPrint, ExternalLink } from "lucide-react";

export default function DogComfortPupup({ handleClose, id }) {

    // ==== Temperature Comparison (interactive) ====
    function TempCompareBar({
        min = 45,
        max = 85,
        initialHuman = 55,
        dogOffset = 10, // dog feels ~10°F warmer than you as a simple rule of thumb
    }) {
        const wrapRef = useRef(null);
        const [human, setHuman] = useState(initialHuman);
        const dog = Math.min(max, Math.max(min, human + dogOffset));

        // Helpers
        const toPct = (v) => ((v - min) / (max - min)) * 100;
        const fromX = (clientX) => {
            const rect = wrapRef.current.getBoundingClientRect();
            const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
            const v = min + (x / rect.width) * (max - min);
            return Math.round(v);
        };

        // Drag logic
        useEffect(() => {
            const el = wrapRef.current;
            if (!el) return;
            let dragging = false;

            const onDown = (e) => {
                dragging = true;
                el.setPointerCapture?.(e.pointerId);
                setHuman(fromX(e.clientX));
            };
            const onMove = (e) => {
                if (!dragging) return;
                setHuman(fromX(e.clientX));
            };
            const onUp = (e) => {
                dragging = false;
                el.releasePointerCapture?.(e.pointerId);
            };

            el.addEventListener("pointerdown", onDown);
            el.addEventListener("pointermove", onMove);
            el.addEventListener("pointerup", onUp);
            el.addEventListener("pointercancel", onUp);
            return () => {
                el.removeEventListener("pointerdown", onDown);
                el.removeEventListener("pointermove", onMove);
                el.removeEventListener("pointerup", onUp);
                el.removeEventListener("pointercancel", onUp);
            };
        }, []);

        // Keyboard support
        const onKeyDown = (e) => {
            if (e.key === "ArrowLeft") setHuman((v) => Math.max(min, v - 1));
            if (e.key === "ArrowRight") setHuman((v) => Math.min(max, v + 1));
        };

        return (
            <>
                <h4 className="modal_section_title">Temperature Comparison</h4>
                <div
                    className="compare_bar compare_bar--interactive"
                    aria-label="Drag to set your felt temperature; dog equivalent adjusts"
                >
                    <div className="bar_bg" />

                    {/* highlight ranges for reference
                    <div className="range you" style={{ "--start": 50, "--end": 60 }}>
                        <span>You</span>
                    </div>
                    <div className="range dog" style={{ "--start": 60, "--end": 70 }}>
                        <span>Dog</span>
                    </div>
 */}
                    {/* draggable track */}
                    <div
                        ref={wrapRef}
                        className="compare_track"
                        role="slider"
                        aria-valuemin={min}
                        aria-valuemax={max}
                        aria-valuenow={human}
                        tabIndex={0}
                        onKeyDown={onKeyDown}
                    >
                        {/* human handle */}
                        <div
                            className="handle handle--you"
                            style={{ left: `calc(${toPct(human)}% + var(--handle-offset))` }}
                            aria-hidden="true"
                        >
                            <div className="handle_label">You {human}°F</div>
                        </div>

                        {/* dog handle (offset) */}
                        <div
                            className="handle handle--dog"
                            style={{ left: `calc(${toPct(dog)}% + var(--handle-offset))` }}
                            aria-hidden="true"
                        >
                            <div className="handle_label">Dog {dog}°F</div>
                        </div>
                    </div>
                    {/* ticks */}
                    <div className="ticks">
                        <span>{min}°</span>
                        <span>{Math.round(min + (max - min) * 0.25)}°</span>
                        <span>{Math.round(min + (max - min) * 0.5)}°</span>
                        <span>{Math.round(min + (max - min) * 0.75)}°</span>
                        <span>{max}°</span>
                    </div>
                </div>
                <p className="compare_note">
                    Drag the bar to your felt temperature. Dogs often experience ~{dogOffset}°F{" "}
                    warmer than you. (Rule of thumb—breed, coat, age, humidity, and sun matter.)
                </p>
            </>
        );
    }


    return (
        <div
            className="dog-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dog-modal-title"
            id={id}
        >
            <div className="dog-modal-head">
                <h3 id="dog-modal-title" className="popover-heading">
                    <PawPrint className="i i-lg" aria-hidden /> Dog Weather Details</h3>
                <button className="dog-close" onClick={handleClose} aria-label="Close">
                    <X aria-hidden="true" />
                </button>
            </div>
            {/* ==== Temperature Comparison ==== */}
            <section className="popover-section">

                <TempCompareBar />
            </section>

            {/*  <section className="popover-section">
           ==== Weather Factors ==== 
                <h4 className="modal_section_title">Weather Factors</h4>
                <ul className="factor_list">
                    <li><strong>Direct sun & humidity</strong> reduce cooling efficiency; raises heat risk.</li>
                    <li><strong>Cloud/shade</strong> lowers felt heat; grass/dirt cooler than asphalt.</li>
                    <li><strong>Wind</strong> helps in heat, amplifies chill in cold (wind chill).</li>
                    <li><strong>Snow/ice & de-icers</strong> can irritate paws—rinse and dry after walks.</li>
                    <li><strong>Vehicles</strong> heat dangerously fast; in cold they retain cold like a fridge.</li>
                </ul>
            </section>*/}
            {/* ==== Comfort level table  ==== */}
            <section className="popover-section">
                <h4 className="section-title">Comfort Levels</h4>
                <table className="comfort-table">
                    <thead>
                        <tr>
                            <th>Range</th>
                            <th>Activity Guidance</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>≤ 50°F</td>
                            <td>Chilly but OK for most dogs</td>
                            <td>Watch small/short-haired, senior, or medical-risk dogs; add coat if needed.</td>
                        </tr>
                        <tr>
                            <td>50–70°F</td>
                            <td>Ideal / Pleasant</td>
                            <td>Great for walks & training; hydrate as usual.</td>
                        </tr>
                        <tr>
                            <td>70–80°F</td>
                            <td>Warm but manageable</td>
                            <td>Use shade/water, slow pace, rest often.</td>
                        </tr>
                        <tr>
                            <td>80–90°F</td>
                            <td>High heat risk</td>
                            <td>Short, low-intensity outings only (dawn/dusk). Avoid hot pavement.</td>
                        </tr>
                        <tr>
                            <td>≥ 90°F</td>
                            <td>Too hot / Emergency risk</td>
                            <td>Avoid exertion; monitor for heat stress; never leave in vehicles.</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section className="popover-section">
                <h4 className="section_title">Resources</h4>
                <ul className="resource_links">
                    <li>
                        <a
                            href="https://www.thrivepetcare.com/thrive-guide/how-cold-is-too-cold-for-dogs"
                            target="_blank" rel="noreferrer noopener"
                        >
                            How Cold Is Too Cold for Dogs? (Thrive Pet Healthcare)
                            <ExternalLink aria-hidden className="i" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.aspca.org/pet-care/general-pet-care/hot-weather-safety-tips"
                            target="_blank" rel="noreferrer noopener"
                        >
                            Hot Weather Safety Tips (ASPCA)
                            <ExternalLink aria-hidden className="i" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.aspca.org/pet-care/general-pet-care/cold-weather-safety-tips"
                            target="_blank" rel="noreferrer noopener"
                        >
                            Cold Weather Safety Tips (ASPCA)
                            <ExternalLink aria-hidden className="i" />
                        </a>
                    </li>
                </ul>

                <p className="resource_disclaimer">
                    These links are general guidelines; always consider your dog’s breed, age, health, and local conditions.
                </p>
            </section>
        </div>
    );
}
