import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CiSearch, CiLocationOn } from "react-icons/ci";
import ReactGA from 'react-ga4';
import { usStates } from '../data/us-states.js';

// import ReactGA from 'react-ga4';

export function SearchInput({ wrapperStyle }) {

    const navigate = useNavigate();

    const [predictions, setPredictions] = useState([]);
    const [searchInput, setSearchInput] = useState({ p: '' });



    const clearInput = () => {
        setSearchInput({ p: '' });
    };

    const handleChange = (e) => {
        setSearchInput((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions(
            { input: searchInput.p },
            (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setPredictions(predictions);
                }
            }
        );
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

    const handleButtonClick = () => {
        const queryVariable = searchInput.p
        setQuery({ q: queryVariable })
    }


    // Fire GA event
    /*         ReactGA.event({
                category: 'Search',
                action: 'Selected Member',
                label: item.full_name,
                value: 1
            });*/


    return (


        <div className={wrapperStyle}>

            <div className='search_component'>
                <CiSearch size={'1rem'} color={'#0a0a0a'} id="searchIcon" />
                <input
                    onChange={handleChange}
                    type='text'
                    value={searchInput.p}
                    name='p'
                    placeholder='Search a city or postal code'
                />
            </div>
            {searchInput.p.length != 0 && predictions.length >= 1 && (
                <ul className='search_results_dropdown'>
                    {predictions.map((prediction) => {
                        return (
                            <ul className='search_result_list'>
                                <li
                                    key={prediction.place_id}
                                    onClick={() => handleClick(prediction)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <CiLocationOn size={20} color={'#2d2d2d'} style={{ alignSelf: 'center' }} />  {prediction.description}
                                </li>
                            </ul>
                        )
                    })}
                </ul>
            )}
        </div>
    );
}

