import React from 'react';
import { MapPin, Search, Sun, Thermometer, Wind } from "lucide-react";

const DEFAULT_AMBIENT_LOCATION = {
    label: "Monterey, California",
    query: "Monterey, CA",
};

export function AtmosphericHero({ preview, onSearch }) {
    const locationLabel = preview?.location?.name
        ? `${preview.location.name}${preview.location.region ? `, ${preview.location.region}` : ""
        }`
        : DEFAULT_AMBIENT_LOCATION.label;


    return (
        <section className="ww_hero">
            <div className="ww_hero_backdrop" />

            <div className="ww_hero_inner">
                <div className="ww_hero_content">
                    <span className="ww_eyebrow">Beyond the high and the low.</span>

                    <h1 className="ww_hero_title">
                        Weather,
                        <br />
                        interpreted
                        <br />
                        for real life.
                    </h1>

                    <p className="ww_hero_copy">
                        Weather Whale helps you understand
                        what the forecast actually means for your day —
                        from changing air and incoming rain
                        to the best hours to be outside.
                    </p>

                    <div className="ww_hero_actions">
                        <button className="ww_primary_btn" onClick={onSearch}>
                            <Search aria-hidden="true" />
                            <span>Explore Conditions</span>
                        </button>
                    </div>

                    <div className="ww_hero_meta" aria-label="Current ambient preview">
                        <span className="ww_meta_item ww_meta_location">
                            <MapPin aria-hidden="true" />
                            <span>{locationLabel}</span>
                        </span>

                        <span className="ww_meta_divider" />

                        <span className="ww_meta_item">
                            <Thermometer aria-hidden="true" />
                            <span>{preview?.current?.tempF ?? "54"}°</span>
                        </span>

                        <span className="ww_meta_divider" />

                        <span className="ww_meta_item">
                            <Wind aria-hidden="true" />
                            <span>{preview?.ambient?.windPhrase ?? "still air"}</span>
                        </span>

                        <span className="ww_meta_divider" />

                        <span className="ww_meta_item">
                            <Sun aria-hidden="true" />
                            <span>{preview?.ambient?.phrase ?? "clearing skies"}</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function EditorialSection({
    eyebrow,
    title,
    body
}) {

    return (
        <section className="ww_editorial_block">

            <div className="ww_editorial_content">

                <span className="ww_eyebrow">
                    {eyebrow}
                </span>

                <h2 className="ww_section_title">
                    {title}
                </h2>

                <p className="ww_section_copy">
                    {body}
                </p>

            </div>

        </section>
    );
}

export function FutureVisionSection() {

    return (
        <section className="ww_future_block">

            <div className="ww_future_inner">

                <span className="ww_eyebrow">
                    Designed for the day ahead
                </span>

                <h2 className="ww_section_title">
                    A weather tool that adapts to how people actually live.
                </h2>

                <p className="ww_section_copy">
                    Weather Whale is evolving toward a more intuitive understanding
                    of conditions throughout the day —
                    from the best hours to be outside
                    to the moments when the air, light, and temperature begin to shift.
                </p>

            </div>

        </section>
    );
}