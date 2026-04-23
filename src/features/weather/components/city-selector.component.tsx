import { useMemo } from 'react';

import { Select, type SelectOption } from '@/components/ui/select/select.component';
import { CITIES, type City } from '@/config/cities.config';

export type CitySelectorProps = {
  value: City['id'] | null;
  onChange: (cityId: City['id']) => void;
};

export const CitySelector = ({ value, onChange }: CitySelectorProps) => {
  const options = useMemo<SelectOption<number>[]>(
    () =>
      CITIES.map((city) => ({
        value: city.id,
        label: `${city.name}, ${city.country}`,
      })),
    [],
  );

  return (
    <Select<number>
      label="City"
      placeholder="Please select city to see the forecast"
      value={value}
      options={options}
      onChange={onChange}
    />
  );
};
