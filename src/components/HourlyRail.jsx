// components/HourlyRail.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";

export default function HourlyRail({ currentConditions, mobileBp = 900 }) {

    const hoursAll = currentConditions?.forecastday?.[0]?.hour ?? [];

    const hours = useMemo(
        () =>
            hoursAll.map((h) => ({
                key: h.time_epoch || h.time,
                date: h.time_epoch ? new Date(h.time_epoch * 1000) : new Date(h.time),
                tLabel: h.time?.split(" ")[1] ?? "",
                temp: Math.round(h.temp_f ?? h.temp),
                precip: Math.round(h.chance_of_rain || 0),
                condition: h.condition?.text ?? "",
            })),
        [hoursAll]
    );

    // responsive mode
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width:${mobileBp - 1}px)`);
        const set = () => setIsMobile(mq.matches);
        set();
        mq.addEventListener?.("change", set);
        return () => mq.removeEventListener?.("change", set);
    }, [mobileBp]);

    // paging: use an offset + window size so desktop can step by 8 while showing 16
    const pageSize = isMobile ? 4 : 8; // 2x2 vs 4x4
    const step = isMobile ? 4 : 8;      // mobile: full page; desktop: half page
    const [offset, setOffset] = useState(0);

    // clamp offset on data change or mode change
    useEffect(() => {
        const maxStart = Math.max(0, hours.length - pageSize);
        setOffset((o) => Math.min(o, maxStart));
    }, [hours.length, pageSize]);

    const slice = hours.slice(offset, offset + pageSize);

    const maxStart = Math.max(0, hours.length - pageSize);
    const canPrev = hours.length > pageSize;
    const canNext = hours.length > pageSize;

    const jump = (dir) => {
        if (!hours.length) return;
        let next = offset + dir * step;
        if (next < 0) next = maxStart;           // wrap around
        if (next > maxStart) next = 0;           // wrap around
        setOffset(next);
    };

    // keyboard support
    const containerRef = useRef(null);
    const onKey = (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); jump(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); jump(-1); }
    };

    const pageIndex = Math.floor(offset / pageSize) + 1;
    const pagesTotal = Math.max(1, Math.ceil(hours.length / pageSize));

    return (
        <section className="hourly_grid_wrap" aria-label="Hourly forecast">
            <div className="hourly_grid_header">
                <h3 className="panel_title">Hourly</h3>

                {(canPrev || canNext) && (
                    <div className="hour_nav">
                        <button
                            type="button"
                            className="hour_nav_btn"
                            onClick={() => jump(-1)}
                            aria-label="Previous hours"
                        >‹</button>
                        <div className="hour_nav_status" aria-live="polite">
                            {pageIndex}/{pagesTotal}
                        </div>
                        <button
                            type="button"
                            className="hour_nav_btn"
                            onClick={() => jump(1)}
                            aria-label="Next hours"
                        >›</button>
                    </div>
                )}
            </div>
            <div
                className="hourly_grid"
                ref={containerRef}
                role="list"
                tabIndex={0}
                onKeyDown={onKey}
                aria-label={`Showing hours ${offset + 1} to ${Math.min(offset + pageSize, hours.length)} of ${hours.length}`}
                aria-live="polite"
            >
                {slice.map((h) => {
                    const isNow = h.date.getHours() === new Date().getHours();
                    return (
                        <div className="hour_card glass_card" role="listitem" key={h.key}>
                            <button
                                className="hour_card_btn"
                                aria-current={isNow ? "true" : undefined}
                                aria-label={`${h.tLabel}, ${h.condition}, ${h.temp}°F, ${h.precip}% chance of rain`}
                            >
                                <span className="hour_time">{h.tLabel}</span>
                                <span className="hour_icon" aria-hidden="true">☁️</span>
                                <span className="hour_temp">{h.temp}°</span>
                                <span className="hour_precip">{h.precip}%</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
