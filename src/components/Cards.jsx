import React from "react";
import { ConditionsSection } from "./SectionLayouts";

export default function CardConditions({ icon, item, cardStyle }) {

    return (
        <div className={cardStyle} >
            <p>{item}</p>
            <span className="card_icon">{icon}</span>
        </div>
    );
}