import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WeatherApiError } from "./weather.provider";
import { geocodingProvider } from "./geocoding.provider";

const mockResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("geocodingProvider.searchCities", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns [] for empty queries without hitting the network", async () => {
    const result = await geocodingProvider.searchCities("   ");
    expect(result).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("calls /geo/1.0/direct with query, limit, and api key", async () => {
    fetchSpy.mockResolvedValue(mockResponse([]));

    await geocodingProvider.searchCities("Tokyo");
    const url = new URL(String(fetchSpy.mock.calls[0]![0]));

    expect(url.origin + url.pathname).toBe(
      "https://api.openweathermap.org/geo/1.0/direct",
    );
    expect(url.searchParams.get("q")).toBe("Tokyo");
    expect(url.searchParams.get("limit")).toBe("8");
    expect(url.searchParams.get("appid")).toBe("test-api-key");
  });

  it("maps results to CityLocation and omits undefined state", async () => {
    fetchSpy.mockResolvedValue(
      mockResponse([
        {
          name: "London",
          country: "GB",
          state: "England",
          lat: 51.5,
          lon: -0.12,
        },
        { name: "Tokyo", country: "JP", lat: 35.68, lon: 139.76 },
      ]),
    );

    const result = await geocodingProvider.searchCities("capital");
    expect(result).toEqual([
      {
        name: "London",
        country: "GB",
        state: "England",
        lat: 51.5,
        lon: -0.12,
      },
      { name: "Tokyo", country: "JP", lat: 35.68, lon: 139.76 },
    ]);
    expect(result[1]).not.toHaveProperty("state");
  });

  it("deduplicates entries with matching name/country/state/coord precision", async () => {
    fetchSpy.mockResolvedValue(
      mockResponse([
        { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
        { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
      ]),
    );

    const result = await geocodingProvider.searchCities("Paris");
    expect(result).toHaveLength(1);
  });

  it("throws WeatherApiError on failure", async () => {
    fetchSpy.mockResolvedValue(mockResponse({ message: "unauthorised" }, 401));

    await expect(
      geocodingProvider.searchCities("Tokyo"),
    ).rejects.toBeInstanceOf(WeatherApiError);
  });
});
