import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { Spinner } from "@/components/ui/spinner/spinner.component";
import { StatusMessage } from "@/components/ui/status-message/status-message.component";
import { useForecast } from "@/features/weather/hooks/use-forecast.hook";
import { groupForecastByDay } from "@/features/weather/utils/forecast.util";
import { ForecastDayTabs } from "@/features/weather/components/forecast-day-tabs.component";
import { ForecastTable } from "@/features/weather/components/forecast-table.component";
import type { CityLocation } from "@/features/weather/types/city.types";

export type ForecastPanelProps = {
  city: CityLocation;
};

export const ForecastPanel = ({ city }: ForecastPanelProps) => {
  const { data, isPending, isError, error } = useForecast(city, true);
  const [activeDayKey, setActiveDayKey] = useState<string | null>(null);

  const days = useMemo(() => (data ? groupForecastByDay(data) : []), [data]);

  useEffect(() => {
    if (days.length === 0) {
      setActiveDayKey(null);
      return;
    }
    const stillExists = activeDayKey
      ? days.some((day) => day.dayKey === activeDayKey)
      : false;
    if (!stillExists) {
      setActiveDayKey(days[0]?.dayKey ?? null);
    }
  }, [days, activeDayKey]);

  const activeDay = useMemo(
    () => days.find((day) => day.dayKey === activeDayKey) ?? null,
    [days, activeDayKey],
  );

  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      className="overflow-hidden"
      aria-live="polite"
    >
      <div className="mt-8 border-t border-surface-border pt-8">
        {isPending && (
          <div className="flex justify-center py-10">
            <Spinner label="Loading forecast" />
          </div>
        )}

        {isError && (
          <StatusMessage
            tone="error"
            title="Couldn't load the forecast"
            description={
              error instanceof Error ? error.message : "Please try again."
            }
          />
        )}

        {data && days.length > 0 && activeDay && (
          <div className="space-y-6">
            <ForecastDayTabs
              days={days}
              activeDayKey={activeDay.dayKey}
              onSelect={setActiveDayKey}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay.dayKey}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <ForecastTable
                  entries={activeDay.entries}
                  timezoneOffsetSeconds={data.timezoneOffsetSeconds}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  );
};
