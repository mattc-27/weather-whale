import React, { useEffect } from "react";
import {
    ExternalLink,
    PawPrint,
    ThermometerSun,
    X,
} from "lucide-react";

export default function PawcastDetailsModal({ pawcast, onClose }) {
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.classList.add("modal_open");

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.classList.remove("modal_open");
        };
    }, [onClose]);

    return (
        <div
            className="pawcast_modal_overlay"
            role="presentation"
            onMouseDown={onClose}
        >
            <section
                className="pawcast_modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pawcast-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="pawcast_modal_header">
                    <div>
                        <p className="section_eyebrow">Dog weather details</p>
                        <h2 id="pawcast-modal-title">
                            <PawPrint aria-hidden="true" />
                            Pawcast Guide
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="pawcast_modal_close"
                        onClick={onClose}
                        aria-label="Close Pawcast details"
                    >
                        <X aria-hidden="true" />
                    </button>
                </header>

                <div className="pawcast_modal_summary">
                    <div>
                        <span>Dog feels like</span>
                        <strong>{pawcast?.adjustedFeelsLike ?? "--"}°</strong>
                    </div>

                    <div>
                        <span>Comfort level</span>
                        <strong>{pawcast?.comfort ?? pawcast?.badge ?? "--"}</strong>
                    </div>

                    <div>
                        <span>Current guidance</span>
                        <strong>{pawcast?.advice ?? "No guidance available."}</strong>
                    </div>
                </div>

                <section className="pawcast_compare_section">
                    <h3>
                        <ThermometerSun aria-hidden="true" />
                        Temperature comparison
                    </h3>

                    <div className="pawcast_compare_bar">
                        <div className="pawcast_compare_gradient" />

                        <div className="pawcast_marker pawcast_marker--you">
                            <span>You {pawcast?.airTempF ?? "--"}°</span>
                        </div>

                        <div className="pawcast_marker pawcast_marker--dog">
                            <span>Dog {pawcast?.adjustedFeelsLike ?? "--"}°</span>
                        </div>
                    </div>

                    <p>
                        Dogs may experience conditions as warmer than humans depending on
                        breed, coat, age, humidity, sun exposure, and pavement temperature.
                    </p>
                </section>

                <section className="pawcast_comfort_section">
                    <h3>Comfort levels</h3>

                    <div className="pawcast_comfort_table">
                        <div className="pawcast_table_row pawcast_table_head">
                            <span>Range</span>
                            <span>Activity guidance</span>
                            <span>Notes</span>
                        </div>

                        <div className="pawcast_table_row">
                            <span>≤ 50°F</span>
                            <span>Chilly but usually OK</span>
                            <span>Watch short-haired, senior, or medical-risk dogs.</span>
                        </div>

                        <div className="pawcast_table_row">
                            <span>50–70°F</span>
                            <span>Ideal / Pleasant</span>
                            <span>Great for walks and training; hydrate as usual.</span>
                        </div>

                        <div className="pawcast_table_row">
                            <span>70–80°F</span>
                            <span>Warm but manageable</span>
                            <span>Use shade, water, slower pace, and rest breaks.</span>
                        </div>

                        <div className="pawcast_table_row">
                            <span>80–90°F</span>
                            <span>High heat risk</span>
                            <span>Short, low-intensity outings. Avoid hot pavement.</span>
                        </div>

                        <div className="pawcast_table_row">
                            <span>≥ 90°F</span>
                            <span>Too hot / emergency risk</span>
                            <span>Avoid exertion; monitor closely for heat stress.</span>
                        </div>
                    </div>
                </section>

                <section className="pawcast_resources">
                    <h3>Resources</h3>

                    <a
                        href="https://www.aspca.org/pet-care/general-pet-care/hot-weather-safety-tips"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Hot Weather Safety Tips — ASPCA <ExternalLink aria-hidden="true" />
                    </a>

                    <a
                        href="https://www.aspca.org/pet-care/general-pet-care/cold-weather-safety-tips"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Cold Weather Safety Tips — ASPCA <ExternalLink aria-hidden="true" />
                    </a>

                    <p>
                        These are general guidelines. Always consider your dog’s breed, age,
                        health, acclimation, and local conditions.
                    </p>
                </section>
            </section>
        </div>
    );
}