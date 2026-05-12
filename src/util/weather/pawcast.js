import dogComfortRules from "../../data/dogComfort.json";
import { round } from "./number";

export function buildPawcast(currentRaw) {
    const tempF = currentRaw?.temp_f;
    const conditionText = currentRaw?.condition?.text ?? "";
    const cloudCover = currentRaw?.cloud ?? 0;

    const comfort = getDogComfort(tempF, conditionText, cloudCover);

    return {
        ...comfort,
        airTempF: round(tempF),
        pavementTempF: estimatePavementTemp(tempF, cloudCover),
    };
}

function getDogComfort(tempF, conditionText, cloudCover) {
    const safeTemp = Number(tempF);

    if (Number.isNaN(safeTemp)) {
        return {
            comfort: "Unknown",
            advice: "Not enough data to assess conditions.",
            adjustedFeelsLike: null,
            badge: "Unknown",
        };
    }

    const lowerCondition = String(conditionText).toLowerCase();
    const sunny = lowerCondition.includes("sun") && cloudCover < 30;
    const cloudy = cloudCover > 60;

    let adjustedFeelsLike = safeTemp;

    if (sunny) adjustedFeelsLike += 7;
    else if (cloudy) adjustedFeelsLike += 0;
    else adjustedFeelsLike += 3;

    const match = dogComfortRules.find((entry) => {
        const { min, max } = parseRange(entry.dogFeelsLikeF);
        return adjustedFeelsLike >= min && adjustedFeelsLike <= max;
    });

    if (!match) {
        return {
            comfort: "Unknown",
            advice: "Not enough data to assess conditions.",
            adjustedFeelsLike: round(adjustedFeelsLike, 1),
            badge: "Unknown",
        };
    }

    return {
        comfort: match.comfort,
        advice: match.advice,
        adjustedFeelsLike: round(adjustedFeelsLike, 1),
        badge: normalizeDogComfortBadge(match.comfort),
    };
}

function estimatePavementTemp(tempF, cloudCover) {
    if (tempF == null) return null;

    const temp = Number(tempF);

    if (Number.isNaN(temp)) return null;

    if (cloudCover < 30) return round(temp + 18);
    if (cloudCover < 60) return round(temp + 10);

    return round(temp + 4);
}

function parseRange(rangeStr) {
    const normalized = String(rangeStr).replace("+", "");
    const [min, maxRaw] = normalized.split("-").map(Number);
    const max = String(rangeStr).includes("+") ? Infinity : maxRaw;

    return { min, max };
}

function normalizeDogComfortBadge(comfort) {
    const value = String(comfort || "").toLowerCase();

    if (value.includes("safe") || value.includes("great")) return "Great for walks";
    if (value.includes("warm")) return "Use caution";
    if (value.includes("hot")) return "Limit walks";
    if (value.includes("cold")) return "Bundle up";

    return comfort || "Pawcast";
}