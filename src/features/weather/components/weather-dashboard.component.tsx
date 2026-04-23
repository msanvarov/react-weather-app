import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button/button.component";
import { Card } from "@/components/ui/card/card.component";
import { Spinner } from "@/components/ui/spinner/spinner.component";
import { StatusMessage } from "@/components/ui/status-message/status-message.component";
import { CitySearch } from "@/features/weather/components/city-search.component";
import { CurrentWeatherCard } from "@/features/weather/components/current-weather.component";
import { ForecastPanel } from "@/features/weather/components/forecast-panel.component";
import { useCurrentWeather } from "@/features/weather/hooks/use-current-weather.hook";
import {
  cityKey,
  type CityLocation,
} from "@/features/weather/types/city.types";

export const WeatherDashboard = () => {
  const [city, setCity] = useState<CityLocation | null>(null);
  const [showForecast, setShowForecast] = useState(false);

  const currentWeather = useCurrentWeather(city);

  const onCityChange = (next: CityLocation) => {
    setCity(next);
    setShowForecast(false);
  };

  return (
    <Card className="p-8 sm:p-10" layout>
      <motion.div layout className="space-y-8">
        <CitySearch value={city} onChange={onCityChange} />

        {city === null && (
          <p className="text-sm text-ink-faint">
            Search for a city to see the current conditions and forecast.
          </p>
        )}

        {city !== null && currentWeather.isPending && (
          <div className="py-6">
            <Spinner label="Loading current weather" />
          </div>
        )}

        {city !== null && currentWeather.isError && (
          <StatusMessage
            tone="error"
            title="Couldn't load current weather"
            description={
              currentWeather.error instanceof Error
                ? currentWeather.error.message
                : "Please try again."
            }
          />
        )}

        {currentWeather.data && city && (
          <>
            <CurrentWeatherCard data={currentWeather.data} />

            <div>
              <Button
                variant={showForecast ? "outline" : "primary"}
                onClick={() => setShowForecast((value) => !value)}
                aria-expanded={showForecast}
                aria-controls="forecast-panel"
              >
                {showForecast ? "Close" : "See forecast"}
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {showForecast && (
                <div id="forecast-panel" key={cityKey(city)}>
                  <ForecastPanel city={city} />
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </Card>
  );
};
