export type City = {
  readonly id: number;
  readonly name: string;
  readonly country: string;
};

export const CITIES: readonly City[] = [
  { id: 6167865, name: 'Toronto', country: 'CA' },
  { id: 6094817, name: 'Ottawa', country: 'CA' },
  { id: 1850147, name: 'Tokyo', country: 'JP' },
] as const;
