import { getIconData } from "./icons";
import { round } from "./number";
import {
    parseWeatherApiDateTime,
    parseDateOnly,
    formatHourLabel,
    formatDayLabel,
} from "./time";
import {
    getHumidityLabel,
    getUvLabel,
    getVisibilityLabel,
    getAqiLabel,
} from "./labels";

export function buildLocation(locationRaw) {
    return {
        name: locationRaw?.name ?? "Unknown location",
        region: locationRaw?.region ?? "",
        country: locationRaw?.country ?? "",
        lat: locationRaw?.lat ?? null,
        lon: locationRaw?.lon ?? null,
        timezone: locationRaw?.tz_id ?? null,
    };
}

export function buildMeta(locationRaw, localDate) {
    const localHour = localDate ? localDate.getHours() : null;

    return {
        localTime: locationRaw?.localtime ?? null,
        localDate,
        localHour,
        lastUpdated: locationRaw?.localtime ?? null,
        isDay: typeof localHour === "number" ? localHour >= 7 && localHour <= 19 : null,
    };
}

export function buildCurrentWeather(currentRaw, icon) {
    const conditionRaw = currentRaw?.condition ?? {};

    return {
        tempF: round(currentRaw?.temp_f),
        tempC: round(currentRaw?.temp_c),
        feelsLikeF: round(currentRaw?.feelslike_f),
        feelsLikeC: round(currentRaw?.feelslike_c),
        conditionText: conditionRaw?.text ?? "Unknown",
        conditionCode: conditionRaw?.code ?? null,
        conditionIconUrl: conditionRaw?.icon ?? null,
        condition: {
            text: conditionRaw?.text ?? "Unknown",
            icon: conditionRaw?.icon ?? null,
            code: conditionRaw?.code ?? null,
        },
        icon,
        cloud: currentRaw?.cloud ?? null,
        isDay: currentRaw?.is_day === 1,
        uv: currentRaw?.uv ?? null,
    };
}

export function buildTodaySummary(todayRaw, currentRaw) {
    const day = todayRaw?.day ?? {};
    const condition = day?.condition ?? {};

    return {
        date: todayRaw?.date ?? null,
        highF: round(day?.maxtemp_f),
        lowF: round(day?.mintemp_f),
        avgF: round(day?.avgtemp_f),
        highC: round(day?.maxtemp_c),
        lowC: round(day?.mintemp_c),
        avgC: round(day?.avgtemp_c),
        conditionText: condition?.text ?? currentRaw?.condition?.text ?? "Unknown",
        conditionCode: condition?.code ?? currentRaw?.condition?.code ?? null,
        icon: getIconData(condition?.code ?? currentRaw?.condition?.code),
        maxWindMph: round(day?.maxwind_mph),
        totalPrecipIn: round(day?.totalprecip_in, 2),
        totalPrecipMm: round(day?.totalprecip_mm, 1),
        precipChance: day?.daily_chance_of_rain ?? null,
        snowChance: day?.daily_chance_of_snow ?? null,
        summaryText: buildDailyNarrative(todayRaw, currentRaw),
    };
}

export function buildMetrics(currentRaw, todayDayRaw, airQuality) {
    return {
        precipitation: {
            label: "Precip",
            value: todayDayRaw?.daily_chance_of_rain ?? currentRaw?.precip_in ?? 0,
            unit: "%",
            detail:
                Number(todayDayRaw?.daily_chance_of_rain ?? 0) > 0
                    ? "Chance today"
                    : "No rain expected",
        },
        wind: {
            label: "Wind",
            speedMph: round(currentRaw?.wind_mph),
            gustMph: round(currentRaw?.gust_mph),
            direction: currentRaw?.wind_dir ?? null,
            degree: currentRaw?.wind_degree ?? null,
            detail: currentRaw?.wind_dir ?? "",
        },
        humidity: {
            label: "Humidity",
            value: currentRaw?.humidity ?? null,
            unit: "%",
            detail: getHumidityLabel(currentRaw?.humidity),
        },
        uv: {
            label: "UV Index",
            value: currentRaw?.uv ?? null,
            detail: getUvLabel(currentRaw?.uv),
        },
        visibility: {
            label: "Visibility",
            value: round(currentRaw?.vis_miles),
            unit: "mi",
            detail: getVisibilityLabel(currentRaw?.vis_miles),
        },
        pressure: {
            label: "Pressure",
            value: round(currentRaw?.pressure_in, 2),
            unit: "inHg",
            detail: "Steady",
        },
        airQuality: {
            label: "Air Quality",
            value: airQuality,
            unit: "AQI",
            detail: getAqiLabel(airQuality),
        },
    };
}

export function buildSun(astroRaw) {
    return {
        sunrise: astroRaw?.sunrise ?? null,
        sunset: astroRaw?.sunset ?? null,
        moonrise: astroRaw?.moonrise ?? null,
        moonset: astroRaw?.moonset ?? null,
        moonPhase: astroRaw?.moon_phase ?? null,
        moonIllumination: astroRaw?.moon_illumination ?? null,
    };
}

export function buildHourlyForecast(hours) {
    return hours.map((hour) => {
        const condition = hour?.condition ?? {};
        const date = parseWeatherApiDateTime(hour?.time);

        return {
            time: hour?.time ?? null,
            isoTime: hour?.time ? hour.time.replace(" ", "T") : null,
            epoch: hour?.time_epoch ?? null,
            hourLabel: formatHourLabel(date),
            tempF: round(hour?.temp_f),
            tempC: round(hour?.temp_c),
            feelsLikeF: round(hour?.feelslike_f),
            feelsLikeC: round(hour?.feelslike_c),
            conditionText: condition?.text ?? "Unknown",
            conditionCode: condition?.code ?? null,
            conditionIconUrl: condition?.icon ?? null,
            icon: getIconData(condition?.code),
            windMph: round(hour?.wind_mph),
            windDir: hour?.wind_dir ?? null,
            gustMph: round(hour?.gust_mph),
            humidity: hour?.humidity ?? null,
            cloud: hour?.cloud ?? null,
            uv: hour?.uv ?? null,
            precipChance: hour?.chance_of_rain ?? 0,
            snowChance: hour?.chance_of_snow ?? 0,
            precipIn: round(hour?.precip_in, 2),
            precipMm: round(hour?.precip_mm, 1),
            visibilityMiles: round(hour?.vis_miles),
            isDay: hour?.is_day === 1,
        };
    });
}

export function buildDailyForecast(forecastDays) {
    return forecastDays.map((forecastDay) => {
        const day = forecastDay?.day ?? {};
        const astro = forecastDay?.astro ?? {};
        const condition = day?.condition ?? {};
        const date = parseDateOnly(forecastDay?.date);

        return {
            date: forecastDay?.date ?? null,
            dayLabel: formatDayLabel(date),
            highF: round(day?.maxtemp_f),
            lowF: round(day?.mintemp_f),
            avgF: round(day?.avgtemp_f),
            highC: round(day?.maxtemp_c),
            lowC: round(day?.mintemp_c),
            avgC: round(day?.avgtemp_c),
            conditionText: condition?.text ?? "Unknown",
            conditionCode: condition?.code ?? null,
            conditionIconUrl: condition?.icon ?? null,
            icon: getIconData(condition?.code),
            precipChance: day?.daily_chance_of_rain ?? 0,
            snowChance: day?.daily_chance_of_snow ?? 0,
            totalPrecipIn: round(day?.totalprecip_in, 2),
            maxWindMph: round(day?.maxwind_mph),
            sunrise: astro?.sunrise ?? null,
            sunset: astro?.sunset ?? null,
        };
    });
}

function buildDailyNarrative(todayRaw, currentRaw) {
    const day = todayRaw?.day ?? {};
    const conditionText = day?.condition?.text ?? currentRaw?.condition?.text ?? "conditions";
    const high = round(day?.maxtemp_f);
    const low = round(day?.mintemp_f);
    const rainChance = day?.daily_chance_of_rain ?? 0;
    const maxWind = round(day?.maxwind_mph);

    const tempText =
        high != null && low != null
            ? `High near ${high}° with a low around ${low}°.`
            : "";

    const rainText =
        Number(rainChance) > 0
            ? `${rainChance}% chance of precipitation.`
            : "No significant rain expected.";

    const windText =
        maxWind != null && maxWind >= 12
            ? `Breezy at times with winds up to ${maxWind} mph.`
            : "Calm to light winds expected.";

    return `${capitalize(conditionText)} today. ${tempText} ${rainText} ${windText}`.trim();
}

function capitalize(value) {
    if (!value) return "";

    const str = String(value);
    return str.charAt(0).toUpperCase() + str.slice(1);
}