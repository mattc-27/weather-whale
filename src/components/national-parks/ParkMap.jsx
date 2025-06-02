import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';

const ParkMap = ({ parks }) => {
    const svgRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        const svgEl = svgRef.current;
        const tooltip = d3.select(tooltipRef.current);
        d3.select(svgEl).selectAll('*').remove(); // Clear previous render

        const width = 975;
        const height = 610;
        let svg, g, zoom, path, statePaths;

        svg = d3.select(svgEl)
            .attr('viewBox', [0, 0, width, height])
            .attr('width', width)
            .attr('height', height)
            .attr('style', 'width: 100%; height: 100%; display: block;');

        g = svg.append('g');

        const projection = d3.geoAlbersUsa()
            .scale(width * 1.2)
            .translate([width / 2, height / 2]);

        path = d3.geoPath().projection(projection);

        zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
                g.selectAll('path').attr('stroke-width', 1 / event.transform.k);
            });

        svg.call(zoom).on('click', reset);

        d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(us => {
            const states = feature(us, us.objects.states).features;
            const borders = mesh(us, us.objects.states, (a, b) => a !== b);

            statePaths = g.append('g')
                .attr('fill', '#444')
                .attr('cursor', 'pointer')
                .selectAll('path')
                .data(states)
                .enter()
                .append('path')
                .attr('d', path)
                .on('click', clicked);

            statePaths.append('title').text(d => d.properties.name);

            g.append('path')
                .attr('fill', 'none')
                .attr('stroke', 'white')
                .attr('stroke-linejoin', 'round')
                .attr('d', path(borders));

            const colorScale = d3.scaleSequential()
                .domain([30, 100])
                .interpolator(t => d3.interpolateRgbBasis([
                    "#0077b6", "#00b4d8", "#90be6d",
                    "#f9c74f", "#f8961e", "#f3722c", "#d00000"
                ])(t));

            g.selectAll('circle')
                .data(parks.filter(d => projection([d.Longitude, d.Latitude])))
                .enter()
                .append('circle')
                .attr('cx', d => projection([d.Longitude, d.Latitude])[0])
                .attr('cy', d => projection([d.Longitude, d.Latitude])[1])
                .attr('r', 5)
                .attr('fill', d => d.temp ? colorScale(d.temp) : '#bbb')
                .attr('stroke', '#222')
                .attr('stroke-width', 0.4)
                .on('mouseover', (event, d) => {
                    tooltip
                        .style('opacity', 1)
                        .html(`<strong>${d.Park}</strong><br/>${d.temp} °F`)
                        .style('left', `${event.pageX + 12}px`)
                        .style('top', `${event.pageY - 30}px`);
                })
                .on('mouseout', () => {
                    tooltip.style('opacity', 0);
                });
        });

        function clicked(event, d) {
            event.stopPropagation();
            const [[x0, y0], [x1, y1]] = path.bounds(d);
            statePaths.transition().style('fill', '#444');
            d3.select(event.currentTarget).transition().style('fill', 'red');

            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                d3.pointer(event, svg.node())
            );
        }

        function reset() {
            if (!statePaths || !svg || !zoom) return;
            statePaths.transition().style('fill', '#444');
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
            );
        }
    }, [parks]);

    return (
        <>

            <svg ref={svgRef} className="map-svg"
            />

            <div ref={tooltipRef} className="park-tooltip" />
        </>
    );
};

export default ParkMap;
