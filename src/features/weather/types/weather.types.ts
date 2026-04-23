export type WeatherCondition = {
  readonly id: number;
  readonly main: string;
  readonly description: string;
  readonly icon: string;
};

export type CurrentWeather = {
  readonly cityId: number;
  readonly cityName: string;
  readonly country: string;
  readonly temperatureK: number;
  readonly feelsLikeK: number;
  readonly humidity: number;
  readonly windSpeedMs: number;
  readonly condition: WeatherCondition;
  readonly observedAt: Date;
  readonly timezoneOffsetSeconds: number;
};

export type ForecastEntry = {
  readonly at: Date;
  readonly temperatureK: number;
  readonly minTemperatureK: number;
  readonly maxTemperatureK: number;
  readonly humidity: number;
  readonly windSpeedMs: number;
  readonly condition: WeatherCondition;
};

export type Forecast = {
  readonly cityId: number;
  readonly cityName: string;
  readonly country: string;
  readonly timezoneOffsetSeconds: number;
  readonly entries: readonly ForecastEntry[];
};

export type ForecastDay = {
  readonly dayKey: string;
  readonly date: Date;
  readonly entries: readonly ForecastEntry[];
};
