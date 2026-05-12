import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { WeatherContext } from "../context/WeatherContext";
import { fetchWeather } from "../services/weather";
import { toasterStyle } from "../components/Toasters";
// import toast, { Toaster } from 'react-hot-toast';
import { useMobile, useBreakpoint } from "../hooks/useMobile";

import HeroWeatherPanel from "../components/dashboard/HeroWeatherPanel";
import CurrentConditionsGrid from "../components/dashboard/CurrentConditionsGrid";
import TodayAtGlanceCard from "../components/dashboard/TodayAtGlanceCard";
import TodayTimeline from "../components/dashboard/TodayTimeline";
import HourlyForecastRail from "../components/dashboard/HourlyForecastRail";
import PawcastCard from "../components/dashboard/PawcastCard";
import HourlyTrendAnalysis from "../components/dashboard/HourlyTrendAnalysis";
import ExtendedMetricsGrid from "../components/dashboard/ExtendedMetricsGrid";
import DailyForecastStrip from "../components/dashboard/DailyForecastStrip";

export default function DashboardShell() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const isMobile = useMobile();
    const breakpoint = useBreakpoint();

    const lastLoadedQueryRef = useRef(null);

    const {
        weather,
        setWeather,
        getBackground,
        background,
        addRecentSearch,
    } = useContext(WeatherContext);

    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const queryFromUrl = searchParams.get("q");

    const loadWeather = useCallback(
        async ({ query, label, force = false }) => {
            if (!query) return;

            const normalizedQuery = String(query).trim();

            if (!force && lastLoadedQueryRef.current === normalizedQuery) return;

            lastLoadedQueryRef.current = normalizedQuery;
            setLoading(true);
            setError("");

            try {
                const response = await toast.promise(
                    fetchWeather(normalizedQuery),
                    {
                        loading: "Loading forecast 🐳",
                        success: "Forecast updated",
                        error: "Error fetching forecast",
                    },
                    {
                        style: toasterStyle,
                        id: "weather-fetch",
                    }
                );

                setWeather(response);
                getBackground(response);

                addRecentSearch?.({
                    label: label ?? response?.location?.name ?? normalizedQuery,
                    query: normalizedQuery,
                });
            } catch (err) {
                console.error(err);
                setError("Unable to load weather for that location.");
                lastLoadedQueryRef.current = null;
            } finally {
                setLoading(false);
            }
        },
        [addRecentSearch, getBackground, setWeather]
    );

    const requestUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Location services are not available in this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const query = `${position.coords.latitude},${position.coords.longitude}`;

                navigate(`/search?q=${encodeURIComponent(query)}`, {
                    replace: true,
                });
            },
            () => {
                setError("Search for a location to view your forecast.");
            },
            {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 1000 * 60 * 10,
            }
        );
    }, [navigate]);

    useEffect(() => {
        if (queryFromUrl) {
            loadWeather({ query: queryFromUrl });
            return;
        }

        if (!lastLoadedQueryRef.current && !weather) {
            requestUserLocation();
        }
    }, [queryFromUrl, loadWeather, requestUserLocation]);

    function handleSearchSubmit(searchPayload) {
        if (!searchPayload?.query) return;

        navigate(`/search?q=${encodeURIComponent(searchPayload.query)}`);
    }

    const shellStyle = useMemo(() => {
        if (!background) return undefined;

        return {
            "--dashboard-bg-image": background,
        };
    }, [background]);

    return (
        <section
            className={`dashboard_shell dashboard_shell--${breakpoint}`}
            style={shellStyle}
            data-mobile={isMobile ? "true" : "false"}
        >
            <div className="dashboard_backdrop" />

            <div className="dashboard_inner">
                {error && (
                    <div className="dashboard_error" role="alert">
                        {error}
                    </div>
                )}

                {!weather && !loading ? (
                    <section className="weather_card empty_dashboard_state">
                        <h2>No forecast loaded yet</h2>
                        <p>Search for a location or use your current location.</p>
                        <button type="button" onClick={requestUserLocation}>
                            Use current location
                        </button>
                    </section>
                ) : (
                    <>
                        <div className="dashboard_top_stage">
                            <HeroWeatherPanel
                                weather={weather}
                                loading={loading}
                                searchValue={searchValue}
                                onSearchChange={setSearchValue}
                                onSearchSubmit={handleSearchSubmit}
                            />

                            {weather && <CurrentConditionsGrid metrics={weather.metrics} />}
                        </div>

                        {weather && (
                            <div className="dashboard_stack">
                                <TodayAtGlanceCard today={weather.today} sun={weather.sun} />
                                <TodayTimeline timeline={weather.timeline} />
                                <HourlyForecastRail hourly={weather?.hourly} />
                                <PawcastCard pawcast={weather?.pawcast} />
                                <HourlyTrendAnalysis chart={weather?.chart} sun={weather?.sun} />
                                <ExtendedMetricsGrid metrics={weather?.metrics} />
                                <DailyForecastStrip daily={weather?.daily} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section >
    );
}

function EmptyDashboardState({ onUseLocation }) {
    return (
        <section className="weather_card empty_dashboard_state">
            <h2>No forecast loaded yet</h2>
            <p>Search for a location or use your current location to load weather.</p>

            <button type="button" onClick={onUseLocation}>
                Use current location
            </button>
        </section>
    );
}