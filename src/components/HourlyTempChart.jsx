// components/charts/HourlyTempChart.jsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function HourlyTempChart({
    hours = [],
    units = "°F",
    height = 260,
    margin = { top: 18, right: 20, bottom: 32, left: 44 },
    xTickFormat = d3.timeFormat("%-I%p"),
    yTickFormat = d3.format(".0f"),
    axisFontSize = 12,
    axisColor = "#6b7280",
    gridColor = "#e9eef6",
    fontFamily = "DM Sans, system-ui",
}) {
    const svgRef = useRef(null);
    const [width, setWidth] = useState(520);
    const gid = useRef("grad-" + Math.random().toString(36).slice(2)).current;

    useEffect(() => {
        const el = svgRef.current?.parentElement;
        if (!el) return;
        const ro = new ResizeObserver(() =>
            setWidth(Math.max(340, el.getBoundingClientRect().width))
        );
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (!hours?.length || !svgRef.current) return;

        const data = hours.map((h) => ({
            t: h.time_epoch ? new Date(h.time_epoch * 1000) : new Date(h.time),
            temp: Number(h.temp_f ?? h.temp),
        }));

        const svg = d3
            .select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", "100%")
            .attr("height", "auto");
        svg.selectAll("*").remove();

        const m = margin;
        const x = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => d.t))
            .range([m.left, width - m.right]);

        const lo = d3.min(data, (d) => d.temp) ?? 0;
        const hi = d3.max(data, (d) => d.temp) ?? 100;
        const pad = Math.max(2, (hi - lo) * 0.08);

        const y = d3
            .scaleLinear()
            .domain([lo - pad, hi + pad])
            .nice()
            .range([height - m.bottom, m.top]);

        // grid
        svg
            .append("g")
            .attr("stroke", gridColor)
            .attr("stroke-width", 1)
            .selectAll("line")
            .data(y.ticks(5))
            .join("line")
            .attr("x1", m.left)
            .attr("x2", width - m.right)
            .attr("y1", (d) => y(d))
            .attr("y2", (d) => y(d));

        // axes
        const gx = svg
            .append("g")
            .attr("transform", `translate(0,${height - m.bottom})`)
            .attr("color", axisColor)
            .call(d3.axisBottom(x).ticks(width < 560 ? 6 : 12).tickFormat(xTickFormat));
        const gy = svg
            .append("g")
            .attr("transform", `translate(${m.left},0)`)
            .attr("color", axisColor)
            .call(
                d3
                    .axisLeft(y)
                    .ticks(5)
                    .tickFormat((d) => `${yTickFormat(d)}${units}`)
            );

        [gx, gy].forEach((g) => {
            g.selectAll("text")
                .attr("font-size", axisFontSize)
                .attr("font-family", fontFamily);
            g.selectAll(".domain, line").attr("opacity", 0.25);
        });

        // Gradient bands (freezing, cool, mild, warm, hot, extreme)
        const bands = [
            { t: -Infinity, color: "#60a5fa" },   // freezing & below (blue)
            { t: 32, color: "#93c5fd" },   // 32–45 (light blue)
            { t: 45, color: "#a3e635" },   // 45–60 (greenish)
            { t: 60, color: "#facc15" },   // 60–75 (yellow)
            { t: 75, color: "#fb923c" },   // 75–85 (orange)
            { t: 85, color: "#ef4444" },   // 85–100 (red)
            { t: 100, color: "#991b1b" },   // 100+ (dark red)
        ];

        const defs = svg.append("defs");
        const grad = defs
            .append("linearGradient")
            .attr("id", gid)
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", 1);

        // Normalize band stops into % of chart height
        bands.forEach((band, i) => {
            const pct = ((y(band.t) - m.top) / (height - m.top - m.bottom)) * 100;
            grad
                .append("stop")
                .attr("offset", `${pct}%`)
                .attr("stop-color", band.color)
                .attr("stop-opacity", 0.3);
        });

        // paths
        const area = d3
            .area()
            .x((d) => x(d.t))
            .y1((d) => y(d.temp))
            .y0(height - m.bottom)
            .curve(d3.curveMonotoneX);

        const line = d3
            .line()
            .x((d) => x(d.t))
            .y((d) => y(d.temp))
            .curve(d3.curveMonotoneX);

        svg.append("path").datum(data).attr("fill", `url(#${gid})`).attr("d", area);

        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#3b82f6")
            .attr("stroke-width", 1.8)
            .attr("d", line);

        svg
            .append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d) => x(d.t))
            .attr("cy", (d) => y(d.temp))
            .attr("r", 2)
            .attr("fill", "#2563eb");
    }, [hours, width, height, margin, units]);

    return (
        <div className="temp_chart_card">
            <div className="temp_chart_card_head">
                <h3 className="panel_title">Hourly Temperature</h3>
            </div>
            <div className="temp_chart">
                <svg ref={svgRef} role="img" aria-label="Hourly temperature" />
            </div>
        </div>
    );
}
