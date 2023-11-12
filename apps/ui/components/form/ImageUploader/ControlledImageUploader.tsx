import { FormControl } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { ImageUploader, ImageUploaderProps } from './ImageUploader';

type ControlledImageUploaderProps = ImageUploaderProps & {
  name: string;
};

export function ControlledImageUploader({ name, ...props }: ControlledImageUploaderProps) {
  const { control } = useFormContext();

  return (
    <FormControl sx={{ width: '100%' }}>
      <Controller
        control={control}
        name={name}
        defaultValue={null}
        render={({ field: { value, onChange } }) => <ImageUploader {...props} file={value} onChange={onChange} />}
      />
    </FormControl>
  );
}
