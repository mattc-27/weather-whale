import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";

import { WeatherContext } from "../../context/WeatherContext";

import "../../stylesheets/ww/ww.layout.css";

import logo_d from "../../assets/logos/logo_d.png";
import logo_b from "../../assets/logos/logo_b.png";

function Header() {
    const { theme, setTheme } = useContext(WeatherContext);
    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <header className="site_header">
            <div className="header_shell">
                <Link to="/" className="header_brand" aria-label="Weather Whale home">
                    <span className="header_logo">
                        <img src={logo_b} alt="" aria-hidden="true" />
                    </span>
                    <span>Weather Whale</span>
                </Link>

                <div className="header_nav_cluster">
                    <nav className="header_nav" aria-label="Primary navigation">
                        <NavLink className="nav_link" to="/">
                            Home
                        </NavLink>
                        <NavLink className="nav_link" to="/search">
                            Forecast
                        </NavLink>
                        {/*     <NavLink className="nav_link nav_badge" to="/parks">
                            National Parks
                        </NavLink>*/}
                        <NavLink className="nav_link" to="/about">
                            About
                        </NavLink>
                    </nav>

                    <button
                        type="button"
                        className="theme_toggle"
                        onClick={() => setTheme(nextTheme)}
                        aria-label={`Switch to ${nextTheme} mode`}
                        title={`Switch to ${nextTheme} mode`}
                    >
                        {theme === "dark" ? <Sun /> : <Moon />}
                    </button>
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="site_footer">
            <div className="footer_content">
                <div className="footer_brand">
                    <img src={logo_d} alt="" aria-hidden="true" />
                    <div>
                        <h2>Weather Whale</h2>
                        <p>Weather, translated into atmosphere.</p>
                    </div>
                </div>

                <div className="footer_links">
                    <a href="https://www.weatherapi.com/" target="_blank" rel="noreferrer">
                        Data from WeatherAPI
                    </a>

                    <a
                        href="https://github.com/mattc-27"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="footer_github"
                    >
                        <FaGithub size={22} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export { Header, Footer };