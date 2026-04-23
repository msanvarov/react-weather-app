import { z } from 'zod';

const envSchema = z.object({
  VITE_OPENWEATHER_API_KEY: z.string().min(1, 'VITE_OPENWEATHER_API_KEY is required'),
  VITE_OPENWEATHER_API_URL: z
    .string()
    .url()
    .default('https://api.openweathermap.org/data/2.5'),
});

const parsed = envSchema.safeParse({
  VITE_OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  VITE_OPENWEATHER_API_URL: import.meta.env.VITE_OPENWEATHER_API_URL,
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(
    `Invalid environment variables. Check your .env.local file:\n${details}`,
  );
}

export const env = {
  openWeatherApiKey: parsed.data.VITE_OPENWEATHER_API_KEY,
  openWeatherApiUrl: parsed.data.VITE_OPENWEATHER_API_URL,
} as const;
