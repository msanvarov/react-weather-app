# Weather App

A small, elegant weather forecast SPA built with **Vite**, **React**, **TypeScript**, **TanStack Query**, **Tailwind CSS**, and **Framer Motion**. Data is fetched from the public OpenWeatherMap API.

## Getting started

```bash
npm install
cp .env.example .env.local
# add your OpenWeatherMap API key to .env.local
npm run dev
```

## Scripts

| Command              | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start Vite dev server on port 5173.       |
| `npm run build`      | Type-check and produce a production build.|
| `npm run preview`    | Preview the production build locally.     |
| `npm run typecheck`  | Run the TypeScript compiler in no-emit.   |

## Project structure

Inspired by [bulletproof-react](https://github.com/alan2207/bulletproof-react/tree/master/apps/react-vite). Files follow a consistent suffix convention:

| Suffix          | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `*.component.tsx` | React components                                 |
| `*.util.ts`       | Pure utilities (unit conversion, formatting…)    |
| `*.provider.ts`   | Data or service providers (API clients, clients) |
| `*.hook.ts`       | Custom React hooks                               |
| `*.types.ts`      | Shared type declarations                         |
| `*.config.ts`     | Compile-time configuration                       |

```
src/
├── app/                           # Root composition
│   ├── app.component.tsx
│   └── app-providers.component.tsx
├── components/ui/                 # Reusable primitives
│   ├── button/button.component.tsx
│   ├── card/card.component.tsx
│   ├── select/select.component.tsx
│   ├── spinner/spinner.component.tsx
│   └── status-message/status-message.component.tsx
├── config/
│   ├── cities.config.ts           # Required city list
│   └── env.config.ts              # Zod-validated env vars
├── features/weather/              # Weather feature slice
│   ├── api/weather.provider.ts    # Validated API client
│   ├── components/…               # Feature UI
│   ├── hooks/…                    # Query hooks
│   ├── types/weather.types.ts     # Domain models
│   └── utils/…                    # Pure helpers
├── lib/
│   └── query-client.provider.ts   # TanStack Query client
├── styles/global.css
├── utils/cn.util.ts
└── main.tsx
```

## Design notes

- **Type-safe API layer** – `weather.provider.ts` validates every response with Zod and maps the payload into a narrow domain model (`CurrentWeather`, `Forecast`). UI code never touches raw API shapes.
- **Env validation** – `env.config.ts` fails fast at startup if required vars are missing.
- **City-local time** – OpenWeatherMap returns UTC epoch seconds and a per-city offset. The forecast grouping helper shifts timestamps to the city's local clock so the UI reads naturally.
- **Resilient UX** – loading, error, and empty states are explicit. Aborting a request (e.g. changing cities) is wired through `AbortSignal`.
- **Accessibility** – the custom select supports keyboard navigation, `aria-*` attributes, and focus states. The forecast panel is marked `aria-live`.
- **Motion** – Framer Motion is used tastefully: header entrance, card layout transitions, day-tab pill, and table row stagger. Animations are short and ease-out.

## Environment variables

| Variable                     | Required | Description                                        |
| ---------------------------- | -------- | -------------------------------------------------- |
| `VITE_OPENWEATHER_API_KEY`   | yes      | OpenWeatherMap API key.                            |
| `VITE_OPENWEATHER_API_URL`   | no       | Override base URL (defaults to `…/data/2.5`).      |
