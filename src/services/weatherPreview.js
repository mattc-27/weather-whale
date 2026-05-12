// Lightweight weather query for homepage ambient preview

export async function fetchWeatherPreview(query) {
    const normalizedQuery = String(query ?? "").trim();

    if (!normalizedQuery) {
        throw new Error("A location is required for weather preview.");
    }

    const response = await fetch(
        `/api/weather-preview/${encodeURIComponent(normalizedQuery)}`
    );

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("Unable to read weather preview response.");
    }

    if (!response.ok) {
        throw new Error(data?.error || "Unable to fetch weather preview.");
    }

    return {
        ...data,
        current: {
            ...data.current,
            conditionIcon: normalizeIconUrl(data.current?.conditionIcon),
        },
        ambient: {
            phrase: buildAmbientPhrase(data),
            windPhrase: buildWindPhrase(data.current?.windMph),
        },
    };
}

function normalizeIconUrl(iconUrl) {
    if (!iconUrl) return null;
    return iconUrl.startsWith("//") ? `https:${iconUrl}` : iconUrl;
}

function buildWindPhrase(windMph = 0) {
    const wind = Number(windMph) || 0;

    if (wind <= 2) return "still air";
    if (wind <= 7) return "light air";
    if (wind <= 15) return "moving air";
    if (wind <= 25) return "wind picking up";
    return "strong wind";
}

function buildAmbientPhrase(weather) {
    const text = String(weather?.current?.conditionText ?? "").toLowerCase();
    const wind = Number(weather?.current?.windMph) || 0;

    if (text.includes("clear") || text.includes("sunny")) {
        return wind <= 7 ? "settled skies" : "bright and moving";
    }

    if (text.includes("partly cloudy")) {
        return "broken light";
    }

    if (text.includes("cloud") || text.includes("overcast")) {
        return "soft cloud cover";
    }

    if (text.includes("mist") || text.includes("fog")) {
        return "low visibility";
    }

    if (text.includes("rain") || text.includes("drizzle")) {
        return "rain nearby";
    }

    if (text.includes("snow")) {
        return "snow in the air";
    }

    if (text.includes("thunder")) {
        return "charged skies";
    }

    return weather?.current?.conditionText ?? "conditions nearby";
}