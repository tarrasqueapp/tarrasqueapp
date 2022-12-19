import { FormControl, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { Uploader, UploaderProps } from './Uploader';

type IProps = UploaderProps & {
  name: string;
};

export const ControlledUploader: React.FC<IProps> = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();

  /**
   * Set error when uploading and clear error when not uploading to disable submitting
   * @param uploading - Whether the uploader is uploading
   */
  function handleUploading(uploading: boolean) {
    if (uploading) {
      setError(name, { type: 'required' });
    } else {
      clearErrors(name);
    }
  }

  return (
    <FormControl sx={{ width: '100%' }}>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field: { value, onChange } }) => (
          <Uploader {...props} value={value} onChange={onChange} onUploading={handleUploading} />
        )}
      />
      {errors[name] && <FormHelperText error>Required</FormHelperText>}
    </FormControl>
  );
};
