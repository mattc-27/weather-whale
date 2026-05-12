import { formatWeatherResponse } from "../util/weather/formatWeather";

async function getAirQuality(lat, lon) {
    try {
        const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);

        if (!response.ok) {
            throw new Error(`Air quality request failed: ${response.status}`);
        }

        const data = await response.json();
        return data?.data?.current?.pollution?.aqius ?? null;
    } catch (error) {
        console.error("Failed to fetch air quality data:", error);
        return null;
    }
}

async function getWeatherApiData(q) {
    const response = await fetch(`/api/weather/${q}`);

    if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`);
    }

    return response.json();
}

export async function fetchWeather(q) {
    try {
        const searchLocation = String(q || "").trim();

        if (!searchLocation) {
            throw new Error("Missing weather search location");
        }

        const coords = parseCoordinates(searchLocation);

        const weatherPromise = getWeatherApiData(searchLocation);
        const airQualityPromise = coords
            ? getAirQuality(coords.lat, coords.lon)
            : Promise.resolve(null);

        const [weatherData, airQuality] = await Promise.all([
            weatherPromise,
            airQualityPromise,
        ]);

        return {
            success: true,
            ...formatWeatherResponse({
                weatherData,
                airQuality,
            }),
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw new Error("Failed to fetch weather data");
    }
}

// Temporary backwards-compatible aliases.
export async function getWeatherData(searchLocation) {
    return fetchWeather(searchLocation);
}

export async function getWeatherMain(q) {
    return fetchWeather(q);
}

function parseCoordinates(value) {
    if (!String(value).includes(",")) return null;

    const [latRaw, lonRaw] = String(value)
        .split(",")
        .map((coord) => coord.trim());

    const lat = Number(latRaw);
    const lon = Number(lonRaw);

    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return { lat, lon };
}
export function getRandomItem(arr) {
    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);
    // get random item
    const item = arr[randomIndex];
    return item;
}
