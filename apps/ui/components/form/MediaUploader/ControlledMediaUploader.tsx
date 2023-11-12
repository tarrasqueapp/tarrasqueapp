import { FormControl } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { MediaUploader, MediaUploaderProps } from './MediaUploader';

type ControlledMediaUploaderProps = MediaUploaderProps & {
  name: string;
};

export function ControlledMediaUploader({ name, ...props }: ControlledMediaUploaderProps) {
  const { control } = useFormContext();

  return (
    <FormControl sx={{ width: '100%' }}>
      <Controller
        control={control}
        name={name}
        defaultValue={null}
        render={({ field: { value, onChange } }) => <MediaUploader {...props} files={value} onChange={onChange} />}
      />
    </FormControl>
  );
}
