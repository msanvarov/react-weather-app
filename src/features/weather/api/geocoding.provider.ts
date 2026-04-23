import { z } from "zod";

import { env } from "@/config/env.config";
import type { CityLocation } from "@/features/weather/types/city.types";
import { WeatherApiError } from "@/features/weather/api/weather.provider";

const directResultSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

const directResponseSchema = z.array(directResultSchema);

export const MAX_SEARCH_RESULTS = 8;

const buildUrl = (query: string, limit: number): string => {
  const url = new URL(`${env.openWeatherGeoUrl}/direct`);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("appid", env.openWeatherApiKey);
  return url.toString();
};

/**
 * Dedupe near-identical results. OWM sometimes returns multiple entries for
 * the same place (e.g. differing only by state field), which is noisy.
 */
const deduplicate = (cities: readonly CityLocation[]): CityLocation[] => {
  const seen = new Set<string>();
  const result: CityLocation[] = [];
  for (const city of cities) {
    const key = `${city.name.toLowerCase()}|${city.country}|${city.state?.toLowerCase() ?? ""}|${city.lat.toFixed(2)}|${city.lon.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(city);
  }
  return result;
};

export const geocodingProvider = {
  async searchCities(
    query: string,
    signal?: AbortSignal,
    limit = MAX_SEARCH_RESULTS,
  ): Promise<readonly CityLocation[]> {
    const trimmed = query.trim();
    if (trimmed.length === 0) return [];

    const init: RequestInit = signal ? { signal } : {};
    const response = await fetch(buildUrl(trimmed, limit), init);

    if (!response.ok) {
      throw new WeatherApiError(
        response.statusText || "City search failed",
        response.status,
      );
    }

    const json = (await response.json()) as unknown;
    const parsed = directResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new WeatherApiError(
        `Unexpected geocoding payload: ${parsed.error.issues[0]?.message ?? "validation failed"}`,
        500,
      );
    }

    const cities: CityLocation[] = parsed.data.map((raw) => ({
      name: raw.name,
      country: raw.country,
      ...(raw.state ? { state: raw.state } : {}),
      lat: raw.lat,
      lon: raw.lon,
    }));

    return deduplicate(cities);
  },
};

export type GeocodingProvider = typeof geocodingProvider;
