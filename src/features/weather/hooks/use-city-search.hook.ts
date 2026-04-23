import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { geocodingProvider } from "@/features/weather/api/geocoding.provider";

export const MIN_QUERY_LENGTH = 2;

export const citySearchQueryKey = (query: string) =>
  ["geocoding", "search", query] as const;

export const useCitySearch = (query: string) => {
  const trimmed = query.trim();
  const enabled = trimmed.length >= MIN_QUERY_LENGTH;

  return useQuery({
    queryKey: citySearchQueryKey(trimmed.toLowerCase()),
    queryFn: ({ signal }) => geocodingProvider.searchCities(trimmed, signal),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};
