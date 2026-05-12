import React from "react";
import { Eye, Gauge, Sun, Waves, Wind } from "lucide-react";
import { WeatherCard } from "./WeatherCard";

const metricItems = [
    {
        key: "wind",
        className: "metric-neutral",
        icon: <Wind />,
        label: "Wind",
        value: (m) => m?.wind?.speedMph,
        unit: " mph",
        detail: (m) =>
            m?.wind?.gustMph != null
                ? `Gusts to ${m.wind.gustMph} mph`
                : m?.wind?.direction,
    },
    {
        key: "humidity",
        className: "metric-blue",
        icon: <Waves />,
        label: "Humidity",
        value: (m) => m?.humidity?.value,
        unit: "%",
        detail: (m) => m?.humidity?.detail,
    },
    {
        key: "visibility",
        className: "metric-neutral",
        icon: <Eye />,
        label: "Visibility",
        value: (m) => m?.visibility?.value,
        unit: " mi",
        detail: (m) => m?.visibility?.detail,
    },
    {
        key: "pressure",
        className: "metric-neutral",
        icon: <Gauge />,
        label: "Pressure",
        value: (m) => m?.pressure?.value,
        unit: " inHg",
        detail: (m) => m?.pressure?.detail,
    },
    {
        key: "uv",
        className: "metric-gold",
        icon: <Sun />,
        label: "UV Index",
        value: (m) => m?.uv?.value,
        unit: "",
        detail: (m) => m?.uv?.detail,
    },
];

export default function ExtendedMetricsGrid({ metrics }) {
    return (
        <WeatherCard className="extended_metrics_card">
            <div className="extended_metrics_grid">
                {metricItems.map((item) => {
                    const value = item.value(metrics);
                    const detail = item.detail(metrics);

                    return (
                        <article
                            className={`extended_metric_item ${item.className}`}
                            key={item.key}
                        >
                            <div className="extended_metric_icon">{item.icon}</div>

                            <div>
                                <p className="extended_metric_label">{item.label}</p>

                                <p className="extended_metric_value">
                                    {value ?? "--"}
                                    {item.unit && <span>{item.unit}</span>}
                                </p>

                                {detail && <p className="extended_metric_detail">{detail}</p>}
                            </div>
                        </article>
                    );
                })}
            </div>
        </WeatherCard>
    );
}