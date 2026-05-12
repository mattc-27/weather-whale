import React from "react";

export function WeatherCard({ className = "", children, as: Tag = "section" }) {
    return <Tag className={`weather_card ${className}`}>{children}</Tag>;
}

export function SectionHeader({ eyebrow, title, action }) {
    return (
        <div className="section_header">
            <div>
                {eyebrow && <p className="section_eyebrow">{eyebrow}</p>}
                {title && <h2>{title}</h2>}
            </div>
            {action && <div className="section_action">{action}</div>}
        </div>
    );
}

export function MetricCard({ label, value, unit, detail, icon }) {
    return (
        <div className="metric_card">
            {icon && <div className="metric_icon">{icon}</div>}
            <div>
                <p className="metric_label">{label}</p>
                <p className="metric_value">
                    {value ?? "--"}
                    {unit && <span>{unit}</span>}
                </p>
                {detail && <p className="metric_detail">{detail}</p>}
            </div>
        </div>
    );
}