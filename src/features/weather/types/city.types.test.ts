import { describe, expect, it } from "vitest";

import { cityKey, cityLabel, type CityLocation } from "./city.types";

const toronto: CityLocation = {
  name: "Toronto",
  country: "CA",
  lat: 43.6534817,
  lon: -79.3839347,
};

describe("cityKey", () => {
  it("includes lat and lon at fixed precision", () => {
    expect(cityKey(toronto)).toBe("43.6535,-79.3839");
  });

  it("differs between two distinct cities", () => {
    const tokyo: CityLocation = {
      name: "Tokyo",
      country: "JP",
      lat: 35.6828387,
      lon: 139.7594549,
    };
    expect(cityKey(toronto)).not.toEqual(cityKey(tokyo));
  });
});

describe("cityLabel", () => {
  it("renders name and country when no state is present", () => {
    expect(cityLabel(toronto)).toBe("Toronto, CA");
  });

  it("includes state when present", () => {
    const nyc: CityLocation = {
      name: "New York",
      state: "NY",
      country: "US",
      lat: 40.71,
      lon: -74.01,
    };
    expect(cityLabel(nyc)).toBe("New York, NY, US");
  });
});
