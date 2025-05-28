import React from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { SearchInput } from "./Search";

import '../stylesheets/layout.css';

//import logo_a from '../assets/logos/logo_a.png';
import logo_d from '../assets/logos/logo_d.png';
import logo_b from '../assets/logos/logo_b.png';

function Header() {
    return (
        <header>
            <div className="header_wrapper">
                <div className='header_content'>
                    <div className='header_title'>
                        <img src={logo_b} />
                        <h2>Weather Whale</h2>
                    </div>
                    <nav className='header_nav'>
                        <Link className='nav_link' to={'/'}>
                            Home
                        </Link>
                        <a className='nav_link' href='/search'>
                            Search
                        </a>
                        <Link className='nav_link' to={'/about'}>
                            About
                        </Link>
                        <Link className='nav_link new' to={'/parks'}>
                            National Park Conditions (Coming Soon)
                        </Link>
                    </nav>
                </div>
                <SearchInput wrapperStyle={`search_container`} />
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