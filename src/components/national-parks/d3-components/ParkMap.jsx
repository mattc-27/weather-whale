import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import debounce from 'lodash/debounce';
import { useParks } from '../../../context/ParksContext';

const ParkMap = forwardRef(({ onShowHistory, onParkClick }, ref) => {
    const svgRef = useRef();
    const projectionRef = useRef();
    const svgInstanceRef = useRef();
    const zoomRef = useRef();

    const { state } = useParks();
    const { filteredParks } = state;

    // Use `filteredParks` as your data source
    const parksData = filteredParks || {};

    useImperativeHandle(ref, () => ({
        zoomToPark: (parkCode) => {
            const park = parksData.find(p => p.parkCode === parkCode);
            if (!park || !park.longitude || !park.latitude) return;

            const coords = projectionRef.current?.([+park.longitude, +park.latitude]);
            if (!coords || !svgInstanceRef.current || !zoomRef.current) return;

            const [x, y] = coords;
            svgInstanceRef.current
                .transition()
                .duration(750)
                .call(
                    zoomRef.current.transform,
                    d3.zoomIdentity
                        .translate(975 / 2, 610 / 2)
                        .scale(4)
                        .translate(-x, -y)
                );
        },
        resetZoom: debounce(() => {
            if (svgInstanceRef.current && zoomRef.current) {
                svgInstanceRef.current
                    .transition()
                    .duration(750)
                    .call(zoomRef.current.transform, d3.zoomIdentity);
            }
        }, 300)
    }));

    useEffect(() => {
        const svgEl = svgRef.current;
        d3.select(svgEl).selectAll('*').remove();

        const width = 975;
        const height = 610;

        const svg = d3.select(svgEl)
            .attr('viewBox', [0, 0, width, height])
            .attr('width', width)
            .attr('height', height)
            .attr('style', 'width: 100%; height: 100%; display: block;');

        svgInstanceRef.current = svg;
        const g = svg.append('g');

        const projection = d3.geoAlbersUsa()
            .scale(width * 1.2)
            .translate([width / 2, height / 2]);

        projectionRef.current = projection;
        const path = d3.geoPath().projection(projection);

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
                g.selectAll('path').attr('stroke-width', 1 / event.transform.k);
            });

        zoomRef.current = zoom;
        svg.call(zoom).on('click', () => {
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
            );
        });

        d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(us => {
            const states = feature(us, us.objects.states).features;
            const borders = mesh(us, us.objects.states, (a, b) => a !== b);

            const statePaths = g.append('g')
                .attr('fill', '#444')
                .attr('cursor', 'pointer')
                .selectAll('path')
                .data(states)
                .enter()
                .append('path')
                .attr('d', path)
                .on('click', (event, d) => {
                    event.stopPropagation();
                    const [[x0, y0], [x1, y1]] = path.bounds(d);
                    svg.transition().duration(750).call(
                        zoom.transform,
                        d3.zoomIdentity
                            .translate(width / 2, height / 2)
                            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                        d3.pointer(event, svg.node())
                    );
                });

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

            const tooltip = d3.select(svgEl.parentNode)
                .append("div")
                .attr("class", "park-tooltip")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("pointer-events", "none")
                .style("z-index", 10);

            g.selectAll('circle')
                .data(parksData.filter(d => {
                    const lon = parseFloat(d.longitude);
                    const lat = parseFloat(d.latitude);
                    return (
                        typeof lon === 'number' &&
                        typeof lat === 'number' &&
                        projection([lon, lat]) // make sure projection returns valid coords
                    );
                }))
                .enter()
                .append('circle')
                .attr('cx', d => {
                    const coords = projection([+d.longitude, +d.latitude]);
                    return coords ? coords[0] : -9999; // fallback off-canvas
                })
                .attr('cy', d => {
                    const coords = projection([+d.longitude, +d.latitude]);
                    return coords ? coords[1] : -9999;
                })

                .attr('r', 5)
                .attr('fill', d => colorScale(d.current?.temp_f || 50))
                .attr('stroke', '#222')
                .attr('stroke-width', 0.4)
                .attr('cursor', 'pointer')
                .on('mouseover', function (event, d) {
                    tooltip
                        .style("visibility", "visible")
                        .style("top", `${event.pageY - 40}px`)
                        .style("left", `${event.pageX + 10}px`)
                        .html(`
                            <div><strong>${d.fullName || d.name}</strong></div>
                            <div>${d.current?.temp_f ?? 'N/A'} °F</div>
                            <div style="margin-top:4px;"><em>Click for more</em></div>
                        `);
                })
                .on('mousemove', function (event) {
                    tooltip
                        .style("top", `${event.pageY - 40}px`)
                        .style("left", `${event.pageX + 10}px`);
                })
                .on('mouseout', function () {
                    tooltip.style("visibility", "hidden");
                })
                .on('click', function (event, d) {
                    event.stopPropagation();
                    tooltip.style("visibility", "hidden");

                    if (onParkClick) onParkClick(d);
                    console.log(d)
                    const coords = projection([+d.longitude, +d.latitude]);
                    if (!coords) return;

                    const [x, y] = coords;
                    svg.transition().duration(750).call(
                        zoom.transform,
                        d3.zoomIdentity
                            .translate(width / 2, height / 2)
                            .scale(4)
                            .translate(-x, -y)
                    );
                });
        });
    }, [parksData]);

    return <svg ref={svgRef} className="map-svg" />;
});

export default ParkMap;
