import { useQuery } from "@tanstack/react-query";

import { weatherProvider } from "@/features/weather/api/weather.provider";
import {
  cityKey,
  type CityLocation,
} from "@/features/weather/types/city.types";

export const currentWeatherQueryKey = (city: CityLocation) =>
  ["weather", "current", cityKey(city)] as const;

export const useCurrentWeather = (city: CityLocation | null) =>
  useQuery({
    queryKey: city
      ? currentWeatherQueryKey(city)
      : ["weather", "current", "idle"],
    queryFn: ({ signal }) => {
      if (!city) throw new Error("City is required");
      return weatherProvider.getCurrentWeather(city, signal);
    },
    enabled: city !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
