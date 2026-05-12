import React, { useState } from "react";
import { FiChevronDown, FiMapPin } from "react-icons/fi";
import { SearchInput } from "../Search";
import { WeatherCard } from "./WeatherCard";

export default function HeroWeatherPanel({
    weather,
    loading,
    searchValue,
    onSearchChange,
    onSearchSubmit,
}) {
    const [searchOpen, setSearchOpen] = useState(false);

    const location = weather?.location;
    const current = weather?.current;
    const today = weather?.today;
    const meta = weather?.meta;

    const locationLabel = location?.name
        ? `${location.name}${location.region ? `, ${location.region}` : ""}`
        : "Search location";

    const localTime = meta?.localTime?.split(" ")?.[1] ?? "--";
    const localDate = today?.date ?? meta?.localTime?.split(" ")?.[0] ?? "";

    const heroIconSrc =
        current?.icon?.forecast ||
        current?.conditionIconUrl ||
        current?.condition?.icon;

    return (
        <WeatherCard className="hero_weather_panel">
            <div className="hero_location_row">
                <div className="hero_location_group">
                    <div className="hero_location">
                        <FiMapPin aria-hidden="true" />
                        <span>{locationLabel}</span>
                    </div>

                    <button
                        type="button"
                        className="hero_change_btn"
                        onClick={() => setSearchOpen((prev) => !prev)}
                    >
                        Change <FiChevronDown aria-hidden="true" />
                    </button>

                    {searchOpen && (
                        <div className="hero_inline_search">
                            <SearchInput
                                value={searchValue}
                                onChange={onSearchChange}
                                onSubmit={(payload) => {
                                    onSearchSubmit(payload);
                                    setSearchOpen(false);
                                }}
                                wrapperStyle="hero_search_container"
                                placeholder="Search city or postal code"
                            />
                        </div>
                    )}
                </div>

                <div className="hero_time_badge">
                    <span>{localTime}</span>
                    <small>{localDate}</small>
                </div>
            </div>

            <div className="hero_weather_body">
                <div className="hero_temp_row">
                    {current?.icon?.forecast && (
                        <img
                            className="hero_condition_icon"
                            src={current.icon.forecast}
                            alt=""
                            aria-hidden="true"
                        />
                    )}

                    <div className="hero_temp">
                        {current?.tempF != null ? `${current.tempF}°` : loading ? "..." : "--"}
                    </div>
                </div>

                <div className="hero_condition_text">
                    {heroIconSrc && (
                        <img
                            className="hero_condition_icon"
                            src={heroIconSrc}
                            alt=""
                            aria-hidden="true"
                        />
                    )}
                    {current?.conditionText ?? "Weather conditions"}
                </div>

                <div className="hero_weather_meta">
                    <span>Feels like {current?.feelsLikeF ?? "--"}°</span>
                    <span>H {today?.highF ?? "--"}°</span>
                    <span>L {today?.lowF ?? "--"}°</span>
                </div>
            </div>
        </WeatherCard>
    );
}