import { useQuery } from '@tanstack/react-query';

import { weatherProvider } from '@/features/weather/api/weather.provider';

export const forecastQueryKey = (cityId: number) =>
  ['weather', 'forecast', cityId] as const;

export const useForecast = (cityId: number | null, enabled: boolean) =>
  useQuery({
    queryKey: cityId === null ? ['weather', 'forecast', 'idle'] : forecastQueryKey(cityId),
    queryFn: ({ signal }) => {
      if (cityId === null) {
        throw new Error('City id is required');
      }
      return weatherProvider.getForecast(cityId, signal);
    },
    enabled: enabled && cityId !== null,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
