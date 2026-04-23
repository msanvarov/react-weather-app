import { motion } from "framer-motion";

import { WeatherDashboard } from "@/features/weather/components/weather-dashboard.component";

export const App = () => (
  <div className="relative min-h-screen overflow-hidden bg-surface text-ink">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[540px] bg-grid-fade"
    />

    <main className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 pt-16 pb-24 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="mb-12"
      >
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-faint">
          OpenWeather
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight text-ink sm:text-6xl">
          Weather forecast
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
          Select a city to view the current conditions. Expand the forecast for
          a five-day outlook in three-hour increments.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
        className="flex-1"
      >
        <WeatherDashboard />
      </motion.div>

      <footer className="mt-16 flex flex-col gap-2 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <span>
          Built by{" "}
          <a
            href="https://sal-anvarov.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Sal Anvarov
          </a>
        </span>
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ink"
        >
          Powered by OpenWeatherMap
        </a>
      </footer>
    </main>
  </div>
);
