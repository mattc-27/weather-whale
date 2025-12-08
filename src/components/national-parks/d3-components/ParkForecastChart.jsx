// src/views/parks/d3-components/ParkForecastChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ParkForecastChart({
    data,
    layers = { temp: true, precip: true, cloud: false },
    showTooltips = true
}) {
    const svgRef = useRef();
    const tipRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 24, right: 56, bottom: 36, left: 56 };
        const width = 800 - margin.left - margin.right;
        const height = 340 - margin.top - margin.bottom;

        const g = svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const clean = (data || []).filter(d =>
            d?.datetime instanceof Date && !Number.isNaN(+d.datetime) &&
            (Number.isFinite(+d.temp) || Number.isFinite(+d.precip) || Number.isFinite(+d.cloud))
        );

        if (!clean.length) {
            g.append('text')
                .attr('x', width / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .style('fill', '#777')
                .text('No forecast data');
            return;
        }

        // ---- Scales
        const x = d3.scaleTime()
            .domain(d3.extent(clean, d => d.datetime))
            .range([0, width]);

        const temps = clean.map(d => +d.temp).filter(Number.isFinite);
        const precs = clean.map(d => +d.precip).filter(Number.isFinite);

        const yTemp = d3.scaleLinear()
            .domain([
                Math.min(temps.length ? d3.min(temps) : 0, 0) - 5,
                Math.max(temps.length ? d3.max(temps) : 100, 100) + 5
            ])
            .nice()
            .range([height, 0]);

        const yPrecip = d3.scaleLinear()
            .domain([0, Math.max(precs.length ? d3.max(precs) : 0, 0.1)])
            .nice()
            .range([height, 0]);

        // ---- Axes (hour-focused; show day labels)
        const bottomAxis = d3.axisBottom(x)
            .ticks(d3.timeHour.every(6))
            .tickFormat(d => d3.timeFormat('%b %d, %H:%M')(d));

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(bottomAxis);

        g.append('g').call(d3.axisLeft(yTemp));
        g.append('g')
            .attr('transform', `translate(${width},0)`)
            .call(d3.axisRight(yPrecip));

        // Axis labels
        g.append('text')
            .attr('class', 'chart-axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', -44)
            .attr('x', -height / 2)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'middle')
            .text('Temperature (°F)');

        g.append('text')
            .attr('class', 'chart-axis-label')
            .attr('transform', 'rotate(90)')
            .attr('y', -width - 44)
            .attr('x', height / 2)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'middle')
            .text('Precipitation (in)');

        // ---- Background "future" shading (entire range is future; still add subtle bg)
        g.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#f9fbff');

        // ---- Day separators
        const dayStarts = d3.timeDay.range(x.domain()[0], d3.timeDay.offset(x.domain()[1], 1));
        dayStarts.forEach(d => {
            g.append('line')
                .attr('x1', x(d))
                .attr('x2', x(d))
                .attr('y1', 0)
                .attr('y2', height)
                .attr('stroke', '#e6eef8')
                .attr('stroke-dasharray', '2,4');
            g.append('text')
                .attr('x', x(d) + 4)
                .attr('y', 12)
                .attr('fill', '#667')
                .style('font-size', '11px')
                .text(d3.timeFormat('%a %b %d')(d));
        });

        // ---- "Now" marker (if now is on domain)
        const now = new Date();
        if (now >= x.domain()[0] && now <= x.domain()[1]) {
            const nx = x(now);
            g.append('line')
                .attr('x1', nx)
                .attr('x2', nx)
                .attr('y1', 0)
                .attr('y2', height)
                .attr('stroke', '#ff7f0e')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '4,3');
            g.append('text')
                .attr('x', nx + 6)
                .attr('y', 18)
                .attr('fill', '#ff7f0e')
                .style('font-size', '11px')
                .text('Now');
        }

        // ---- Layers
        // Precip bars draw first (behind)
        if (layers?.precip) {
            const grouped = d3.groups(clean, d => +d.datetime);
            const dx =
                grouped.length > 1
                    ? grouped[1][0] - grouped[0][0]
                    : (x.domain()[1] - x.domain()[0]) / 50;
            const oneStep = x(new Date(x.domain()[0].getTime() + dx)) - x(x.domain()[0]);
            const barWidth = Math.max(2, Math.floor(oneStep * 0.6));

            g.selectAll('.precip-bar')
                .data(clean)
                .enter()
                .append('rect')
                .attr('class', 'precip-bar')
                .attr('x', d => x(d.datetime) - barWidth / 2)
                .attr('y', d => yPrecip(+d.precip || 0))
                .attr('width', barWidth)
                .attr('height', d => height - yPrecip(+d.precip || 0))
                .attr('fill', 'steelblue')
                .attr('opacity', 0.5);
        }

        // Temp line (solid; if you ever want confidence, you can add area band here)
        if (layers?.temp) {
            const line = d3.line()
                .defined(d => Number.isFinite(+d.temp))
                .x(d => x(d.datetime))
                .y(d => yTemp(+d.temp));

            g.append('path')
                .datum(clean)
                .attr('fill', 'none')
                .attr('stroke', '#1f77b4')
                .attr('stroke-width', 2)
                .attr('d', line);
        }

        // ---- Tooltip
        if (showTooltips) {
            const tip = d3.select(tipRef.current);
            tip.attr('class', 'chart-tooltip').style('opacity', 0);

            const overlay = g.append('rect')
                .attr('fill', 'transparent')
                .attr('pointer-events', 'all')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', width)
                .attr('height', height);

            const sorted = clean.slice().sort((a, b) => +a.datetime - +b.datetime);
            const bisect = d3.bisector(d => +d.datetime).left;

            overlay
                .on('mousemove', (event) => {
                    const [mx, my] = d3.pointer(event);
                    const t = x.invert(mx);
                    const i = Math.max(0, Math.min(sorted.length - 1, bisect(sorted, +t)));
                    const p = sorted[i];

                    tip
                        .style('opacity', 1)
                        .style('left', `${event.pageX + 12}px`)
                        .style('top', `${event.pageY - 28}px`)
                        .html(
                            `<div><strong>${d3.timeFormat('%b %d, %H:%M')(p.datetime)}</strong></div>
               <div>Temp: ${Number.isFinite(+p.temp) ? `${+p.temp}°F` : '—'}</div>
               <div>Precip: ${Number.isFinite(+p.precip) ? `${+p.precip}"` : '—'}</div>`
                        );
                })
                .on('mouseleave', () => tip.style('opacity', 0));
        }
    }, [data, layers, showTooltips]);

    return (
        <div style={{ position: 'relative' }}>
            <svg ref={svgRef} />
            <div ref={tipRef} />
        </div>
    );
}
