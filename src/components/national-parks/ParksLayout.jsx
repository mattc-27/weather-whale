import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

import { ParksProvider, useParks } from '../../context/ParksContext';
import AnalyticsSidebar from './park-components/AnalyticsSidebar';
import ParkDetailModal from './park-components/ParkDetailModal';
import ParkToolsInline from './park-components/ParkToolsInline';
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
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches); // ⬅️ NEW

    const { state, dispatch, fetchCurrentConditions } = useParks();
    const { showModal, activePark } = state;
    const navigate = useNavigate();
    const location = useLocation();

    const parksEmpty = useMemo(() => !Object.keys(state.parks || {}).length, [state.parks]);

    useEffect(() => {
        if (parksEmpty) fetchCurrentConditions();
    }, [parksEmpty, fetchCurrentConditions]);

    // ⬅️ Keep isMobile in sync with resize
    useEffect(() => {
        const mql = window.matchMedia('(max-width: 768px)');
        const handler = (e) => setIsMobile(e.matches);
        mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
        return () => {
            mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
        };
    }, []);

    const handleCloseModal = () => dispatch({ type: 'TOGGLE_MODAL' });

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

    const parkData =
        activePark ? (typeof activePark === 'object' ? activePark : state.parks[activePark]) : null;


    return (
        <div className="park-page page--parks">
            {/* Desktop-only sidebar; hidden on mobile */}
            {!isMobile && (
                <div className="sidebar-container">
                    <AnalyticsSidebar
                        viewPath={location.pathname}
                        sidebarWidth={sidebarWidth}
                        startResizing={startResizing}
                        closeSidebar={() => setSidebarOpen(false)}
                    />
                </div>
            )}
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

                {/* NEW: page body wrapper so we can control spacing */}
                <div className="parks-body">
                    {/* Mobile-only inline tools, wrapped/sticky by the component itself */}
                    {isMobile && <ParkToolsInline viewPath={location.pathname} />}

                    {/* Route content (MapView, Details, Compare). 
            MapView will provide its own .parks-map-wrap to sit tight under filters. */}
                    <Outlet context={{ mapRef }} />
                </div>
            </div>

            {/* Modal */}
            {showModal && activePark && (
                <ParkDetailModal
                    parkName={activePark.fullName || activePark.name}
                    data={activePark}
                    onClose={handleCloseModal}
                    onShowMore={() => openParkDetails(dispatch, parkData, navigate)}
                />
            )}
        </div>
    );
}
