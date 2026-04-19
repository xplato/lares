import { Loader2 } from "lucide-react";

import { Text } from "@/components/ui/text";

import HourlyForecastItem from "./HourlyForecastItem";
import { useWeather, WeatherLocation } from "./useWeather";
import { describeWeatherCode } from "./weatherCode";

const DEFAULT_LOCATION: WeatherLocation = {
  latitude: 40.8894,
  longitude: -111.8808,
  label: "Bountiful, UT",
};

interface WeatherWidgetProps {
  isActive: boolean;
  location?: WeatherLocation;
}

export default function WeatherWidget({
  isActive,
  location = DEFAULT_LOCATION,
}: WeatherWidgetProps) {
  const { data, isPending, isError } = useWeather(location);

  if (isPending) {
    return (
      <div className="flex size-12 items-center justify-center">
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <>
        <div className="flex size-12 items-center justify-center">
          <Text className="text-muted-foreground text-2xl">—</Text>
        </div>
        <div>
          <Text className="text-2xl font-medium">Unavailable</Text>
        </div>
      </>
    );
  }

  const { current, hourly } = data;
  const { label, Icon } = describeWeatherCode(current.weatherCode);

  if (!isActive) {
    return (
      <>
        <div className="flex size-12 items-center justify-center">
          <Icon className="size-full" />
        </div>
        <div>
          <Text className="text-2xl font-medium">
            {Math.round(current.temperature)}°
          </Text>
        </div>
      </>
    );
  }

  const currentTimeMs = current.time.getTime();
  const upcoming = hourly
    .filter((h) => h.time.getTime() + 60 * 60 * 1000 > currentTimeMs)
    .slice(0, 24);

  return (
    <div className="w-full cursor-default">
      <div className="mb-4 flex items-center gap-3">
        <Icon className="text-foreground size-5" />
        <Text className="text-foreground text-lg font-medium">
          {Math.round(current.temperature)}° — {label}
        </Text>
        <Text className="text-muted-foreground text-sm">
          Feels like {Math.round(current.apparentTemperature)}°
        </Text>
      </div>
      <div className="bg-foreground/5 overflow-x-auto rounded-xl px-2 py-4">
        <div className="flex h-full items-center px-2">
          {upcoming.map((hour, i) => (
            <HourlyForecastItem
              key={hour.time.toISOString()}
              hour={hour}
              isNow={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
