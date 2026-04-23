import { z } from 'zod';

import { env } from '@/config/env.config';
import type {
  CurrentWeather,
  Forecast,
  ForecastEntry,
  WeatherCondition,
} from '@/features/weather/types/weather.types';

const conditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const currentWeatherResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  dt: z.number(),
  timezone: z.number(),
  sys: z.object({ country: z.string().optional() }),
  main: z.object({
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({ speed: z.number() }),
  weather: z.array(conditionSchema).min(1),
});

const forecastEntrySchema = z.object({
  dt: z.number(),
  main: z.object({
    temp: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
    humidity: z.number(),
  }),
  wind: z.object({ speed: z.number() }),
  weather: z.array(conditionSchema).min(1),
});

const forecastResponseSchema = z.object({
  city: z.object({
    id: z.number(),
    name: z.string(),
    country: z.string(),
    timezone: z.number(),
  }),
  list: z.array(forecastEntrySchema),
});

const errorResponseSchema = z.object({
  cod: z.union([z.string(), z.number()]).optional(),
  message: z.string().optional(),
});

export class WeatherApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'WeatherApiError';
    this.status = status;
  }
}

const firstCondition = (list: z.infer<typeof conditionSchema>[]): WeatherCondition => {
  const [head] = list;
  if (!head) {
    throw new WeatherApiError('Malformed weather payload: missing condition', 500);
  }
  return head;
};

const toCurrentWeather = (
  raw: z.infer<typeof currentWeatherResponseSchema>,
): CurrentWeather => ({
  cityId: raw.id,
  cityName: raw.name,
  country: raw.sys.country ?? '',
  temperatureK: raw.main.temp,
  feelsLikeK: raw.main.feels_like,
  humidity: raw.main.humidity,
  windSpeedMs: raw.wind.speed,
  condition: firstCondition(raw.weather),
  observedAt: new Date(raw.dt * 1000),
  timezoneOffsetSeconds: raw.timezone,
});

const toForecastEntry = (
  raw: z.infer<typeof forecastEntrySchema>,
): ForecastEntry => ({
  at: new Date(raw.dt * 1000),
  temperatureK: raw.main.temp,
  minTemperatureK: raw.main.temp_min,
  maxTemperatureK: raw.main.temp_max,
  humidity: raw.main.humidity,
  windSpeedMs: raw.wind.speed,
  condition: firstCondition(raw.weather),
});

const toForecast = (raw: z.infer<typeof forecastResponseSchema>): Forecast => ({
  cityId: raw.city.id,
  cityName: raw.city.name,
  country: raw.city.country,
  timezoneOffsetSeconds: raw.city.timezone,
  entries: raw.list.map(toForecastEntry),
});

const buildUrl = (path: string, params: Record<string, string>): string => {
  const url = new URL(`${env.openWeatherApiUrl}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set('appid', env.openWeatherApiKey);
  return url.toString();
};

const parseError = async (response: Response): Promise<string> => {
  try {
    const raw = (await response.json()) as unknown;
    const parsed = errorResponseSchema.safeParse(raw);
    if (parsed.success && parsed.data.message) {
      return parsed.data.message;
    }
  } catch {
    // fall through to generic message
  }
  return response.statusText || 'Unknown error';
};

const request = async <T>(
  url: string,
  schema: z.ZodType<T>,
  signal: AbortSignal | undefined,
): Promise<T> => {
  const init: RequestInit = signal ? { signal } : {};
  const response = await fetch(url, init);

  if (!response.ok) {
    const message = await parseError(response);
    throw new WeatherApiError(message, response.status);
  }

  const json = (await response.json()) as unknown;
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new WeatherApiError(
      `Unexpected response shape: ${parsed.error.issues[0]?.message ?? 'validation failed'}`,
      500,
    );
  }
  return parsed.data;
};

export const weatherProvider = {
  async getCurrentWeather(
    cityId: number,
    signal?: AbortSignal,
  ): Promise<CurrentWeather> {
    const url = buildUrl('/weather', { id: String(cityId) });
    const raw = await request(url, currentWeatherResponseSchema, signal);
    return toCurrentWeather(raw);
  },

  async getForecast(cityId: number, signal?: AbortSignal): Promise<Forecast> {
    const url = buildUrl('/forecast', { id: String(cityId) });
    const raw = await request(url, forecastResponseSchema, signal);
    return toForecast(raw);
  },
};

export type WeatherProvider = typeof weatherProvider;
