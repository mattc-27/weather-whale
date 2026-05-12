import { WeatherIconsReformatted } from "../../assets/WeatherIconsReformatted";

export function getIconData(code) {
    return WeatherIconsReformatted.find(({ code: iconCode }) => iconCode === code) ?? null;
}

export function getIcon(code) {
    const iconData = getIconData(code);
    return iconData ? iconData.forecast : null;
}