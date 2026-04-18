import { useQuery } from "@tanstack/react-query";
import { fetchWeatherApi } from "openmeteo";

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  label?: string;
}

export interface CurrentWeather {
  time: Date;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
}

export interface HourlyWeather {
  time: Date;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface DailyWeather {
  time: Date;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  humidityMean: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface WeatherData {
  timezone: string | null;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

async function fetchWeather(
  location: WeatherLocation,
): Promise<WeatherData> {
  const params = {
    latitude: [location.latitude],
    longitude: [location.longitude],
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ],
    hourly: [
      "temperature_2m",
      "weather_code",
      "precipitation_probability",
    ],
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "relative_humidity_2m_mean",
      "precipitation_sum",
      "wind_speed_10m_max",
    ],
    timezone: "auto",
    forecast_days: 7,
  };

  const responses = await fetchWeatherApi(
    "https://api.open-meteo.com/v1/forecast",
    params,
  );
  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const current = response.current()!;
  const hourly = response.hourly()!;
  const daily = response.daily()!;

  const hourlyTimes = range(
    Number(hourly.time()),
    Number(hourly.timeEnd()),
    hourly.interval(),
  ).map((t) => new Date((t + utcOffsetSeconds) * 1000));

  const hourlyTemperature = hourly.variables(0)!.valuesArray()!;
  const hourlyWeatherCodes = hourly.variables(1)!.valuesArray()!;
  const hourlyPrecipitationProbability = hourly.variables(2)!.valuesArray()!;

  const hourlyWeather: HourlyWeather[] = hourlyTimes.map((time, i) => ({
    time,
    temperature: hourlyTemperature[i],
    weatherCode: hourlyWeatherCodes[i],
    precipitationProbability: hourlyPrecipitationProbability[i] ?? 0,
  }));

  const dailyTimes = range(
    Number(daily.time()),
    Number(daily.timeEnd()),
    daily.interval(),
  ).map((t) => new Date((t + utcOffsetSeconds) * 1000));

  const dailyWeatherCodes = daily.variables(0)!.valuesArray()!;
  const dailyTempMax = daily.variables(1)!.valuesArray()!;
  const dailyTempMin = daily.variables(2)!.valuesArray()!;
  const dailyHumidity = daily.variables(3)!.valuesArray()!;
  const dailyPrecipitation = daily.variables(4)!.valuesArray()!;
  const dailyWindMax = daily.variables(5)!.valuesArray()!;

  const dailyWeather: DailyWeather[] = dailyTimes.map((time, i) => ({
    time,
    weatherCode: dailyWeatherCodes[i],
    temperatureMax: dailyTempMax[i],
    temperatureMin: dailyTempMin[i],
    humidityMean: dailyHumidity[i],
    precipitationSum: dailyPrecipitation[i],
    windSpeedMax: dailyWindMax[i],
  }));

  return {
    timezone: response.timezone(),
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature: current.variables(0)!.value(),
      humidity: current.variables(1)!.value(),
      apparentTemperature: current.variables(2)!.value(),
      precipitation: current.variables(3)!.value(),
      weatherCode: current.variables(4)!.value(),
      windSpeed: current.variables(5)!.value(),
    },
    hourly: hourlyWeather,
    daily: dailyWeather,
  };
}

export function useWeather(location: WeatherLocation) {
  return useQuery({
    queryKey: ["weather", location.latitude, location.longitude],
    queryFn: () => fetchWeather(location),
  });
}
