import { TextField, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type IProps = TextFieldProps & {
  name: string;
};

export const ControlledTextField: React.FC<IProps> = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <TextField
          {...props}
          {...field}
          variant="filled"
          error={!!errors[name]}
          helperText={errors[name] ? <>{errors[name]?.message}</> : ''}
        />
      )}
    />
  );
};
