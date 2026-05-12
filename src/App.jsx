import React, { useEffect, useContext } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";


import { WeatherProvider } from "./context/WeatherContext";
import Layout from "./Layout";

import Home from "./pages/Home";
import Dashboard from "./Dashboard";
import About from "./pages/About";

import DashboardShell from "./ui/DashboardShell";

//import ParksLayoutWrapper from './components/national-parks/dev/tests/ParksLayoutTest';
/* 
import ParksLayoutWrapper from './components/national-parks/ParksLayout';

import MapView from './components/national-parks/views/MapView';
import ParkConditionsView from './components/national-parks/views/ParkConditionsView';
import ParkComparisonView from './components/national-parks/views/ParkComparisonView';
import ParkChartsView from './components/national-parks/views/ParkChartsView';
*/
// import ParkHistoryView from './components/national-parks/views/ParkHistoryView';

//import ParkForecastView from './components/national-parks/views/ParkForecastView';

/* import './stylesheets/layout.css';
import './stylesheets/search.css';
import './stylesheets/style.css';
import './stylesheets/main.css';
*/


import './stylesheets/ww/ww.tokens.css';
import './stylesheets/ww/ww.layout.css';
import './stylesheets/ww/ww.ui.css';
import './stylesheets/ww/ww.reset.css';
import './stylesheets/ww/ww.search.css';
import './stylesheets/ww/ww.dashboard.css';
import './stylesheets/ww/ww.weather-components.css';
import './stylesheets/ww/ww.theme-overrides.css';
// GA Tracking
ReactGA.initialize([
    {
        trackingId: ''
    }
]);

/* 
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}*/


export default function App() {

    /* 
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }, [location]);
    */

    return (
        <WeatherProvider>
            {/* <AnalyticsTracker /> */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    {/* Dashboard.jsx now returns <DashboardShell /> */}
                    <Route path="search" element={<Dashboard />} />
                    {/*   <Route path="/parks" element={<ParksLayoutWrapper />}>
                    </Route>*/}
                    {/* <Route index element={<MapView />} /> */}
                    {/* Single Park (cards-first) */}
                    {/*  <Route path="details" element={<ParkConditionsView />} />*/}
                    {/* Optional data-mode subroutes (still Single Park) */}
                    {/*    <Route path="details/forecast" element={<ParkForecastView />} />
                        <Route path="details/history" element={<ParkHistoryView />} />*/}
                    {/* Charts-only (full-width D3)   
                        */}
                    {/*  <Route path="details/charts" element={<ParkChartsView />} />*/}
                    {/* Compare */}
                    {/*  <Route path="compare" element={<ParkComparisonView />} />*/}

                </Route>
            </Routes>
        </WeatherProvider>
    );
}
