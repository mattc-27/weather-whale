import { parseWeatherApiDateTime } from "./time";

export function buildTodayTimeline(hourly, current) {
    if (!Array.isArray(hourly) || hourly.length === 0) {
        return [];
    }

    const warmest = maxBy(hourly, "tempF");
    const breeziest = maxBy(hourly, "windMph");
    const evening = hourly.find((hour) => {
        const date = parseWeatherApiDateTime(hour.time);
        return date && date.getHours() >= 20;
    });

    return [
        {
            key: "now",
            label: "Now",
            timeLabel: "Now",
            title: current?.conditionText ?? "Current conditions",
            detail: current?.tempF != null ? `${current.tempF}°` : "",
            icon: current?.icon ?? null,
        },
        {
            key: "warmest",
            label: "Warmest",
            timeLabel: warmest?.hourLabel ?? "",
            title: "Warmest part of day",
            detail: warmest?.tempF != null ? `${warmest.tempF}°` : "",
            icon: warmest?.icon ?? null,
        },
        {
            key: "breezy",
            label: "Breezy",
            timeLabel: breeziest?.hourLabel ?? "",
            title: "Peak wind",
            detail:
                breeziest?.windMph != null
                    ? `${breeziest.windMph} mph ${breeziest.windDir ?? ""}`.trim()
                    : "",
            icon: breeziest?.icon ?? null,
        },
        {
            key: "evening",
            label: "Evening",
            timeLabel: evening?.hourLabel ?? "",
            title: evening?.conditionText ?? "Evening conditions",
            detail: evening?.tempF != null ? `${evening.tempF}°` : "",
            icon: evening?.icon ?? null,
        },
    ];
}

function maxBy(items, key) {
    return items.reduce((maxItem, item) => {
        if (item?.[key] == null) return maxItem;
        if (!maxItem || item[key] > maxItem[key]) return item;
        return maxItem;
    }, null);
}