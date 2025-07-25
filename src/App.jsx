import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { WeatherProvider } from './context/WeatherContext';
import Layout from './Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

import ParksLayoutWrapper from './components/national-parks/ParksLayout';

import './stylesheets/layout.css';
import './stylesheets/search.css';
import './stylesheets/style.css';

import MapView from './components/national-parks/views/MapView';
import ParkConditionsView from './components/national-parks/views/ParkConditionsView';
import ParkComparisonView from './components/national-parks/views/ParkComparisonView';
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
                        <Route path="details" element={<ParkConditionsView />} />
                        <Route path="compare" element={<ParkComparisonView />} />
                    </Route>

                </Route>
            </Routes>
        </WeatherProvider>
    );
}
