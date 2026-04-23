import { motion } from 'framer-motion';

import type { CurrentWeather } from '@/features/weather/types/weather.types';
import {
  formatCelsius,
  formatHumidity,
  formatWind,
} from '@/features/weather/utils/units.util';

export type CurrentWeatherProps = {
  data: CurrentWeather;
};

const capitalise = (value: string): string =>
  value.length === 0 ? value : value[0]!.toUpperCase() + value.slice(1);

const iconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

export const CurrentWeatherCard = ({ data }: CurrentWeatherProps) => {
  const key = `${data.cityName}-${data.country}`;

  return (
    <motion.section
      key={key}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center"
      aria-labelledby={`current-weather-${key}`}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
          {data.condition.main}
        </p>
        <h2
          id={`current-weather-${key}`}
          className="mt-1 text-lg text-ink-muted"
        >
          {capitalise(data.condition.description)}
        </h2>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="font-display text-[64px] leading-none tracking-tight text-ink sm:text-[80px]">
            {formatCelsius(data.temperatureK)}
          </span>
          <span className="text-sm text-ink-faint">
            Feels like {formatCelsius(data.feelsLikeK)}
          </span>
        </div>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-muted">
          <div className="flex items-baseline gap-2">
            <dt className="text-ink-faint">Wind</dt>
            <dd className="text-ink">{formatWind(data.windSpeedMs)}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-ink-faint">Humidity</dt>
            <dd className="text-ink">{formatHumidity(data.humidity)}</dd>
          </div>
        </dl>
      </div>

      <img
        src={iconUrl(data.condition.icon)}
        alt=""
        width={140}
        height={140}
        loading="lazy"
        className="drop-shadow-[0_20px_30px_rgba(134,183,255,0.18)]"
      />
    </motion.section>
  );
};
