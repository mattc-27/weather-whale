export function getHumidityLabel(humidity) {
    if (humidity == null) return "";
    if (humidity < 30) return "Dry";
    if (humidity <= 60) return "Comfortable";
    return "Humid";
}

export function getUvLabel(uv) {
    if (uv == null) return "";
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very high";
    return "Extreme";
}

export function getVisibilityLabel(miles) {
    if (miles == null) return "";
    if (miles >= 10) return "Very good";
    if (miles >= 5) return "Good";
    if (miles >= 2) return "Reduced";
    return "Poor";
}

export function getAqiLabel(aqi) {
    if (aqi == null) return "Unavailable";
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for sensitive groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very unhealthy";
    return "Hazardous";
}