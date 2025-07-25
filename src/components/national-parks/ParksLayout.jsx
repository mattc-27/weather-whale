import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

import { ParksProvider, useParks } from '../../context/ParksContext';
import AnalyticsSidebar from './park-components/AnalyticsSidebar';
import ParkDetailModal from './park-components/ParkDetailModal';
import { openParkDetails } from '../../util/handlers';
import '../../stylesheets/parkstyles.css';

export default function ParksLayoutWrapper() {
    return (
        <ParksProvider>
            <ParksLayout />
        </ParksProvider>
    );
}

function ParksLayout() {
    const mapRef = useRef();
    const [sidebarWidth, setSidebarWidth] = useState(350);
    const [isSidebarOpen, setSidebarOpen] = useState(false); // 🔄 NEW

    const { state, dispatch, fetchCurrentConditions } = useParks();
    const { showModal, activePark } = state;
    const navigate = useNavigate();
    const location = useLocation();

    const parksEmpty = useMemo(() => !Object.keys(state.parks || {}).length, [state.parks]);

    useEffect(() => {
        if (parksEmpty) fetchCurrentConditions();
    }, [parksEmpty, fetchCurrentConditions]);

    const handleCloseModal = () => {
        dispatch({ type: 'TOGGLE_MODAL' });
    };

    const handleShowMore = () => {
        openParkDetails(dispatch, parkData, navigate);
    };

    const parkData = activePark
        ? (typeof activePark === 'object' ? activePark : state.parks[activePark])
        : null;

    const startResizing = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const onMouseMove = (e) => {
            const newWidth = Math.min(Math.max(200, startWidth + (e.clientX - startX)), 500);
            setSidebarWidth(newWidth);
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    function getViewHeading(path) {
        if (path.includes('/compare')) return 'Compare Parks';
        if (path.includes('/details')) return 'Current Conditions';
        return 'Explore Map';
    }

    return (
        <div className="park-page">
            {/* Sidebar toggle for mobile */}
            {!isSidebarOpen && (
                <button
                    className="sidebar-toggle"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Toggle Sidebar"
                >
                    ☰
                </button>
            )}


            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Sidebar container */}
            <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
                <AnalyticsSidebar
                    viewPath={location.pathname}
                    sidebarWidth={sidebarWidth}
                    startResizing={startResizing}
                    closeSidebar={() => setSidebarOpen(false)} // <-- NEW
                />
            </div>


            {/* Main Content */}
            <div className="main-content">
                <div className="analytics-nav">
                    <div className="analytics-nav-heading">
                        <h2>{getViewHeading(location.pathname)}</h2>
                    </div>
                    <div className="analytics-nav-link-container">
                        <Link to="/parks" className={`analytics-nav-link ${location.pathname === '/parks' ? 'active' : ''}`}>Map</Link>
                        <Link to="details" className={`analytics-nav-link ${location.pathname.includes('/parks/details') ? 'active' : ''}`}>Conditions</Link>
                        <Link to="compare" className={`analytics-nav-link ${location.pathname.includes('/parks/compare') ? 'active' : ''}`}>Compare</Link>
                    </div>
                </div>

                <Outlet context={{ mapRef }} />
            </div>

            {/* Modal */}
            {showModal && activePark && (
                <ParkDetailModal
                    parkName={activePark.fullName || activePark.name}
                    data={activePark}
                    onClose={() => dispatch({ type: 'TOGGLE_MODAL' })}
                    onShowMore={() => openParkDetails(dispatch, parkData, navigate)}
                />
            )}
        </div>
    );
}
