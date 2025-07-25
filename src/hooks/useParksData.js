import { useState, useCallback } from 'react';
import * as d3 from 'd3';

export function useParksData() {
    const [parks, setParks] = useState({});
    const [parkForecasts, setParkForecasts] = useState([]);
    const [forecastTimestamp, setForecastTimestamp] = useState([]);

    const fetchCurrentConditions = useCallback(async () => {
        const res = await fetch('/api/current-conditions-parks');
        const data = await res.json();
        const result = Object.values(data.data).reduce((acc, curr) => {
            acc[curr.parkCode] = curr;
            return acc;
        }, {});
        setParks(result);
    }, []);

    const fetchForecast = useCallback(async (parkCode) => {
        const res = await fetch(`/api/park-history?parks=${parkCode}`);
        const { data, timestamp } = await res.json();

        const parse = d3.utcParse('%Y-%m-%d %H:%M');
        const flat = data.map(d => ({
            park: d.parkCode,
            temp: +d.temp,
            cloud: +d.cloud,
            precip: +d.precip,
            datetime: parse(d.datetime),
        }));
        setParkForecasts(flat);
        setForecastTimestamp(timestamp);
    }, []);

    return {
        parks,
        parkForecasts,
        forecastTimestamp,
        fetchCurrentConditions,
        setParkForecasts,
        fetchForecast
    };
}
