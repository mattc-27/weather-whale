import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ParkHistoryChart({ data, layers }) {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 80, bottom: 30, left: 40 };
        const width = 500 - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        const g = svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const parks = d3.groups(data, d => d.park);

        const allDates = data.map(d => d.datetime).filter(Boolean);
        const allTemps = data.map(d => +d.temp).filter(Boolean);
        const allPrecip = data.map(d => +d.precip).filter(Boolean);
        const allClouds = data.map(d => +d.cloud).filter(Boolean);

        const x = d3.scaleTime()
            .domain(d3.extent(allDates))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([
                d3.min([d3.min(allTemps), d3.min(allPrecip), 0]) - 5,
                d3.max([d3.max(allTemps), d3.max(allPrecip), 100]) + 5
            ])
            .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5));

        g.append('g').call(d3.axisLeft(y));

        if (layers.cloud) {
            const cloudArea = d3.area()
                .x(d => x(d.datetime))
                .y0(height)
                .y1(d => y(d.cloud));

            parks.forEach(([_, records]) => {
                g.append('path')
                    .datum(records)
                    .attr('fill', '#ccc')
                    .attr('opacity', 0.4)
                    .attr('d', cloudArea);
            });
        }

        if (layers.precip) {
            parks.forEach(([_, records]) => {
                g.selectAll(`.bar-${_.replace(/\s+/g, '-')}`)
                    .data(records)
                    .enter()
                    .append('rect')
                    .attr('x', d => x(d.datetime) - 1)
                    .attr('y', d => y(d.precip))
                    .attr('width', 2)
                    .attr('height', d => height - y(d.precip))
                    .attr('fill', 'steelblue')
                    .attr('opacity', 0.6);
            });
        }

        if (layers.temp) {
            const line = d3.line()
                .x(d => x(d.datetime))
                .y(d => y(d.temp));

            parks.forEach(([park, records], i) => {
                g.append('path')
                    .datum(records)
                    .attr('fill', 'none')
                    .attr('stroke', color(park))
                    .attr('stroke-width', 2)
                    .attr('d', line);

                g.append('text')
                    .attr('x', width + 5)
                    .attr('y', i * 20 + 10)
                    .attr('fill', color(park))
                    .style('font-size', '0.75rem')
                    .text(park);
            });
        }
    }, [data, layers]);

    return <svg ref={svgRef} />;
}
