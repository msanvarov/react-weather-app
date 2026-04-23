import { motion } from 'framer-motion';

import type { ForecastEntry } from '@/features/weather/types/weather.types';
import {
  formatEntryDateTime,
} from '@/features/weather/utils/forecast.util';
import {
  formatCelsius,
  formatCelsiusPrecise,
  formatWind,
} from '@/features/weather/utils/units.util';

export type ForecastTableProps = {
  entries: readonly ForecastEntry[];
  timezoneOffsetSeconds: number;
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.03, duration: 0.25 },
  }),
};

const headers = ['Date', 'Temp', 'Min Temp', 'Max Temp', 'Wind', 'Description'];

export const ForecastTable = ({
  entries,
  timezoneOffsetSeconds,
}: ForecastTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border-separate border-spacing-0 text-sm">
      <thead>
        <tr className="text-left text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
          {headers.map((header) => (
            <th
              key={header}
              scope="col"
              className="border-b border-surface-border px-4 py-3 font-medium"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <motion.tr
            key={entry.at.toISOString()}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={rowVariants}
            className="text-ink-muted"
          >
            <td className="border-b border-surface-border/60 px-4 py-3 text-ink">
              {formatEntryDateTime(entry.at, timezoneOffsetSeconds)}
            </td>
            <td className="border-b border-surface-border/60 px-4 py-3">
              {formatCelsius(entry.temperatureK)}
            </td>
            <td className="border-b border-surface-border/60 px-4 py-3">
              {formatCelsiusPrecise(entry.minTemperatureK)}
            </td>
            <td className="border-b border-surface-border/60 px-4 py-3">
              {formatCelsiusPrecise(entry.maxTemperatureK)}
            </td>
            <td className="border-b border-surface-border/60 px-4 py-3">
              {formatWind(entry.windSpeedMs)}
            </td>
            <td className="border-b border-surface-border/60 px-4 py-3 text-right text-ink">
              {entry.condition.description}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);
