import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ParkHistoryChart({
    data,
    layers = { temp: true, precip: true, cloud: false },
    showMonthTicks = true,
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

        const clean = (data || []).filter((d) => {
            const okDate = d?.datetime instanceof Date && !Number.isNaN(+d.datetime);
            const anyMetric =
                Number.isFinite(+d.temp) ||
                Number.isFinite(+d.precip) ||
                Number.isFinite(+d.cloud);
            return okDate && anyMetric;
        });

        if (!clean.length) {
            g.append('text')
                .attr('x', width / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .style('fill', '#777')
                .text('No historical data in this window');
            return;
        }

        // Scales
        const x = d3.scaleTime()
            .domain(d3.extent(clean, (d) => d.datetime))
            .range([0, width]);

        const temps = clean.map((d) => +d.temp).filter(Number.isFinite);
        const precs = clean.map((d) => +d.precip).filter(Number.isFinite);

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

        // Axes
        const bottomAxis = d3.axisBottom(x)
            .ticks(showMonthTicks ? d3.timeDay.every(2) : 6)
            .tickFormat((d) => d3.timeFormat('%b %d')(d));

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(bottomAxis);

        g.append('g').call(d3.axisLeft(yTemp));
        g.append('g')
            .attr('transform', `translate(${width},0)`)
            .call(d3.axisRight(yPrecip));

        // Axis labels
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -height / 2)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'middle')
            .style('fill', '#444')
            .text('Temperature (°F)');

        g.append('text')
            .attr('transform', 'rotate(90)')
            .attr('y', -width - 40)
            .attr('x', height / 2)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'middle')
            .style('fill', '#444')
            .text('Precipitation (in)');

        // Layers
        const parks = d3.groups(clean, (d) => d.park);
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        if (layers.precip) {
            // Bar width roughly by spacing
            const groupedByTime = d3.groups(clean, (d) => +d.datetime);
            const dx = groupedByTime.length > 1
                ? groupedByTime[1][0] - groupedByTime[0][0]
                : (x.domain()[1] - x.domain()[0]) / 50;
            const barWidth = Math.max(2, Math.floor((x(new Date(x.domain()[0].getTime() + dx)) - x(x.domain()[0])) * 0.6));

            parks.forEach(([key, records]) => {
                g.selectAll(`.bar-${key.replace(/\s+/g, '-')}`)
                    .data(records)
                    .enter()
                    .append('rect')
                    .attr('x', (d) => x(d.datetime) - barWidth / 2)
                    .attr('y', (d) => yPrecip(+d.precip || 0))
                    .attr('width', barWidth)
                    .attr('height', (d) => height - yPrecip(+d.precip || 0))
                    .attr('fill', 'steelblue')
                    .attr('opacity', 0.55);
            });
        }

        if (layers.temp) {
            const line = d3.line()
                .defined((d) => Number.isFinite(+d.temp))
                .x((d) => x(d.datetime))
                .y((d) => yTemp(+d.temp));

            parks.forEach(([key, records]) => {
                g.append('path')
                    .datum(records)
                    .attr('fill', 'none')
                    .attr('stroke', color(key))
                    .attr('stroke-width', 2)
                    .attr('d', line);
            });
        }

        // Legend (parks)
        parks.forEach(([key], i) => {
            const y = i * 16;
            g.append('rect').attr('x', 0).attr('y', -18 - y).attr('width', 12).attr('height', 12).attr('fill', color(key));
            g.append('text').attr('x', 18).attr('y', -8 - y).style('fontSize', 12).text(key);
        });

        // Tooltip
        if (showTooltips) {
            const tip = d3.select(tipRef.current);
            tip.style('position', 'absolute').style('pointer-events', 'none').style('background', 'rgba(0,0,0,0.8)').style('color', '#fff').style('padding', '6px 8px').style('borderRadius', '6px').style('fontSize', '12px').style('opacity', 0);

            const overlay = g.append('rect')
                .attr('class', 'overlay')
                .attr('fill', 'transparent')
                .attr('pointer-events', 'all')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', width)
                .attr('height', height);

            const all = clean.slice().sort((a, b) => +a.datetime - +b.datetime);
            const bisect = d3.bisector((d) => +d.datetime).left;

            overlay
                .on('mousemove', (event) => {
                    const [mx] = d3.pointer(event);
                    const h = x.invert(mx);
                    const i = bisect(all, +h);
                    const idx = Math.max(0, Math.min(all.length - 1, i));
                    const p = all[idx];

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
    }, [data, layers, showMonthTicks, showTooltips]);

    return (
        <div style={{ position: 'relative' }}>
            <svg ref={svgRef} />
            <div ref={tipRef} className='chart-tooltip' />
        </div>
    );
}
