import {
    buildLocation,
    buildMeta,
    buildCurrentWeather,
    buildTodaySummary,
    buildMetrics,
    buildSun,
    buildHourlyForecast,
    buildDailyForecast,
} from "./builders";

import { buildTodayTimeline } from "./timeline";
import { buildPawcast } from "./pawcast";
import { buildChartData } from "./chart";
import { buildAlerts } from "./alerts";
import { getIconData } from "./icons";
import { parseLocalDate } from "./time";

export function formatWeatherResponse({ weatherData, airQuality }) {
    const locationRaw = weatherData?.location ?? {};
    const currentRaw = weatherData?.current ?? {};
    const forecastDays = weatherData?.forecast?.forecastday ?? [];
    const alertsRaw = weatherData?.alerts?.alert ?? [];

    const todayRaw = forecastDays[0] ?? {};
    const todayDayRaw = todayRaw?.day ?? {};
    const todayAstroRaw = todayRaw?.astro ?? {};
    const currentConditionRaw = currentRaw?.condition ?? {};

    const localDate = parseLocalDate(locationRaw.localtime);
    const currentIcon = getIconData(currentConditionRaw.code);

    const location = buildLocation(locationRaw);
    const meta = buildMeta(locationRaw, localDate);
    const current = buildCurrentWeather(currentRaw, currentIcon);
    const today = buildTodaySummary(todayRaw, currentRaw);
    const metrics = buildMetrics(currentRaw, todayDayRaw, airQuality);
    const sun = buildSun(todayAstroRaw);
    const hourly = buildHourlyForecast(todayRaw?.hour ?? []);
    const daily = buildDailyForecast(forecastDays);
    const timeline = buildTodayTimeline(hourly, current);
    const pawcast = buildPawcast(currentRaw);
    const chart = buildChartData(hourly);
    const alerts = buildAlerts(alertsRaw);

    return {
        // Shared / app-level
        location,
        meta,

        // HeroWeatherPanel
        current,
        today,

        // CurrentConditionsGrid + ExtendedMetricsGrid
        metrics,

        // TodayAtGlanceCard
        sun,

        // TodayTimeline
        timeline,

        // HourlyForecastRail
        hourly,

        // PawcastCard
        pawcast,

        // HourlyTrendAnalysis
        chart,

        // DailyForecastStrip
        daily,

        // Alerts / future alert banner
        alerts,

        /**
         * Temporary backwards compatibility while Dashboard.jsx/components are migrated.
         * Delete this block after the UI reads the normalized objects above.
         */
        searchLocation: location,
        name: location.name,
        region: location.region,
        country: location.country,
        temp_f: current.tempF,
        condition: current.condition,
        wind_mph: metrics.wind.speedMph,
        wind_dir: metrics.wind.direction,
        humidity: metrics.humidity.value,
        pressure_in: metrics.pressure.value,
        formatIcon: current.icon,
        isValid: true,
        localtime: meta.localTime,
        formattedTime: meta.localHour,
        isDay: meta.isDay,
        cloud: current.cloud,
        vis_miles: metrics.visibility.value,
        alert: alerts,
        hourlyForecast: hourly,
        hourlyData: chart.hourlyTemp,
        airQuality,
        dogComfort: pawcast,
    };
}