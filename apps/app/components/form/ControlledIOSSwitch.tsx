import { SwitchProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { IOSSwitch } from '../IOSSwitch';

export type ControlledIOSSwitchProps = SwitchProps & {
  name: string;
};

export function ControlledIOSSwitch({ name, ...props }: ControlledIOSSwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={false}
      render={({ field }) => <IOSSwitch checked={field.value} {...field} {...props} />}
    />
  );
}
