import React from "react";
import { WiDaySunny, WiMoonAltWaningCrescent4, WiStrongWind } from "react-icons/wi";
import { WeatherCard } from "./WeatherCard";

function getFallbackIcon(key) {
    if (key === "warmest") return <WiDaySunny />;
    if (key === "breezy") return <WiStrongWind />;
    return <WiMoonAltWaningCrescent4 />;
}

function getEventDescription(event) {
    if (event.key === "now") return event.title ?? "Current conditions";
    if (event.key === "warmest") return "Warmest";
    if (event.key === "breezy") return event.detail || "Breezy";
    if (event.key === "evening") return event.title ?? "Evening";
    return event.title ?? "";
}

export default function TodayTimeline({ timeline = [] }) {
    return (
        <WeatherCard className="today_timeline_card">
            <p className="section_eyebrow">What’s happening today</p>

            <div className="timeline_track" aria-label="Today timeline">
                {timeline.map((event) => (
                    <article className="timeline_point" key={event.key}>
                        <div className="timeline_icon_wrap">
                            {event.icon?.forecast ? (
                                <img src={event.icon.forecast} alt="" aria-hidden="true" />
                            ) : (
                                getFallbackIcon(event.key)
                            )}
                        </div>

                        <p className="timeline_time">{event.timeLabel}</p>
                        <strong>{getEventDescription(event)}</strong>
                        <span>{event.detail}</span>
                    </article>
                ))}
            </div>
        </WeatherCard>
    );
}