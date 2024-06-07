import { FormControl } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { Uploader, UploaderProps } from './Uploader';

type ControlledMediaUploaderProps = UploaderProps & {
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
        render={({ field: { value, onChange } }) => (
          <Uploader
            {...props}
            file={value}
            onChange={onChange}
            allowedFileTypes={['image/*', 'video/*']}
            showAllowedFileTypes
          />
        )}
      />
    </FormControl>
  );
}
