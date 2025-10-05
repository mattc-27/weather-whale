import React, { useState, useEffect, useContext, Suspense, lazy, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import * as d3 from 'd3';
import {
    SectionLayoutMain,
    IconContainer
}
    from '../components/layout-containers/SectionLayouts';

import { TitleContainerLocation } from '../components/layout-containers/Containers';

import DogWeather from '../components/dog-weather/DogWeather';
import HourlyTempChart from '../components/HourlyTempChart';
// toaster
import { toasterContainer, toasterStyle } from '../components/Toasters';
import toast, { Toaster } from 'react-hot-toast';

// Icons 

import { ArrowUpFromLine, ArrowDownFromLine, Wind, Cloudy, Cloud, Binoculars, Droplets } from 'lucide-react';

// hooks
import { useMobile, useBreakpoint } from '../hooks/useMobile';

const HourlyRail = lazy(() => import('../components/HourlyRail'))

// context 
import { fetchWeather } from '../util/weather';
import { WeatherContext } from '../context/WeatherContext';


export default function Dashboard() {

    const navigate = useNavigate();

    const mobile = useMobile(); // default 730px
    // const iconSize = mobile ? 25 : 35;  // Helper function
    const breakpoint = useBreakpoint();

    if (breakpoint === 'xsmall') {
        const iconSize = 125
        // very small screen like older iPhones
    }
    if (breakpoint === 'small') {
        const iconSize = 120
        // normal mobile
    }
    if (breakpoint === 'medium') {
        // tablets
        const iconSize = 120
    }
    if (breakpoint === 'large') {
        // desktop
        const iconSize = 120
    }

    const [searchParams, setSearchParams] = useSearchParams();

    const [userCoords, setUserCoords] = useState(null);

    const query = searchParams.get('q'); // no default yet

    const { currentConditions, setCurrentConditions, getBackground, background, setBackground } = useContext(WeatherContext);


    async function fetchData() {
        try {
            const response = await toast.promise(fetchWeather(query), {
                loading: 'loading', //`${loadingMsg.text} 🐳`,
                success: 'success', //`${loadingMsg.text} 🐳`,
                error: 'Error when fetching'
            }, {
                style: toasterStyle,
            });
            setCurrentConditions(response);
            getBackground(response)
        } catch (error) {
            console.error(error)
        }
    };
    console.log(background)

    useEffect(() => {
        if (!query) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const coords = `${lat},${lon}`;

                    // Update URL to include coordinates
                    setSearchParams({ q: coords });
                    setUserCoords(coords);
                },
                (error) => {
                    console.log('Geolocation error or denied:', error);
                    // If they deny, set q=Denver
                    setSearchParams({ q: 'Denver' });
                }
            );
        }
    }, []); // <-- only runs on first page load


    useEffect(() => {
        console.log('getting weather')
        if (query) {
            fetchData().catch(console.error);
        }
    }, [query]);
    const bgRef = useRef(null);
    const getSrc = bg => {
        const m = String(bg).match(/url\((['"]?)(.*?)\1\)/i);
        return m ? m[2] : bg;
    };


    // tiny parallax (disabled if user prefers reduced motion)
    useEffect(() => {
        const el = bgRef.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                // 2–5% of scroll distance feels subtle; clamp for safety
                const y = Math.max(-20, Math.min(20, window.scrollY * 0.04));
                el.style.transform = `translateY(${y}px) scale(1.03)`; // slight scale to hide edges
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);


    return (
        <div className='app_container'>
            {currentConditions &&
                <>
                    {/* ——— HERO / CURRENT ——— */}
                    <SectionLayoutMain
                        wrapperStyle={`app_col app_col--left leftcol`}
                        style={{
                            // tweak these numbers without touching CSS
                            '--hero-mobile-min-vh': '52vh',   // taller on mobile (try 52–60vh)
                            '--media-desktop-vh': '35vh',   // ~30–40% of viewport height
                            '--media-op-mobile': 0.22,     // faintness on mobile bg
                            '--media-op-desktop': 1,        // 0.9–1 for foreground photo
                        }}
                    >
                        <div className="current_stack" aria-live="polite"
                        >
                            <IconContainer wrapperStyle={`current_icon`}
                                icon={<currentConditions.formatIcon.IconComponent
                                    size={breakpoint === 'xsmall' ? 100 : 150}
                                    style={{ color: '#1D3557' }} />}
                            />
                            <div className="current_primary">
                                <p className="current_temp">{currentConditions.temp_f}°F</p>
                                <p className="current_condition">{currentConditions.condition.text}</p>
                                <TitleContainerLocation
                                    wrapperStyle="row items_center location_title"
                                    searchLocation={currentConditions.searchLocation}
                                />
                            </div>
                        </div>
                        {/* NEW: six “glass” metric cards under the primary block */}
                        <div className="left_metrics">
                            <div className='metrics_grid'>
                                <div className="glass_card">
                                    <div className='card_top'>
                                        <span className="metric_label">
                                            High
                                        </span>
                                        <span className="metric_value">
                                            {currentConditions.forecastday[0].day.maxtemp_f}°F
                                        </span>
                                    </div>
                                    <div className='card_bottom'>
                                        <ArrowUpFromLine size={50} style={{ color: '#eb98a1ff' }} />
                                    </div>
                                </div>
                                <div className="glass_card">
                                    <div className='card_top'>
                                        <span className="metric_label">Low</span>
                                        <span className="metric_value">
                                            {currentConditions.forecastday[0].day.mintemp_f}°F
                                        </span>
                                    </div>
                                    <div className='card_bottom'>
                                        <ArrowDownFromLine size={50} style={{ color: '#A8DADC' }} />
                                    </div>
                                </div>
                                <div className="glass_card">
                                    <div className='card_top'>
                                        <span className="metric_label">Cloud Cover</span>
                                        <span className="metric_value">{currentConditions.cloud}%</span>
                                    </div>
                                    <div className='card_bottom'>
                                        <Cloudy size={50} style={{ color: '#9FB1DC' }} />
                                    </div>
                                </div>
                                <div className="glass_card">
                                    <div className='card_top'>
                                        <span className="metric_label">Wind</span>
                                        <span className="metric_value">
                                            {currentConditions.wind_mph} mph {currentConditions.wind_dir000}
                                        </span>
                                    </div>
                                    <div className='card_bottom'>
                                        <Wind size={50} style={{ color: '#C2EEC9' }} />
                                    </div>
                                </div>
                                <div className="glass_card">
                                    <div className='card_top'>
                                        <span className="metric_label">
                                            Visibility
                                        </span>
                                        <span className="metric_value">
                                            <span className="metric_value">{currentConditions.vis_miles} mi</span>
                                        </span>
                                    </div>
                                    <div className='card_bottom'>
                                        <Binoculars size={50} style={{ color: '#C7B6FA' }} />
                                    </div>
                                </div>
                                <div className="glass_card">
                                    <div className='card_top'>
                                        <span className="metric_label">
                                            Humidity
                                        </span>
                                        <span className="metric_value">
                                            <span className="metric_value">{currentConditions.humidity}%</span>
                                        </span>
                                    </div>
                                    <div className='card_bottom'>
                                        <Droplets size={50} style={{ color: '#9FB1DC' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Photo panel (replaces the inline-style background div) */}
                        <figure className="leftcol__media" aria-label="Current location">
                            <img
                                src={getSrc(background)}
                                // alt={backgroundAlt}
                                loading="eager"
                                decoding="async"
                                className="leftcol__img"
                            />
                            <div className="leftcol__scrim" aria-hidden="true" />
                        </figure>
                        {/* */}
                        <Suspense fallback={<div>Loading data...</div>}></Suspense>
                    </SectionLayoutMain>
                    {/* ——— RIGHT: HOURLY STRIP + PAWCAST + D3 TEMP CHART ——— */}
                    <SectionLayoutMain wrapperStyle={`app_col app_col--right`} >
                        <section className="panel_card hourly_right">
                            <HourlyRail currentConditions={currentConditions} />
                        </section>
                        <section className="panel_card dog_card">
                            <DogWeather
                                dogWeather={currentConditions.dogComfort}
                            />
                        </section>
                        {/* NEW: D3 chart replaces the six cards that moved left */}
                        <section className="panel_card chart_card">
                            <HourlyTempChart
                                hours={currentConditions.forecastday[0].hour}
                                dayHigh={currentConditions.forecastday[0].day.maxtemp_f}
                                dayLow={currentConditions.forecastday[0].day.mintemp_f}
                                units="°F"
                                xLabel="Time"
                                yLabel="Temp (°F)"
                                xTickFormat={d3.timeFormat("%-I%p")}
                                gradFrom="#60a5fa"
                                gradTo="#60a5fa"
                                gradTopOpacity={0.3}
                                refLabelStyle="pill"
                                fontFamily={`Work Sans`}
                            />
                        </section>
                    </SectionLayoutMain>
                </>
            }
        </div >
    );
}