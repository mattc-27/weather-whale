import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { WeatherProvider } from './context/WeatherContext';
import Layout from './Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import ParkConditions from './components/national-parks/ParkConditions';


import './stylesheets/layout.css';
import './stylesheets/search.css';
import './stylesheets/style.css';


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
                    <Route path="parks" element={<ParkConditions />} />
                </Route>
            </Routes>
        </WeatherProvider>
    );
}
