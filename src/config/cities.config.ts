import type { CityLocation } from "@/features/weather/types/city.types";

/**
 * Suggested cities shown before the user begins typing in the search box.
 * Coordinates resolved via OpenWeatherMap's geocoding API.
 */
export const SUGGESTED_CITIES: readonly CityLocation[] = [
  { name: "Toronto", country: "CA", lat: 43.6534817, lon: -79.3839347 },
  { name: "Ottawa", country: "CA", lat: 45.4208777, lon: -75.6901106 },
  { name: "Tokyo", country: "JP", lat: 35.6828387, lon: 139.7594549 },
] as const;
