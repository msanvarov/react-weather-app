import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CityLocation } from "@/features/weather/types/city.types";
import { WeatherApiError, weatherProvider } from "./weather.provider";

const toronto: CityLocation = {
  name: "Toronto",
  country: "CA",
  lat: 43.65,
  lon: -79.38,
};

const mockResponse = (body: unknown, init: Partial<ResponseInit> = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });

const currentWeatherBody = {
  name: "Toronto",
  dt: 1_744_000_000,
  timezone: -14_400,
  sys: { country: "CA" },
  main: { temp: 296.15, feels_like: 294.1, humidity: 60 },
  wind: { speed: 4.2 },
  weather: [
    { id: 803, main: "Clouds", description: "broken clouds", icon: "04d" },
  ],
};

const forecastBody = {
  city: { name: "Toronto", country: "CA", timezone: -14_400 },
  list: [
    {
      dt: 1_744_000_000,
      main: { temp: 290, temp_min: 289, temp_max: 291, humidity: 60 },
      wind: { speed: 3 },
      weather: [
        { id: 500, main: "Rain", description: "light rain", icon: "10d" },
      ],
    },
  ],
};

describe("weatherProvider", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getCurrentWeather", () => {
    it("calls the weather endpoint with lat, lon, and api key", async () => {
      fetchSpy.mockResolvedValue(mockResponse(currentWeatherBody));

      await weatherProvider.getCurrentWeather(toronto);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const requestUrl = String(fetchSpy.mock.calls[0]![0]);
      const url = new URL(requestUrl);

      expect(url.origin + url.pathname).toBe(
        "https://api.openweathermap.org/data/2.5/weather",
      );
      expect(url.searchParams.get("lat")).toBe("43.65");
      expect(url.searchParams.get("lon")).toBe("-79.38");
      expect(url.searchParams.get("appid")).toBe("test-api-key");
    });

    it("maps the response into the domain model", async () => {
      fetchSpy.mockResolvedValue(mockResponse(currentWeatherBody));

      const result = await weatherProvider.getCurrentWeather(toronto);

      expect(result).toMatchObject({
        cityName: "Toronto",
        country: "CA",
        temperatureK: 296.15,
        feelsLikeK: 294.1,
        humidity: 60,
        windSpeedMs: 4.2,
        condition: {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d",
        },
        timezoneOffsetSeconds: -14_400,
      });
      expect(result.observedAt.getTime()).toBe(1_744_000_000 * 1000);
    });

    it("throws WeatherApiError with the API message on non-2xx", async () => {
      fetchSpy.mockImplementation(() =>
        Promise.resolve(
          mockResponse(
            { cod: 401, message: "Invalid API key" },
            { status: 401 },
          ),
        ),
      );

      const err = await weatherProvider
        .getCurrentWeather(toronto)
        .catch((e: unknown) => e);

      expect(err).toBeInstanceOf(WeatherApiError);
      expect(err).toMatchObject({ status: 401, message: "Invalid API key" });
    });

    it("throws when the payload shape is invalid", async () => {
      fetchSpy.mockResolvedValue(mockResponse({ not: "valid" }));

      await expect(
        weatherProvider.getCurrentWeather(toronto),
      ).rejects.toBeInstanceOf(WeatherApiError);
    });

    it("forwards the AbortSignal to fetch", async () => {
      fetchSpy.mockResolvedValue(mockResponse(currentWeatherBody));
      const controller = new AbortController();
      await weatherProvider.getCurrentWeather(toronto, controller.signal);

      const init = fetchSpy.mock.calls[0]![1] as RequestInit | undefined;
      expect(init?.signal).toBe(controller.signal);
    });
  });

  describe("getForecast", () => {
    it("calls the forecast endpoint and maps entries", async () => {
      fetchSpy.mockResolvedValue(mockResponse(forecastBody));

      const forecast = await weatherProvider.getForecast(toronto);
      const requestUrl = String(fetchSpy.mock.calls[0]![0]);
      const url = new URL(requestUrl);

      expect(url.pathname.endsWith("/forecast")).toBe(true);
      expect(forecast.cityName).toBe("Toronto");
      expect(forecast.entries).toHaveLength(1);
      expect(forecast.entries[0]!.condition.description).toBe("light rain");
    });
  });
});
