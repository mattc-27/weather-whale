import React from "react";
import {
    Cloud,
    CloudRain,
    CloudSnow,
    CloudSun,
    Sun,
    Droplets,
} from "lucide-react";
import { WeatherCard } from "./WeatherCard";

function getDailyIcon(day) {
    const text = String(day?.conditionText ?? "").toLowerCase();

    if (text.includes("snow")) {
        return (
            <span className="daily_weather_icon daily_weather_icon--snow">
                <CloudSnow />
            </span>
        );
    }

    if (text.includes("rain") || text.includes("drizzle")) {
        return (
            <span className="daily_weather_icon daily_weather_icon--rain">
                <Cloud className="daily_cloud" />
                <Droplets className="daily_drops" />
            </span>
        );
    }

    if (text.includes("cloud") || text.includes("overcast")) {
        return (
            <span className="daily_weather_icon daily_weather_icon--cloud">
                <CloudSun />
            </span>
        );
    }

    if (text.includes("sun") || text.includes("clear")) {
        return (
            <span className="daily_weather_icon daily_weather_icon--sun">
                <Sun />
            </span>
        );
    }

    return (
        <span className="daily_weather_icon daily_weather_icon--cloud">
            <Cloud />
        </span>
    );
}

export default function DailyForecastStrip({ daily = [] }) {
    return (
        <WeatherCard className="daily_forecast_card">
            <div className="daily_forecast_header">
                <p className="section_eyebrow">Looking ahead</p>
                <h2>Daily forecast</h2>
            </div>

            <div className="daily_forecast_strip">
                {daily.map((day) => (
                    <article className="daily_forecast_item" key={day.date}>
                        <p className="daily_day">{day.dayLabel}</p>

                        <div className="daily_icon_wrap">{getDailyIcon(day)}</div>

                        <div className="daily_temps">
                            <strong>{day.highF ?? "--"}°</strong>
                            <span>{day.lowF ?? "--"}°</span>
                        </div>

                        {Number(day.precipChance ?? 0) > 0 && (
                            <small>{day.precipChance}%</small>
                        )}
                    </article>
                ))}
            </div>
        </WeatherCard>
    );
}