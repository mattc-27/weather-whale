export function buildChartData(hourly) {
    return {
        hourlyTemp: hourly.map((hour) => ({
            time: hour.time,
            hourLabel: hour.hourLabel,
            temp: hour.tempF,
            tempF: hour.tempF,
            feelsLike: hour.feelsLikeF,
            feelsLikeF: hour.feelsLikeF,
            precipChance: hour.precipChance,
            windMph: hour.windMph,
        })),
    };
}