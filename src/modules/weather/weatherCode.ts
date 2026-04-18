import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  LucideIcon,
  Sun,
} from "lucide-react";

export interface WeatherDescription {
  label: string;
  Icon: LucideIcon;
}

export function describeWeatherCode(code: number): WeatherDescription {
  if (code === 0) return { label: "Clear", Icon: Sun };
  if (code === 1) return { label: "Mainly clear", Icon: CloudSun };
  if (code === 2) return { label: "Partly cloudy", Icon: CloudSun };
  if (code === 3) return { label: "Overcast", Icon: Cloud };
  if (code === 45 || code === 48) return { label: "Fog", Icon: CloudFog };
  if (code >= 51 && code <= 57) return { label: "Drizzle", Icon: CloudDrizzle };
  if (code >= 61 && code <= 67) return { label: "Rain", Icon: CloudRain };
  if (code >= 71 && code <= 77) return { label: "Snow", Icon: CloudSnow };
  if (code >= 80 && code <= 82)
    return { label: "Rain showers", Icon: CloudRain };
  if (code === 85 || code === 86)
    return { label: "Snow showers", Icon: CloudSnow };
  if (code >= 95) return { label: "Thunderstorm", Icon: CloudLightning };
  return { label: "Unknown", Icon: Cloud };
}
