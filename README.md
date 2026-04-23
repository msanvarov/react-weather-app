# Weather App

A small, elegant weather forecast SPA. Built by **Sal Anvarov** with **Vite**, **React**, **TypeScript**, **TanStack Query**, **Tailwind CSS**, **Framer Motion**, **Zod**, and **Vitest**. Weather data is loaded from OpenWeatherMap.

Users can search **any city** — not just a fixed list — using OpenWeatherMap's geocoding API, then view current conditions and a five-day three-hour forecast.

## Getting started

```bash
npm install
cp .env.example .env.local     # add your OpenWeatherMap API key
npm run dev                    # http://localhost:5173
```

## Scripts

| Command                  | Purpose                                            |
| ------------------------ | -------------------------------------------------- |
| `npm run dev`            | Vite dev server (port 5173).                       |
| `npm run build`          | Type-check and produce a production build.         |
| `npm run preview`        | Preview the production build locally.              |
| `npm run typecheck`      | `tsc --noEmit`.                                    |
| `npm test`               | Run the Vitest suite once.                         |
| `npm run test:watch`     | Vitest watch mode.                                 |
| `npm run test:coverage`  | Run tests with v8 coverage (text + HTML reports).  |

## Environment variables

| Variable                     | Required | Description                                                                       |
| ---------------------------- | -------- | --------------------------------------------------------------------------------- |
| `VITE_OPENWEATHER_API_KEY`   | yes      | OpenWeatherMap API key. Validated at startup; the app fails fast if missing.      |
| `VITE_OPENWEATHER_API_HOST`  | no       | Override host (default `https://api.openweathermap.org`). Paths are appended per endpoint. |

`.env.test` is checked in for CI with a dummy key so tests run without secrets.

## Project structure

File suffixes make every file self-describing at a glance:

| Suffix             | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `*.component.tsx`  | React components                                     |
| `*.util.ts`        | Pure utilities (unit conversion, formatting…)        |
| `*.provider.ts`    | Data / service providers (API clients, QueryClient)  |
| `*.hook.ts`        | Custom React hooks                                   |
| `*.types.ts`       | Shared type declarations                             |
| `*.config.ts`      | Compile-time configuration                           |
| `*.test.ts(x)`     | Vitest co-located test file                          |

```
src/
├── app/
│   ├── app.component.tsx
│   └── app-providers.component.tsx
├── components/ui/                     # Reusable primitives
│   ├── button/button.component.tsx
│   ├── card/card.component.tsx
│   ├── select/select.component.tsx
│   ├── spinner/spinner.component.tsx
│   └── status-message/status-message.component.tsx
├── config/
│   ├── cities.config.ts               # Suggested cities shown before search
│   └── env.config.ts                  # Zod-validated env
├── features/weather/
│   ├── api/
│   │   ├── geocoding.provider.ts      # /geo/1.0/direct
│   │   ├── geocoding.provider.test.ts
│   │   ├── weather.provider.ts        # /data/2.5/weather + /forecast
│   │   └── weather.provider.test.ts
│   ├── components/
│   │   ├── city-search.component.tsx  # Combobox (search any city)
│   │   ├── current-weather.component.tsx
│   │   ├── forecast-day-tabs.component.tsx
│   │   ├── forecast-panel.component.tsx
│   │   ├── forecast-table.component.tsx
│   │   └── weather-dashboard.component.tsx
│   ├── hooks/
│   │   ├── use-city-search.hook.ts
│   │   ├── use-current-weather.hook.ts
│   │   └── use-forecast.hook.ts
│   ├── types/
│   │   ├── city.types.ts              # + .test.ts
│   │   └── weather.types.ts
│   └── utils/
│       ├── forecast.util.ts           # + .test.ts (day grouping, formatting)
│       ├── text.util.ts               # + .test.ts
│       └── units.util.ts              # + .test.ts
├── hooks/
│   ├── use-debounced-value.hook.ts
│   └── use-debounced-value.hook.test.ts
├── lib/
│   └── query-client.provider.ts
├── styles/global.css
├── test/setup.ts
├── utils/cn.util.ts
└── main.tsx
```

## API usage

The OpenWeatherMap endpoints used — matching the spec:

| Endpoint                             | Purpose                   |
| ------------------------------------ | ------------------------- |
| `GET /data/2.5/weather?lat&lon`      | Current weather for a city |
| `GET /data/2.5/forecast?lat&lon`     | Five-day / three-hour forecast |
| `GET /geo/1.0/direct?q&limit`        | City search (geocoding)    |

The appid is read from `VITE_OPENWEATHER_API_KEY` and appended to every request. Requests use `lat`+`lon` so any city surfaced by the geocoder can be queried.

## Design notes

- **Type-safe API layer** — both providers validate every response with Zod and map into narrow domain models (`CurrentWeather`, `Forecast`, `CityLocation`). UI code never touches raw API shapes. A typed `WeatherApiError` surfaces HTTP status + API message.
- **Env validation** — `env.config.ts` fails fast at startup if a required var is missing, with a readable message.
- **City-local time** — OpenWeatherMap returns UTC epoch seconds plus a per-city `timezone` offset. The forecast grouping helper shifts timestamps to the city clock so the day tabs and timestamps read naturally regardless of the viewer's timezone.
- **Debounced async search** — the combobox debounces input by 250 ms and only queries when the term is ≥ 2 characters. TanStack Query caches results per normalised query.
- **Accessible combobox** — proper `role="combobox"`, `aria-controls`, `aria-expanded`, `aria-autocomplete`, `aria-activedescendant`, keyboard navigation (↑ ↓ Enter Esc), click-outside, and focus management.
- **Resilient UX** — loading / error / empty states are explicit. Requests are aborted on unmount or city change through `AbortSignal`.
- **Motion** — Framer Motion is used tastefully: header entrance, card layout transitions, day-tab shared-layout pill, staggered forecast rows. Short and ease-out; never blocking.

## Testing

Vitest + Testing Library run in `jsdom`. Tests cover:

- Unit conversions and formatters (`units.util`, `text.util`)
- Forecast day-grouping across timezone boundaries (`forecast.util`)
- City identity and label formatting (`city.types`)
- API providers with a mocked global `fetch`, including error paths, Zod rejections, AbortSignal forwarding, and dedupe behavior
- Debounce hook semantics with fake timers

```
 Test Files  7 passed (7)
 Tests       37 passed (37)
```

Run `npm test` anywhere — no API key required; tests use `.env.test`.
