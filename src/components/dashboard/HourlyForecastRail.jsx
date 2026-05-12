import React, { useMemo, useState } from "react";
import { WeatherCard } from "./WeatherCard";

import {
    Cloud,
    CloudRain,
    CloudSnow,
    CloudSun,
    Moon,
    Sun,
    Wind,
} from "lucide-react";

function buildTrendPath(items, mode) {
    if (!items.length) return "";

    const values = items.map((hour) =>
        mode === "precip" ? Number(hour.precipChance ?? 0) : Number(hour.tempF ?? 0)
    );

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);

    const width = 1000;
    const height = 90;
    const xStep = width / Math.max(items.length - 1, 1);

    return values
        .map((value, index) => {
            const x = index * xStep;
            const normalized = (value - min) / range;
            const y = height - normalized * 58 - 16;

            return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ");
}


function getHourlyIcon(hour) {
    const text = String(hour?.conditionText ?? "").toLowerCase();
    const isDay = hour?.isDay;

    if (text.includes("snow")) return <CloudSnow />;
    if (text.includes("rain") || text.includes("drizzle")) return <CloudRain />;
    if (text.includes("wind")) return <Wind />;
    if (text.includes("cloud") && isDay) return <CloudSun />;
    if (text.includes("cloud")) return <Cloud />;
    if (isDay) return <Sun />;

    return <Moon />;
}

export default function HourlyForecastRail({ hourly = [] }) {
    const [mode, setMode] = useState("temp");

    const visibleHours = hourly.slice(0, 10);

    const trendPath = useMemo(
        () => buildTrendPath(visibleHours, mode),
        [visibleHours, mode]
    );

    return (
        <WeatherCard className="hourly_forecast_card">
            <div className="hourly_header">
                <div>
                    <p className="section_eyebrow">Hourly forecast</p>
                </div>

                <div className="hourly_toggle" aria-label="Hourly view toggle">
                    <button
                        type="button"
                        className={mode === "temp" ? "active" : ""}
                        onClick={() => setMode("temp")}
                    >
                        Temperature
                    </button>

                    <button
                        type="button"
                        className={mode === "precip" ? "active" : ""}
                        onClick={() => setMode("precip")}
                    >
                        Precipitation
                    </button>
                </div>
            </div>

            <div className="hourly_chart_area">
                <svg
                    className="hourly_trend_line"
                    viewBox="0 0 1000 90"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path d={trendPath} />
                </svg>

                <div className="hourly_rail">
                    {visibleHours.map((hour, index) => {


                        const primaryValue =
                            mode === "precip"
                                ? `${hour.precipChance ?? 0}%`
                                : `${hour.tempF ?? "--"}°`;

                        const secondaryValue =
                            mode === "precip"
                                ? `${hour.tempF ?? "--"}°`
                                : `${hour.windMph ?? "--"} mph`;

                        return (
                            <article className="hourly_item" key={hour.epoch ?? hour.time ?? index}>
                                <span className="hourly_time">
                                    {index === 0 ? "Now" : hour.hourLabel}
                                </span>

                                <div className="hourly_icon_wrap" data-day={hour.isDay ? "true" : "false"}>
                                    {getHourlyIcon(hour)}
                                </div>

                                <div className="hourly_values">
                                    <strong>{primaryValue}</strong>
                                    <small>{secondaryValue}</small>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </WeatherCard>
    );
}