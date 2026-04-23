const KELVIN_TO_CELSIUS_OFFSET = 273.15;

export const kelvinToCelsius = (kelvin: number): number =>
  kelvin - KELVIN_TO_CELSIUS_OFFSET;

export const formatCelsius = (
  kelvin: number,
  fractionDigits = 0,
): string => {
  const celsius = kelvinToCelsius(kelvin);
  return `${celsius.toFixed(fractionDigits)} °C`;
};

export const formatCelsiusPrecise = (kelvin: number): string =>
  formatCelsius(kelvin, 2);

export const formatWind = (metersPerSecond: number): string =>
  `${metersPerSecond.toFixed(0)} m/sec`;

export const formatHumidity = (percent: number): string => `${percent}%`;
