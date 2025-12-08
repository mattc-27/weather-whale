import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { WeatherProvider } from './context/WeatherContext';
import Layout from './Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

//import ParksLayoutWrapper from './components/national-parks/dev/tests/ParksLayoutTest';
import ParksLayoutWrapper from './components/national-parks/ParksLayout';

import MapView from './components/national-parks/views/MapView';
import ParkConditionsView from './components/national-parks/views/ParkConditionsView';
import ParkComparisonView from './components/national-parks/views/ParkComparisonView';
// import ParkHistoryView from './components/national-parks/views/ParkHistoryView';
//import ParkChartsView from './components/national-parks/views/ParkChartsView';
//import ParkForecastView from './components/national-parks/views/ParkForecastView';

import './stylesheets/layout.css';
import './stylesheets/search.css';
import './stylesheets/style.css';
import './stylesheets/main.css';

// GA Tracking
ReactGA.initialize([
    {
        trackingId: ''
    }
]);

export default function App() {

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }, [location]);

    return (
        <WeatherProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="search" element={<Dashboard />} />
                    <Route path="/parks" element={<ParksLayoutWrapper />}>
                        <Route index element={<MapView />} />
                        {/* Single Park (cards-first) */}
                        <Route path="details" element={<ParkConditionsView />} />
                        {/* Optional data-mode subroutes (still Single Park) */}
                        {/*    <Route path="details/forecast" element={<ParkForecastView />} />
                        <Route path="details/history" element={<ParkHistoryView />} />*/}
                        {/* Charts-only (full-width D3)    <Route path="details/charts" element={<ParkChartsView />} />
                        */}
                        {/* Compare */}
                        <Route path="compare" element={<ParkComparisonView />} />
                    </Route>
                </Route>
            </Routes>
        </WeatherProvider>
    );
}
