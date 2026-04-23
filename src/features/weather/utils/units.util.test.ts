import { describe, expect, it } from "vitest";

import {
  formatCelsius,
  formatCelsiusPrecise,
  formatHumidity,
  formatWind,
  kelvinToCelsius,
} from "./units.util";

describe("units.util", () => {
  describe("kelvinToCelsius", () => {
    it("converts freezing point", () => {
      expect(kelvinToCelsius(273.15)).toBeCloseTo(0, 5);
    });

    it("converts body temperature", () => {
      expect(kelvinToCelsius(310.15)).toBeCloseTo(37, 5);
    });

    it("handles sub-zero values", () => {
      expect(kelvinToCelsius(250)).toBeCloseTo(-23.15, 5);
    });
  });

  describe("formatCelsius", () => {
    it("formats to integer by default", () => {
      expect(formatCelsius(296.15)).toBe("23 °C");
    });

    it("rounds half-up via toFixed semantics", () => {
      // 296.65 K -> 23.5 °C -> toFixed(0) -> '24'
      expect(formatCelsius(296.65)).toBe("24 °C");
    });

    it("respects custom fraction digits", () => {
      expect(formatCelsius(297.2, 2)).toBe("24.05 °C");
    });
  });

  describe("formatCelsiusPrecise", () => {
    it("always uses two decimal places", () => {
      expect(formatCelsiusPrecise(297.2)).toBe("24.05 °C");
      expect(formatCelsiusPrecise(273.15)).toBe("0.00 °C");
    });
  });

  describe("formatWind", () => {
    it("rounds to integer m/sec", () => {
      expect(formatWind(3.9)).toBe("4 m/sec");
      expect(formatWind(0)).toBe("0 m/sec");
    });
  });

  describe("formatHumidity", () => {
    it("appends percent", () => {
      expect(formatHumidity(82)).toBe("82%");
    });
  });
});
