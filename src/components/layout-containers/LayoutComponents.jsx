import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { SearchInput } from '../Search';

import '../../stylesheets/layout.css';

//import logo_a from '../assets/logos/logo_a.png';
import logo_d from '../../assets/logos/logo_d.png';
import logo_b from '../../assets/logos/logo_b.png';

function Header() {
    const location = useLocation();
    const isParks = location.pathname.startsWith('/parks'); // ⬅️ any Parks view

    return (
        <header>
            <div className="header_wrapper">
                <div className="header_content">
                    <div className="header_title">
                        <img src={logo_b} alt="Weather Whale" />
                        <h2>Weather Whale</h2>
                    </div>
                    {/* NEW: group nav + search on the right */}
                    <div className="header_actions">
                        <nav className="header_nav">
                            <Link className="nav_link" to="/">Home</Link>
                            <a className="nav_link" href="/search">Search</a>
                            <Link className="nav_link" to="/about">About</Link>
                            <Link className="nav_link nav_badge" to="/parks">National Park Conditions</Link>
                        </nav>
                        {/* ⬇️ Hide the global search on any /parks route */}
                        {!isParks && (
                            <div className="header_search">
                                <SearchInput wrapperStyle="search_container" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

function Footer() {

    return (
        <footer>
            <div className='footer_content'>
                <div className="footer_logo">
                    <h2>Weather Whale</h2>
                    <img src={logo_d} />
                </div>
                <div className='icon_row'>
                    <a href="https://www.weatherapi.com/">
                        <p>
                            Data obtained from the Weather API
                        </p>
                    </a>
                    <FaGithub size={25} color={'#2d2d2d'} className='footerIcon'>
                        <a href="https://github.com/mattc-27" />
                    </FaGithub>
                </div>
            </div>
        </footer>
    );
}

export {
    Header,
    Footer
}