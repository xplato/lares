import { Droplets } from "lucide-react";

import { Text } from "@/components/ui/text";

import { HourlyWeather } from "./useWeather";
import { describeWeatherCode } from "./weatherCode";

interface HourlyForecastItemProps {
  hour: HourlyWeather;
  isNow?: boolean;
}

export default function HourlyForecastItem({
  hour,
  isNow,
}: HourlyForecastItemProps) {
  const { Icon } = describeWeatherCode(hour.weatherCode);
  const timeLabel = isNow
    ? "Now"
    : hour.time.toLocaleTimeString(undefined, { hour: "numeric" });

  return (
    <div className="flex min-w-14 flex-col items-center gap-2 px-2 py-3">
      <Text className="text-muted-foreground text-xs tracking-wide uppercase">
        {timeLabel}
      </Text>
      <Icon className="text-foreground size-6" />
      <Text className="text-foreground text-sm font-medium tabular-nums">
        {Math.round(hour.temperature)}°
      </Text>
      {hour.precipitationProbability >= 20 && (
        <Text className="text-muted-foreground flex items-center gap-0.5 text-[10px] tabular-nums">
          <Droplets className="size-3" />
          {Math.round(hour.precipitationProbability)}%
        </Text>
      )}
    </div>
  );
}
