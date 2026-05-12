import React, { useMemo } from "react";
import { WeatherCard } from "./WeatherCard";

function buildChart(points) {
    const data = points.slice(0, 24);
    if (!data.length) return null;

    const temps = data.map((p) => Number(p.tempF ?? p.temp ?? 0));
    const feels = data.map((p) => Number(p.feelsLikeF ?? p.feelsLike ?? p.tempF ?? 0));

    const min = Math.floor(Math.min(...temps, ...feels) / 5) * 5 - 5;
    const max = Math.ceil(Math.max(...temps, ...feels) / 5) * 5 + 5;
    const range = Math.max(max - min, 1);

    const width = 1000;
    const height = 300;
    const pad = { top: 34, right: 36, bottom: 44, left: 54 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;

    const toX = (i) => pad.left + (i / Math.max(data.length - 1, 1)) * innerW;
    const toY = (v) => pad.top + (1 - (v - min) / range) * innerH;

    const linePath = data
        .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(Number(p.tempF ?? p.temp ?? 0))}`)
        .join(" ");

    const feelsPath = data
        .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(Number(p.feelsLikeF ?? p.feelsLike ?? p.tempF ?? 0))}`)
        .join(" ");

    const areaPath = `${linePath} L ${toX(data.length - 1)} ${height - pad.bottom} L ${toX(0)} ${height - pad.bottom} Z`;

    const yTicks = [max, Math.round((max + min) / 2), min].filter(
        (value, index, arr) => arr.indexOf(value) === index
    );

    const xTicks = data
        .map((p, i) => ({ ...p, i }))
        .filter((_, idx) => idx % 3 === 0 || idx === data.length - 1);

    return {
        data,
        width,
        height,
        pad,
        min,
        max,
        toX,
        toY,
        linePath,
        feelsPath,
        areaPath,
        yTicks,
        xTicks,
    };
}

export default function HourlyTrendAnalysis({ chart, sun }) {
    const points = chart?.hourlyTemp ?? [];

    const model = useMemo(() => buildChart(points), [points]);

    if (!model) {
        return null;
    }

    const sunriseIndex = 6;
    const sunsetIndex = 20;

    return (
        <WeatherCard className="hourly_trend_card">
            <div className="trend_header">
                <h2>Hourly trend analysis</h2>

                <div className="trend_legend">
                    <span className="legend_temp">Temperature</span>
                    <span className="legend_feels">Feels Like</span>
                </div>
            </div>

            <div className="trend_chart_wrap">
                <svg
                    className="trend_chart"
                    viewBox={`0 0 ${model.width} ${model.height}`}
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Hourly temperature trend"
                >
                    <defs>
                        <linearGradient id="tempAreaGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(72, 147, 255, 0.38)" />
                            <stop offset="62%" stopColor="rgba(72, 147, 255, 0.12)" />
                            <stop offset="100%" stopColor="rgba(72, 147, 255, 0)" />
                        </linearGradient>
                    </defs>

                    {model.yTicks.map((tick) => (
                        <g key={tick}>
                            <line
                                x1={model.pad.left}
                                x2={model.width - model.pad.right}
                                y1={model.toY(tick)}
                                y2={model.toY(tick)}
                                className="trend_grid_line"
                            />
                            <text x="8" y={model.toY(tick) + 4} className="trend_axis_label">
                                {tick}°
                            </text>
                        </g>
                    ))}

                    <path d={model.areaPath} className="trend_area" />
                    <path d={model.feelsPath} className="trend_feels_line" />
                    <path d={model.linePath} className="trend_temp_line" />

                    {[sunriseIndex, sunsetIndex].map((index, i) => {
                        const point = model.data[index];
                        if (!point) return null;

                        const x = model.toX(index);
                        const label = i === 0 ? "Sunrise" : "Sunset";
                        const time = i === 0 ? sun?.sunrise : sun?.sunset;

                        return (
                            <g key={label}>
                                <line
                                    x1={x}
                                    x2={x}
                                    y1={model.pad.top}
                                    y2={model.height - model.pad.bottom}
                                    className="trend_sun_line"
                                />
                                <circle cx={x} cy={model.toY(point.tempF ?? point.temp)} r="5" className="trend_sun_dot" />
                                <text
                                    x={x + 10}
                                    y={model.toY(point.tempF ?? point.temp) - 20}
                                    className="trend_sun_label"
                                >
                                    {label}
                                </text>
                                <text
                                    x={x + 10}
                                    y={model.toY(point.tempF ?? point.temp) - 5}
                                    className="trend_sun_time"
                                >
                                    {time ?? ""}
                                </text>
                            </g>
                        );
                    })}

                    {model.xTicks.map((point) => (
                        <text
                            key={point.time}
                            x={model.toX(point.i)}
                            y={model.height - 10}
                            textAnchor="middle"
                            className="trend_axis_label"
                        >
                            {point.hourLabel}
                        </text>
                    ))}
                </svg>
            </div>
        </WeatherCard>
    );
}