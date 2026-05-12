import React, { useEffect, useRef, useState } from "react";
import { CiLocationOn, CiSearch } from "react-icons/ci";
import ReactGA from "react-ga4";

export function SearchInput({
    value = "",
    onChange,
    onSubmit,
    placeholder = "Search a city or postal code",
    wrapperStyle = "search_container",
    inputId = "weather-search",
}) {
    const [inputValue, setInputValue] = useState(value);
    const [predictions, setPredictions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const wrapRef = useRef(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (!wrapRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function getPlacesService() {
        if (!window.google?.maps?.places?.AutocompleteService) {
            return null;
        }

        return new window.google.maps.places.AutocompleteService();
    }

    function getGeocoder() {
        if (!window.google?.maps?.Geocoder) {
            return null;
        }

        return new window.google.maps.Geocoder();
    }

    function handleInputChange(event) {
        const nextValue = event.target.value;

        setInputValue(nextValue);
        onChange?.(nextValue);

        if (!nextValue.trim()) {
            setPredictions([]);
            setIsOpen(false);
            return;
        }

        const service = getPlacesService();

        if (!service) {
            setPredictions([]);
            setIsOpen(false);
            return;
        }

        service.getPlacePredictions({ input: nextValue }, (preds, status) => {
            const okStatus = window.google?.maps?.places?.PlacesServiceStatus?.OK;

            if (status === okStatus) {
                setPredictions(preds ?? []);
                setIsOpen(true);
            } else {
                setPredictions([]);
                setIsOpen(false);
            }
        });
    }

    function handleManualSubmit(event) {
        event.preventDefault();

        const trimmed = inputValue.trim();
        if (!trimmed) return;

        ReactGA.event({
            category: "Search",
            action: "Manual weather search",
            label: trimmed,
        });

        onSubmit?.({
            label: trimmed,
            query: trimmed,
            source: "manual",
        });

        setIsOpen(false);
    }

    function handlePredictionClick(prediction) {
        const geocoder = getGeocoder();

        if (!geocoder) {
            onSubmit?.({
                label: prediction.description,
                query: prediction.description,
                source: "prediction-fallback",
            });
            setIsOpen(false);
            return;
        }

        geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
            const okStatus = window.google?.maps?.GeocoderStatus?.OK;

            if (status === okStatus && results?.length > 0) {
                const location = results[0].geometry.location;
                const query = `${location.lat()},${location.lng()}`;

                ReactGA.event({
                    category: "Search",
                    action: "Place selected",
                    label: prediction.description || prediction.place_id,
                });

                onSubmit?.({
                    label: prediction.description,
                    query,
                    placeId: prediction.place_id,
                    source: "google-place",
                });

                setInputValue("");
                onChange?.("");
                setPredictions([]);
                setIsOpen(false);
            }
        });
    }

    const showDropdown = isOpen && predictions.length > 0;

    return (
        <div className={wrapperStyle} ref={wrapRef}>
            <form className="search_component" onSubmit={handleManualSubmit}>
                <label htmlFor={inputId} className="sr_only">
                    Search weather location
                </label>

                <CiSearch size="1rem" id="searchIcon" aria-hidden="true" />

                <input
                    id={inputId}
                    type="text"
                    value={inputValue}
                    name="p"
                    placeholder={placeholder}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (predictions.length > 0) setIsOpen(true);
                    }}
                    autoComplete="off"
                />

                <button type="submit" className="search_submit">
                    Search
                </button>
            </form>

            {showDropdown && (
                <ul className="search_results_dropdown">
                    <div className="search_result_list">
                        {predictions.map((prediction) => (
                            <li key={prediction.place_id}>
                                <button
                                    type="button"
                                    onClick={() => handlePredictionClick(prediction)}
                                >
                                    <CiLocationOn size={20} aria-hidden="true" />
                                    <span>{prediction.description}</span>
                                </button>
                            </li>
                        ))}
                    </div>
                </ul>
            )}
        </div>
    );
}