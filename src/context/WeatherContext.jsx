import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Backgrounds } from "../assets/Backgrounds";
import { getRandomItem } from "../services/weather";

const WeatherContext = createContext(null);

function WeatherProvider({ children }) {
    const [weather, setWeather] = useState(null);
    const [background, setBackground] = useState("");

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("wwTheme") || "dark";
    });

    const [units, setUnits] = useState("imperial");
    const [recentSearches, setRecentSearches] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("weatherRecentSearches")) ?? [];
        } catch {
            return [];
        }
    });


    // location selection
    const [selectedLocation, setSelectedLocation] = useState(() => {
        const saved = localStorage.getItem("wwSelectedLocation");
        return saved ? JSON.parse(saved) : null;
    });

    const saveSelectedLocation = useCallback((location) => {
        setSelectedLocation(location);
        localStorage.setItem("wwSelectedLocation", JSON.stringify(location));
    }, []);


    const saveWeather = useCallback((nextWeather) => {
        setWeather(nextWeather);

        try {
            localStorage.setItem("weatherConditions", JSON.stringify(nextWeather));
        } catch {
            // localStorage failure should not break weather rendering
        }
    }, []);

    const addRecentSearch = useCallback((searchItem) => {
        if (!searchItem) return;

        setRecentSearches((prev) => {
            const normalized = {
                label: searchItem.label ?? searchItem.name ?? searchItem.query,
                query: searchItem.query,
                timestamp: Date.now(),
            };

            const next = [
                normalized,
                ...prev.filter((item) => item.query !== normalized.query),
            ].slice(0, 6);

            try {
                localStorage.setItem("weatherRecentSearches", JSON.stringify(next));
            } catch {
                // localStorage failure should not break search
            }

            return next;
        });
    }, []);

    const getBackground = useCallback((response) => {
        const country = response?.country ?? response?.location?.country;
        const region = response?.region ?? response?.location?.region;
        const name = response?.name ?? response?.location?.name;

        if (!country) return "";

        let selectedImage = null;

        if (country !== "United States of America") {
            const locationImages = Backgrounds.countries.find(
                (item) => item.country === country
            );

            selectedImage = getRandomItem(locationImages?.images ?? []);
        } else {
            const locationImages = Backgrounds.images.find(
                (item) => item.region === region
            );

            const cityImages = locationImages?.names?.find(
                (item) => item.name === name
            );

            selectedImage = getRandomItem(
                cityImages?.images ?? locationImages?.images ?? []
            );
        }

        const nextBackground = selectedImage?.value
            ? `url(${selectedImage.value})`
            : "";

        setBackground(nextBackground);
        return nextBackground;
    }, []);


    const updateTheme = useCallback((nextTheme) => {
        setTheme(nextTheme);
        localStorage.setItem("wwTheme", nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const value = useMemo(
        () => ({
            weather,
            setWeather: saveWeather,

            background,
            setBackground,
            getBackground,

            units,
            setUnits,

            recentSearches,
            addRecentSearch,

            theme,
            setTheme: updateTheme,

            selectedLocation,
            setSelectedLocation: saveSelectedLocation,

        }),
        [
            weather,
            saveWeather,
            background,
            getBackground,
            units,
            recentSearches,
            addRecentSearch,
            theme,
            updateTheme,


        ]
    );


    return (
        <WeatherContext.Provider value={value}>
            {children}
        </WeatherContext.Provider>
    );
}

export { WeatherContext, WeatherProvider };