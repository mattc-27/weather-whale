import React from 'react';
import { WiFog, WiSleet, WiDayThunderstorm, WiDaySnowThunderstorm, WiSnowWind, WiDaySunny, WiDayCloudy, WiRain } from "react-icons/wi";

const colorVariations = [
	{ value: '#dbeeff', size: 200 },
	{ forecast: '#dbeeff' },
	{ daily: '#dbeeff' }
]
const WeatherIcons = [
	{
		code: 1000,
		text: "Sunny",
		value: <WiDaySunny size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiDaySunny size={60} style={{ color: "#dbeeff", margin: '0.5%' }} />,
		daily: <WiDaySunny size={110} style={{ color: "#dbeeff" }} />

	},
	{
		code: 1003,
		text: "Partly cloudy",
		value: <WiDayCloudy size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiDayCloudy size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiDayCloudy size={110} style={{ color: "#dbeeff" }} />

	},
	{
		code: 1006,
		text: "Cloudy",
		value: <WiDaySunny size={115} style={{ color: "#dbeeff" }} />,
		forecast: <WiDaySunny size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiDaySunny size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1009,
		text: "Overcast",
		value: <WiFog size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiFog size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiFog size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1030,
		text: "Mist",
		value: <WiFog size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiFog size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiFog size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1063,
		text: "Patchy rain possible",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1066,
		text: "Patchy snow possible",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},

	{
		code: 1069,
		text: "Patchy sleet possible",
		value: <WiSleet size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiSleet size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSleet size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1072,
		text: "Patchy freezing drizzle possible",
		value: <WiSleet size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiSleet size={131000} style={{ color: "#dbeeff" }} />,
		daily: <WiSleet size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1087,
		text: "Thundery outbreaks possible",
		value: <WiDayThunderstorm size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiDayThunderstorm size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiDayThunderstorm size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1114,
		text: "Blowing snow",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={115} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1117,
		text: "Blizzard",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1200,
		text: "Fog",
		value: <WiFog size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiFog size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiFog size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1147,
		text: "Freezing fog",
		value: <WiFog size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiFog size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiFog size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1200,
		text: "Patchy light drizzle",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1153,
		text: "Light drizzle",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1168,
		text: "Freezing drizzle",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1171,
		text: "Heaving freezing drizzle",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 11200,
		text: "Patchy light rain",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1183,
		text: "Light rain",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: '#dbeeff' }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1186,
		text: "Moderate rain at times",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1189,
		text: "Moderate rain",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1192,
		text: "Heavy rain at times",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff25" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1195,
		text: "Heavy rain",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff25" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1198,
		text: "Light freezing rain",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 2001,
		text: "Moderate or heavy freezing rain",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 2004,
		text: "Light sleet",
		value: <WiSleet size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiSleet size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSleet size={110} style={{ color: "#dbeeff" }} />

	},
	{
		code: 2007,
		text: "Moderate or heavy sleet",
		value: <WiSleet size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiSleet size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSleet size={110} style={{ color: "#dbeeff" }} />

	},
	{
		code: 1210,
		text: "Patchy light snow",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />

	},
	{
		code: 1213,
		text: "Light snow",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1216,
		text: "Patchy moderate snow",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1219,
		text: "Moderate snow",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1222,
		text: "Patchy heavy snow",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1225,
		text: "Heavy snow",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1237,
		text: "Ice pellets",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1240,
		text: "Light rain shower",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1243,
		text: "Moderate or heavy rain shower",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1246,
		text: "Torrential rain shower",
		value: <WiRain size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiRain size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1249,
		text: "Light sleet showers",
		value: <WiSleet size={115} style={{ color: '#edf3fc' }} />,
		forecast: <WiSleet size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSleet size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1252,
		text: "Moderate or heavy sleet showers",
		value: <WiSleet size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiSleet size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSleet size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1255,
		text: "Light snow showers",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1258,
		text: "Moderate or heavy snow showers",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1261,
		text: "Light showers of ice pellets",
		value: <WiSleet size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiSleet size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiRain size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1264,
		text: "Moderate or heavy showers of ice pellets",
		value: <WiSnowWind size={115} style={{ color: '#dbeeff' }} />,
		forecast: <WiSnowWind size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiSnowWind size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1273,
		text: "Patchy light rain with thunder",
		value: <WiDayThunderstorm size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiDayThunderstorm size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiDayThunderstorm size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1276,
		text: "Moderate or heavy rain with thunder",
		value: <WiDayThunderstorm size={115} style={{ color: "#edf3fc" }} />,
		forecast: <WiDayThunderstorm size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiDayThunderstorm size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1279,
		text: "Patchy light snow with thunder",
		value: <WiDaySnowThunderstorm size={115} style={{ color: "#dbeeff" }} />,
		forecast: <WiDaySnowThunderstorm size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiDaySnowThunderstorm size={110} style={{ color: "#dbeeff" }} />
	},
	{
		code: 1282,
		text: "Moderate or heavy snow with thunder",
		value: <WiDaySnowThunderstorm size={115} style={{ color: "#dbeeff" }} />,
		forecast: <WiDaySnowThunderstorm size={60} style={{ color: "#dbeeff" }} />,
		daily: <WiDaySnowThunderstorm size={110} style={{ color: "#dbeeff" }} />
	}
];

export { WeatherIcons };