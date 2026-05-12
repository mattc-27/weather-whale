import React from "react";
import {
    WiDaySunny,
    WiHumidity,
    WiRaindrop,
    WiStrongWind,
} from "react-icons/wi";

const items = [
    {
        key: "precipitation",
        colorClass: "condition_metric--blue",
        label: "Precip",
        icon: <WiRaindrop />,
        getValue: (metrics) => metrics?.precipitation?.value,
        getUnit: (metrics) => metrics?.precipitation?.unit,
        getDetail: (metrics) => metrics?.precipitation?.detail,
    },
    {
        key: "wind",
        colorClass: "condition_metric--gray",
        label: "Wind",
        icon: <WiStrongWind />,
        getValue: (metrics) => metrics?.wind?.speedMph,
        getUnit: () => " mph",
        getDetail: (metrics) => metrics?.wind?.direction,
    },
    {
        key: "humidity",
        colorClass: "condition_metric--blue",
        label: "Humidity",
        icon: <WiHumidity />,
        getValue: (metrics) => metrics?.humidity?.value,
        getUnit: () => "%",
        getDetail: (metrics) => metrics?.humidity?.detail,
    },
    {
        key: "uv",
        colorClass: "condition_metric--yellow",
        label: "UV Index",
        icon: <WiDaySunny />,
        getValue: (metrics) => metrics?.uv?.value,
        getUnit: () => "",
        getDetail: (metrics) => metrics?.uv?.detail,
    },
];

export default function CurrentConditionsGrid({ metrics }) {
    return (
        <section className="current_conditions_grid" aria-label="Current conditions">
            {items.map((item) => {
                const value = item.getValue(metrics);
                const unit = item.getUnit(metrics);
                const detail = item.getDetail(metrics);

                return (
                    <article
                        className={`condition_metric ${item.colorClass}`}
                        key={item.key}
                    >
                        <div className="condition_metric_icon">{item.icon}</div>

                        <div>
                            <p className="condition_metric_label">{item.label}</p>

                            <p className="condition_metric_value">
                                {value ?? "--"}
                                {unit && <span>{unit}</span>}
                            </p>

                            {detail && <p className="condition_metric_detail">{detail}</p>}
                        </div>
                    </article>
                );
            })}
        </section>
    );
}