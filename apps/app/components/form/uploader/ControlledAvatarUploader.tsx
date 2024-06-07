import { FormControl } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { Uploader, UploaderProps } from './Uploader';

type ControlledAvatarUploaderProps = UploaderProps & {
  name: string;
};

export function ControlledAvatarUploader({ name, ...props }: ControlledAvatarUploaderProps) {
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
            allowedFileTypes={['image/*']}
            ButtonProps={{
              sx: {
                m: 0.2,
                overflow: 'hidden',
                borderRadius: '50%',
              },
            }}
            ContainerProps={{
              sx: {
                borderRadius: '50%',
                height: 200,
              },
            }}
          />
        )}
      />
    </FormControl>
  );
}
