import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CiSearch, CiLocationOn } from "react-icons/ci";
import ReactGA from 'react-ga4';
import { usStates } from '../data/us-states.js';

// import ReactGA from 'react-ga4';

export function SearchInput({ wrapperStyle }) {

    const navigate = useNavigate();

    const [predictions, setPredictions] = useState([]);
    const [searchInput, setSearchInput] = useState({ p: '' });


    // NEW: refs + dropdown position
    const wrapRef = useRef(null);
    const [ddPos, setDdPos] = useState({ top: 0, left: 0, width: 0, ready: false });

    const computeDropdownPos = () => {
        const el = wrapRef.current;
        if (!el) return;
        // position under the whole input container area
        const box = el.getBoundingClientRect();
        setDdPos({
            top: box.bottom + 6,                 // 6px gap under input
            left: box.left,
            width: box.width,
            ready: true,
        });
    };

    useEffect(() => {
        computeDropdownPos();
        window.addEventListener("resize", computeDropdownPos);
        window.addEventListener("scroll", computeDropdownPos, { passive: true });
        return () => {
            window.removeEventListener("resize", computeDropdownPos);
            window.removeEventListener("scroll", computeDropdownPos);
        };
    }, []);

    const clearInput = () => setSearchInput({ p: "" });

    const handleChange = (e) => {
        const val = e.target.value;
        setSearchInput((prev) => ({ ...prev, [e.target.name]: val }));
        const svc = new window.google.maps.places.AutocompleteService();
        svc.getPlacePredictions({ input: val }, (preds, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPredictions(preds || []);
            } else {
                setPredictions([]);
            }
        });
        // reposition while typing in case layout shifts
        computeDropdownPos();
    };


    const handleClick = (prediction) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results.length > 0) {
                const location = results[0].geometry.location;
                const queryVariable = `${location.lat()},${location.lng()}`;

                const q = encodeURIComponent(queryVariable);
                ReactGA.event({
                    category: 'Search',
                    action: 'Place selected',
                    label: prediction.description || prediction.place_id,
                });

                //console.log(q)
                navigate(`/search?q=${q}`);
                clearInput();
            }
        });
    };

    const showDropdown = searchInput.p.length > 0 && predictions.length > 0 && ddPos.ready;



    return (

        <div className={wrapperStyle} ref={wrapRef}>
            <div className="search_component">
                <CiSearch size={"1rem"} color={"#0a0a0a"} id="searchIcon" />
                <input
                    onChange={handleChange}
                    type="text"
                    value={searchInput.p}
                    name="p"
                    placeholder="Search a city or postal code"
                    onFocus={computeDropdownPos}
                />
            </div>

            {showDropdown && (
                <ul
                    className="search_results_dropdown"
                    style={{
                        position: "fixed",
                        top: ddPos.top,
                        left: ddPos.left,
                        width: ddPos.width,
                        zIndex: 2147483647,
                    }}
                >
                    <div className="search_result_list">
                        {predictions.map((prediction) => (
                            <li
                                key={prediction.place_id}
                                onClick={() => handleClick(prediction)}
                                style={{ cursor: "pointer" }}
                            >
                                <CiLocationOn size={20} color={"#2d2d2d"} style={{ alignSelf: "center" }} />
                                {prediction.description}
                            </li>
                        ))}
                    </div>
                </ul>
            )}
        </div>
    );
}

