import type {
  Forecast,
  ForecastDay,
  ForecastEntry,
} from '@/features/weather/types/weather.types';

/**
 * OpenWeatherMap timestamps are UTC epoch seconds. To show the "local" day and
 * time for the forecast's city, we shift the instant by the city's UTC offset
 * and read the resulting components as if they were UTC.
 */
const shiftToCityClock = (date: Date, timezoneOffsetSeconds: number): Date =>
  new Date(date.getTime() + timezoneOffsetSeconds * 1000);

const toDayKey = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const groupForecastByDay = (forecast: Forecast): readonly ForecastDay[] => {
  const buckets = new Map<string, ForecastEntry[]>();

  for (const entry of forecast.entries) {
    const cityLocal = shiftToCityClock(entry.at, forecast.timezoneOffsetSeconds);
    const key = toDayKey(cityLocal);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.push(entry);
    } else {
      buckets.set(key, [entry]);
    }
  }

  return Array.from(buckets.entries())
    .map(([dayKey, entries]): ForecastDay => {
      const first = entries[0];
      if (!first) {
        throw new Error(`Empty forecast bucket for ${dayKey}`);
      }
      const cityLocal = shiftToCityClock(first.at, forecast.timezoneOffsetSeconds);
      return { dayKey, date: cityLocal, entries };
    })
    .sort((a, b) => a.dayKey.localeCompare(b.dayKey));
};

const SHORT_DAY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  hour12: true,
  timeZone: 'UTC',
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  hour12: true,
  timeZone: 'UTC',
});

export const formatShortDay = (cityLocalDate: Date): string =>
  SHORT_DAY_FORMATTER.format(cityLocalDate).toUpperCase();

export const formatEntryTime = (
  at: Date,
  timezoneOffsetSeconds: number,
): string => TIME_FORMATTER.format(shiftToCityClock(at, timezoneOffsetSeconds));

export const formatEntryDateTime = (
  at: Date,
  timezoneOffsetSeconds: number,
): string => {
  const cityLocal = shiftToCityClock(at, timezoneOffsetSeconds);
  const formatted = DATE_TIME_FORMATTER.format(cityLocal);
  // Intl outputs e.g. "15 Sep, 11 AM"; we want "15 Sep 11AM" to match the spec.
  return formatted.replace(', ', ' ').replace(' AM', 'AM').replace(' PM', 'PM');
};
