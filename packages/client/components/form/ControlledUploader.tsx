import { FormControl, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { Uploader, UploaderProps } from './Uploader/Uploader';

type ControlledUploaderProps = UploaderProps & {
  name: string;
};

export const ControlledUploader: React.FC<ControlledUploaderProps> = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl sx={{ width: '100%' }}>
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        render={({ field: { value, onChange } }) => <Uploader {...props} value={value} onChange={onChange} />}
      />

      {errors[name] && <FormHelperText error>Required</FormHelperText>}
    </FormControl>
  );
};
