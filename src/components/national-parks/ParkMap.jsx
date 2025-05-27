import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

const ParkMap = ({ parks }) => {
    const ref = useRef();

    const tooltipRef = useRef();
    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr('width', 960)
            .attr('height', 600);

        const tooltip = d3.select(tooltipRef.current);


        const projection = d3.geoAlbersUsa().scale(1000).translate([480, 300]);
        const path = d3.geoPath().projection(projection);


        // Load and render the US map
        d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(us => {
            const states = feature(us, us.objects.states);

            svg.append('g')
                .selectAll('path')
                .data(states.features)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', '#fafafa')
                .attr('stroke', '#999');
            //.attr('stroke', '#e0e0e0')
            // Park points
            const colorScale = d3.scaleSequential()
                .domain([30, 100])
                .interpolator(t => d3.interpolateRgbBasis([
                    "#4f83cc",  // stronger blue
                    "#f5c264",  // warm gold
                    "#e76f51"   // desert coral
                ])(t));

            svg.append('g')
                .selectAll('circle')
                .data(parks)
                .enter().append('circle')
                .attr('cx', d => projection([d.lon, d.lat])[0])
                .attr('cy', d => projection([d.lon, d.lat])[1])
                .attr('r', 5)
                .attr("fill", d => d.temp ? colorScale(d.temp) : "#ddd")

                .on('mouseover', (event, d) => {
                    tooltip
                        .style('opacity', 1)
                        .html(`<strong>${d.name}</strong><br/>${d.temp} °F`)
                        .style('left', `${event.pageX + 10}px`)
                        .style('top', `${event.pageY - 28}px`);
                })
                .on('mouseout', () => {
                    tooltip.style('opacity', 0);
                });
        });
    }, [parks]);

    return (
        <>
            <svg ref={ref}></svg>
            <div
                ref={tooltipRef}
                style={{
                    position: 'absolute',
                    textAlign: 'center',
                    padding: '6px',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                    opacity: 0,
                    fontSize: '12px'
                }}
            />
        </>
    );
};

export default ParkMap;
