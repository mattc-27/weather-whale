export function parseLocalDate(localtime) {
    if (!localtime) return null;

    return parseWeatherApiDateTime(localtime);
}

export function parseWeatherApiDateTime(value) {
    if (!value) return null;

    const normalized = String(value).replace(" ", "T");
    const date = new Date(normalized);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function parseDateOnly(value) {
    if (!value) return null;

    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatHourLabel(date) {
    if (!date) return "";

    return date.toLocaleTimeString([], {
        hour: "numeric",
    });
}

export function formatDayLabel(date) {
    if (!date) return "";

    return date.toLocaleDateString([], {
        weekday: "short",
    });
}