import React from "react";
import '../stylesheets/main.css';

import { FaTemperatureArrowDown, FaTemperatureArrowUp } from "react-icons/fa6";
import { LiaWindSolid, LiaCloudSunSolid } from "react-icons/lia";
import { WiFog } from "react-icons/wi";
import { CiDroplet } from "react-icons/ci";

const variants = {
    high: { icon: <FaTemperatureArrowUp />, className: "card variant-high" },
    low: { icon: <FaTemperatureArrowDown />, className: "card variant-low" },
    wind: { icon: <LiaWindSolid />, className: "card" },
    cloud: { icon: <LiaCloudSunSolid />, className: "card" },
    vis: { icon: <WiFog />, className: "card" },
    humidity: { icon: <CiDroplet />, className: "card" },
    default: { icon: null, className: "card" }
};


export default function CardConditions({ icon, item, variant = "default" }) {
    const v = variants[variant] || variants.default;
    return (
        <div className={`category_card card_text ${v.className}`} role="listitem">
            <p>{item}</p>
            <span className="card_icon" aria-hidden="true">{icon ?? v.icon}</span>
        </div>
    );
}
