export type CityLocation = {
  readonly name: string;
  readonly country: string;
  readonly state?: string;
  readonly lat: number;
  readonly lon: number;
};

export const cityKey = (city: CityLocation): string =>
  `${city.lat.toFixed(4)},${city.lon.toFixed(4)}`;

export const cityLabel = (city: CityLocation): string =>
  city.state
    ? `${city.name}, ${city.state}, ${city.country}`
    : `${city.name}, ${city.country}`;
