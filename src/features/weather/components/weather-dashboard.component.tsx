import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Button } from '@/components/ui/button/button.component';
import { Card } from '@/components/ui/card/card.component';
import { Spinner } from '@/components/ui/spinner/spinner.component';
import { StatusMessage } from '@/components/ui/status-message/status-message.component';
import { CitySelector } from '@/features/weather/components/city-selector.component';
import { CurrentWeatherCard } from '@/features/weather/components/current-weather.component';
import { ForecastPanel } from '@/features/weather/components/forecast-panel.component';
import { useCurrentWeather } from '@/features/weather/hooks/use-current-weather.hook';

export const WeatherDashboard = () => {
  const [cityId, setCityId] = useState<number | null>(null);
  const [showForecast, setShowForecast] = useState(false);

  const currentWeather = useCurrentWeather(cityId);

  const onCityChange = (next: number) => {
    setCityId(next);
    setShowForecast(false);
  };

  return (
    <Card className="p-8 sm:p-10" layout>
      <motion.div layout className="space-y-8">
        <CitySelector value={cityId} onChange={onCityChange} />

        {cityId === null && (
          <p className="text-sm text-ink-faint">
            Please select city to see the forecast.
          </p>
        )}

        {cityId !== null && currentWeather.isPending && (
          <div className="py-6">
            <Spinner label="Loading current weather" />
          </div>
        )}

        {cityId !== null && currentWeather.isError && (
          <StatusMessage
            tone="error"
            title="Couldn't load current weather"
            description={
              currentWeather.error instanceof Error
                ? currentWeather.error.message
                : 'Please try again.'
            }
          />
        )}

        {currentWeather.data && (
          <>
            <CurrentWeatherCard data={currentWeather.data} />

            <div>
              <Button
                variant={showForecast ? 'outline' : 'primary'}
                onClick={() => setShowForecast((value) => !value)}
                aria-expanded={showForecast}
                aria-controls="forecast-panel"
              >
                {showForecast ? 'Close' : 'See forecast'}
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {showForecast && (
                <div id="forecast-panel" key="forecast">
                  <ForecastPanel cityId={currentWeather.data.cityId} />
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </Card>
  );
};
