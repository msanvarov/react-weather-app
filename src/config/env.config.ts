import { z } from "zod";

const envSchema = z.object({
  VITE_OPENWEATHER_API_KEY: z
    .string()
    .min(1, "VITE_OPENWEATHER_API_KEY is required"),
  VITE_OPENWEATHER_API_HOST: z
    .string()
    .url()
    .default("https://api.openweathermap.org"),
});

const parsed = envSchema.safeParse({
  VITE_OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  VITE_OPENWEATHER_API_HOST: import.meta.env.VITE_OPENWEATHER_API_HOST,
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `Invalid environment variables. Check your .env.local file:\n${details}`,
  );
}

const host = parsed.data.VITE_OPENWEATHER_API_HOST.replace(/\/$/, "");

export const env = {
  openWeatherApiKey: parsed.data.VITE_OPENWEATHER_API_KEY,
  openWeatherApiHost: host,
  openWeatherDataUrl: `${host}/data/2.5`,
  openWeatherGeoUrl: `${host}/geo/1.0`,
} as const;
