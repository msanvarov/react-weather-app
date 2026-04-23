import { useQuery } from '@tanstack/react-query';

import { weatherProvider } from '@/features/weather/api/weather.provider';

export const currentWeatherQueryKey = (cityId: number) =>
  ['weather', 'current', cityId] as const;

export const useCurrentWeather = (cityId: number | null) =>
  useQuery({
    queryKey: cityId === null ? ['weather', 'current', 'idle'] : currentWeatherQueryKey(cityId),
    queryFn: ({ signal }) => {
      if (cityId === null) {
        throw new Error('City id is required');
      }
      return weatherProvider.getCurrentWeather(cityId, signal);
    },
    enabled: cityId !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
