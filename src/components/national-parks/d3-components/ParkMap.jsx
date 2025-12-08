// /components/.../ParkMap.jsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from 'topojson-client';
import debounce from 'lodash/debounce';
import { useParks } from '../../../context/ParksContext';

const VIEW_W = 1000; // was 975—use a round base viewBox; keeps math simple
const VIEW_H = 620;  // was 610

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const PADDING  = 30; // gutter so content never hugs the edges

const ParkMap = forwardRef(({ onShowHistory, onParkClick }, ref) => {
  const svgRef = useRef(null);
  const gRef   = useRef(null);
  const projectionRef = useRef(null);
  const zoomRef = useRef(null);
  const svgSelRef = useRef(null);

  const { state } = useParks();
  const parksData = state.filteredParks || [];

  // expose API
  useImperativeHandle(ref, () => ({
    zoomToPark: (parkCode) => {
      const park = parksData.find(p => p.parkCode === parkCode);
      if (!park || !park.longitude || !park.latitude) return;
      const coords = projectionRef.current?.([+park.longitude, +park.latitude]);
      if (!coords || !svgSelRef.current || !zoomRef.current) return;
      const [x, y] = coords;
      svgSelRef.current
        .transition().duration(750)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity
            .translate(VIEW_W / 2, VIEW_H / 2)
            .scale(4)
            .translate(-x, -y)
        );
    },
    resetZoom: debounce(() => {
      if (svgSelRef.current && zoomRef.current) {
        svgSelRef.current.transition().duration(300)
          .call(zoomRef.current.transform, d3.zoomIdentity);
      }
    }, 250)
  }));

  const init = useCallback(async () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    // fresh svg
    const svg = d3.select(svgEl)
      .attr('viewBox', [0, 0, VIEW_W, VIEW_H])
      .attr('width', VIEW_W)
      .attr('height', VIEW_H)
      .attr('style', 'width: 100%; height: 100%; display: block; touch-action: none;'); // prevent scroll clash on mobile
    svg.selectAll('*').remove();
    svgSelRef.current = svg;

    const g = svg.append('g');
    gRef.current = g;

    // projection/path
    const projection = d3.geoAlbersUsa()
      .scale(VIEW_W * 1.2)
      .translate([VIEW_W / 2, VIEW_H / 2]);
    projectionRef.current = projection;
    const path = d3.geoPath().projection(projection);

    // build map
    const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
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
        svg.transition().duration(600).call(
          zoomRef.current.transform,
          d3.zoomIdentity
            .translate(VIEW_W / 2, VIEW_H / 2)
            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / VIEW_W, (y1 - y0) / VIEW_H)))
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

    // parks
    const colorScale = d3.scaleSequential()
      .domain([30, 100])
      .interpolator(t =>
        d3.interpolateRgbBasis([
          "#0077b6", "#00b4d8", "#90be6d", "#f9c74f", "#f8961e", "#f3722c", "#d00000"
        ])(t)
      );

    const tooltip = d3.select(svgEl.parentNode)
      .append('div')
      .attr('class', 'park-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('pointer-events', 'none')
      .style('z-index', 10);

    g.selectAll('circle')
      .data(parksData.filter(d => {
        const lon = +d.longitude, lat = +d.latitude;
        return Number.isFinite(lon) && Number.isFinite(lat) && projection([lon, lat]);
      }))
      .enter()
      .append('circle')
      .attr('cx', d => projection([+d.longitude, +d.latitude])[0])
      .attr('cy', d => projection([+d.longitude, +d.latitude])[1])
      .attr('r', 5)
      .attr('fill', d => colorScale(d.current?.temp_f ?? 50))
      .attr('stroke', '#222')
      .attr('stroke-width', 0.4)
      .attr('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        tooltip.style('visibility', 'visible')
          .style('top', `${event.pageY - 40}px`)
          .style('left', `${event.pageX + 10}px`)
          .html(`
            <div><strong>${d.fullName || d.name}</strong></div>
            <div>${d.current?.temp_f ?? 'N/A'} °F</div>
            <div style="margin-top:4px;"><em>Click for more</em></div>
          `);
      })
      .on('mousemove', function (event) {
        tooltip.style('top', `${event.pageY - 40}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', function () { tooltip.style('visibility', 'hidden'); })
      .on('click', function (event, d) {
        event.stopPropagation();
        tooltip.style('visibility', 'hidden');
        onParkClick?.(d);

        const [x, y] = projection([+d.longitude, +d.latitude]);
        svg.transition().duration(600).call(
          zoomRef.current.transform,
          d3.zoomIdentity
            .translate(VIEW_W / 2, VIEW_H / 2)
            .scale(4)
            .translate(-x, -y)
        );
      });

    // ----- BOUNDED ZOOM / PAN (can't lose the map) ------------------------
    const extent = [[0, 0], [VIEW_W, VIEW_H]];

    // Use the drawn group bbox as the content bounds, padded
    const bbox = g.node().getBBox();
    const translateExtent = [
      [bbox.x - PADDING, bbox.y - PADDING],
      [bbox.x + bbox.width + PADDING, bbox.y + bbox.height + PADDING]
    ];

    // extra-hard clamp to ensure at least one screen of content remains visible
    const clampTransform = (t) => {
      const k = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, t.k));
      const maxX = VIEW_W * (k - 1);
      const minX = VIEW_W - VIEW_W * k;
      const maxY = VIEW_H * (k - 1);
      const minY = VIEW_H - VIEW_H * k;

      const x = Math.max(minX + PADDING, Math.min(maxX - PADDING, t.x));
      const y = Math.max(minY + PADDING, Math.min(maxY - PADDING, t.y));
      return d3.zoomIdentity.translate(x, y).scale(k);
    };

    const zoom = d3.zoom()
      .extent(extent)
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .translateExtent(translateExtent)
      .constrain((t) => clampTransform(t))
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        // keep stroke widths consistent
        g.selectAll('path').attr('stroke-width', 1 / event.transform.k);
      });

    zoomRef.current = zoom;
    svg.call(zoom).on('dblclick.zoom', null); // no jump-zoom on dblclick
    svg.call(zoom.transform, d3.zoomIdentity); // start centered

    // re-apply bounds when the container resizes
    const ro = new ResizeObserver(() => {
      // just reapply identity; viewBox keeps aspect
      svg.call(zoom.transform, d3.zoomIdentity);
    });
    ro.observe(svgEl);

    // click empty space resets
    svg.on('click', () => {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });

    return () => {
      ro.disconnect();
      tooltip.remove();
      svg.on('.zoom', null);
    };
  }, [parksData]);

  useEffect(() => {
    const cleanup = init();
    return () => { typeof cleanup === 'function' && cleanup(); };
  }, [init]);

  return <svg ref={svgRef} className="map-svg" />;
});

export default ParkMap;
