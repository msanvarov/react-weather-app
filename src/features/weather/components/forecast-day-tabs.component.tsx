import { motion } from 'framer-motion';

import { cn } from '@/utils/cn.util';
import type { ForecastDay } from '@/features/weather/types/weather.types';
import { formatShortDay } from '@/features/weather/utils/forecast.util';

export type ForecastDayTabsProps = {
  days: readonly ForecastDay[];
  activeDayKey: string | null;
  onSelect: (dayKey: string) => void;
};

export const ForecastDayTabs = ({
  days,
  activeDayKey,
  onSelect,
}: ForecastDayTabsProps) => (
  <div
    role="tablist"
    aria-label="Forecast day"
    className="flex flex-wrap gap-2"
  >
    {days.map((day) => {
      const isActive = day.dayKey === activeDayKey;
      return (
        <button
          key={day.dayKey}
          role="tab"
          aria-selected={isActive}
          onClick={() => onSelect(day.dayKey)}
          className={cn(
            'relative inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold ' +
              'uppercase tracking-[0.14em] transition-colors duration-200',
            isActive
              ? 'text-surface'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          {isActive && (
            <motion.span
              layoutId="active-day-pill"
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              className="absolute inset-0 rounded-full bg-ink"
            />
          )}
          <span className="relative">{formatShortDay(day.date)}</span>
        </button>
      );
    })}
  </div>
);
