import React, { useState } from "react";
import { PawPrint } from "lucide-react";
import { WeatherCard } from "./WeatherCard";
import PawcastDetailsModal from "./PawcastDetailsModal";

export default function PawcastCard({ pawcast }) {
    const [detailsOpen, setDetailsOpen] = useState(false);

    return (
        <>
            <WeatherCard className="pawcast_card">
                <div className="pawcast_header">
                    <div className="pawcast_title">
                        <PawPrint aria-hidden="true" />
                        <h2>Pawcast</h2>
                    </div>

                    <span className="pawcast_badge">{pawcast?.badge ?? "Pawcast"}</span>
                </div>

                <div className="pawcast_body">
                    <div className="pawcast_icon_block">
                        <PawPrint aria-hidden="true" />
                    </div>

                    <div className="pawcast_copy">
                        <p>{pawcast?.advice ?? "Dog walking guidance will appear here."}</p>

                        <button
                            type="button"
                            className="pawcast_cta"
                            onClick={() => setDetailsOpen(true)}
                        >
                            View Pawcast Details →
                        </button>
                    </div>

                    <div className="pawcast_metrics">
                        <div>
                            <span>Air Temp</span>
                            <strong>{pawcast?.airTempF ?? "--"}°</strong>
                        </div>

                        <div>
                            <span>Pavement</span>
                            <strong>{pawcast?.pavementTempF ?? "--"}°</strong>
                            <small>Estimate</small>
                        </div>
                    </div>
                </div>
            </WeatherCard>

            {detailsOpen && (
                <PawcastDetailsModal
                    pawcast={pawcast}
                    onClose={() => setDetailsOpen(false)}
                />
            )}
        </>
    );
}