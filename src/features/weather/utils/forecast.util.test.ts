import { describe, expect, it } from "vitest";

import type {
  Forecast,
  ForecastEntry,
  WeatherCondition,
} from "@/features/weather/types/weather.types";
import {
  formatEntryDateTime,
  formatShortDay,
  groupForecastByDay,
} from "./forecast.util";

const condition: WeatherCondition = {
  id: 800,
  main: "Clear",
  description: "clear sky",
  icon: "01d",
};

const entry = (isoUtc: string): ForecastEntry => ({
  at: new Date(isoUtc),
  temperatureK: 290,
  minTemperatureK: 289,
  maxTemperatureK: 291,
  humidity: 50,
  windSpeedMs: 3,
  condition,
});

const buildForecast = (
  timezoneOffsetSeconds: number,
  entries: readonly ForecastEntry[],
): Forecast => ({
  cityName: "Tokyo",
  country: "JP",
  timezoneOffsetSeconds,
  entries,
});

// Tokyo: UTC+9 → 32400 seconds offset
const TOKYO_OFFSET = 9 * 3600;

describe("groupForecastByDay", () => {
  it("buckets entries by the city-local day, not the UTC day", () => {
    // 2026-04-22 23:00 UTC is 2026-04-23 08:00 Tokyo → should bucket on Apr 23.
    // 2026-04-23 14:00 UTC is 2026-04-23 23:00 Tokyo → also Apr 23.
    // 2026-04-23 16:00 UTC is 2026-04-24 01:00 Tokyo → bucket on Apr 24.
    const forecast = buildForecast(TOKYO_OFFSET, [
      entry("2026-04-22T23:00:00Z"),
      entry("2026-04-23T14:00:00Z"),
      entry("2026-04-23T16:00:00Z"),
    ]);

    const days = groupForecastByDay(forecast);
    expect(days.map((d) => d.dayKey)).toEqual(["2026-04-23", "2026-04-24"]);
    expect(days[0]!.entries).toHaveLength(2);
    expect(days[1]!.entries).toHaveLength(1);
  });

  it("produces ascending day order", () => {
    const forecast = buildForecast(TOKYO_OFFSET, [
      entry("2026-04-25T03:00:00Z"),
      entry("2026-04-23T03:00:00Z"),
      entry("2026-04-24T03:00:00Z"),
    ]);
    const days = groupForecastByDay(forecast);
    expect(days.map((d) => d.dayKey)).toEqual([
      "2026-04-23",
      "2026-04-24",
      "2026-04-25",
    ]);
  });

  it("returns an empty array when there are no entries", () => {
    const forecast = buildForecast(TOKYO_OFFSET, []);
    expect(groupForecastByDay(forecast)).toEqual([]);
  });
});

describe("formatShortDay", () => {
  it("formats as DAY MON in upper case", () => {
    // Treat as UTC; shiftToCityClock is already applied.
    expect(formatShortDay(new Date("2026-04-15T00:00:00Z"))).toBe("APR 15");
  });
});

describe("formatEntryDateTime", () => {
  it("formats in the city-local clock", () => {
    // 2026-04-15 02:00 UTC + Tokyo offset = 2026-04-15 11:00 Tokyo.
    expect(
      formatEntryDateTime(new Date("2026-04-15T02:00:00Z"), TOKYO_OFFSET),
    ).toBe("Apr 15 11AM");
  });

  it("handles PM formatting", () => {
    // 2026-04-15 05:00 UTC + Tokyo offset = 2026-04-15 14:00 Tokyo → 2PM.
    expect(
      formatEntryDateTime(new Date("2026-04-15T05:00:00Z"), TOKYO_OFFSET),
    ).toBe("Apr 15 2PM");
  });
});
