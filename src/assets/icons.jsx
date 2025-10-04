// src/ui/icons-compat.jsx
import React from "react";
import {
  CloudFog,
  CloudSun,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudRainWind,
  Droplet,
  Wind,
  ThermometerSun,
  ThermometerSnowflake,
  HelpCircle
} from "lucide-react";

// Small wrapper so all icons accept the same props you already pass
const wrap = (Icon) => (props) => {
  const { strokeWidth = 1.75, ...rest } = props; // adjust thickness once here
  return <Icon strokeWidth={strokeWidth} {...rest} />;
};

/** ----- 1) One-off UI icons you listed ----- */
export const FaTemperatureArrowDown = wrap(ThermometerSnowflake);
export const FaTemperatureArrowUp = wrap(ThermometerSun);
export const CiDroplet = wrap(Droplet);
export const LiaWindSolid = wrap(Wind);
export const LiaCloudSunSolid = wrap(CloudSun);

// Closest to "fog" from weather-icons
export const WiFog = wrap(CloudFog);

/** ----- 2) Weather condition set (closest Lucide matches) ----- */
export const WiDaySunny = wrap(Sun);
export const WiDayCloudy = wrap(CloudSun);
// Fog already mapped above as WiFog
export const WiRain = wrap(CloudRain);
export const WiSnowWind = wrap(CloudRainWind); // or CloudSnow if preferred
export const WiSleet = wrap(CloudRain);        // closest; try CloudRainWind
export const WiDayThunderstorm = wrap(CloudLightning);
export const WiDaySnowThunderstorm = wrap(CloudSnow); // no direct snow+thunder

// Fallback if an unknown condition code slips through
export const UnknownIcon = wrap(HelpCircle);

/*
Usage:

import {
  WiFog,
  FaTemperatureArrowDown,
  FaTemperatureArrowUp,
  CiDroplet,
  LiaWindSolid,
  LiaCloudSunSolid,
  WiDaySunny,
  WiDayCloudy,
  WiRain,
  WiSnowWind,
  WiSleet,
  WiDayThunderstorm,
  WiDaySnowThunderstorm
} from "@/ui/icons-compat";

<WiFog size={24} className="text-slate-600" />
<FaTemperatureArrowUp size={18} />
*/
