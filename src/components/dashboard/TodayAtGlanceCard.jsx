import React from "react";
import { WiSunrise, WiSunset } from "react-icons/wi";
import { WeatherCard } from "./WeatherCard";

export default function TodayAtGlanceCard({ today, sun }) {
    return (
        <WeatherCard className="today_glance_card">
            <div className="today_glance_content">
                <div className="today_glance_copy">
                    <p className="section_eyebrow">Today at a glance</p>
                    <p className="today_summary">
                        {today?.summaryText ?? "Today’s forecast summary will appear here."}
                    </p>
                </div>

                <div className="sun_summary_grid">
                    <div className="sun_summary_item">
                        <WiSunrise aria-hidden="true" />
                        <div>
                            <span>Sunrise</span>
                            <strong>{sun?.sunrise ?? "--"}</strong>
                        </div>
                    </div>

                    <div className="sun_summary_item">
                        <WiSunset aria-hidden="true" />
                        <div>
                            <span>Sunset</span>
                            <strong>{sun?.sunset ?? "--"}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </WeatherCard>
    );
}