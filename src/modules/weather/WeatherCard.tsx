import Card from "@/components/layout/Card";
import { Text } from "@/components/ui/text";
import { Loader2 } from "lucide-react";

import HourlyForecastItem from "./HourlyForecastItem";
import { useWeather, WeatherLocation } from "./useWeather";
import { describeWeatherCode } from "./weatherCode";

const DEFAULT_LOCATION: WeatherLocation = {
  latitude: 40.8894,
  longitude: -111.8808,
  label: "Bountiful, UT",
};

interface WeatherCardProps {
  location?: WeatherLocation;
}

export default function WeatherCard({
  location = DEFAULT_LOCATION,
}: WeatherCardProps) {
  const { data, isPending, isError } = useWeather(location);

  if (isPending || isError || !data) {
    return (
      <Card
        title="—"
        subtitle={isError ? "Unavailable" : "Loading…"}
        lowerMetaContent={<Text>{location.label}</Text>}
      >
        <div className="bg-foreground/5 flex items-center justify-center rounded-xl">
          {isPending && (
            <Loader2 className="text-muted-foreground size-5 animate-spin" />
          )}
        </div>
      </Card>
    );
  }

  const { current, hourly } = data;
  const { label, Icon } = describeWeatherCode(current.weatherCode);

  const currentTimeMs = current.time.getTime();
  const upcoming = hourly
    .filter((h) => h.time.getTime() + 60 * 60 * 1000 > currentTimeMs)
    .slice(0, 24);

  return (
    <Card
      title={`${Math.round(current.temperature)}°`}
      subtitle={label}
      upperMetaContent={
        <div className="flex items-center gap-2">
          <Icon className="text-foreground size-4" />
          <Text>Feels like {Math.round(current.apparentTemperature)}°</Text>
        </div>
      }
      lowerMetaContent={<Text>{location.label}</Text>}
    >
      <div className="bg-foreground/5 overflow-x-auto rounded-xl px-2 py-6">
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
    </Card>
  );
}
