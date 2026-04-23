import { useQuery } from "@tanstack/react-query";

import { weatherProvider } from "@/features/weather/api/weather.provider";
import {
  cityKey,
  type CityLocation,
} from "@/features/weather/types/city.types";

export const forecastQueryKey = (city: CityLocation) =>
  ["weather", "forecast", cityKey(city)] as const;

export const useForecast = (city: CityLocation | null, enabled: boolean) =>
  useQuery({
    queryKey: city ? forecastQueryKey(city) : ["weather", "forecast", "idle"],
    queryFn: ({ signal }) => {
      if (!city) throw new Error("City is required");
      return weatherProvider.getForecast(city, signal);
    },
    enabled: enabled && city !== null,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
