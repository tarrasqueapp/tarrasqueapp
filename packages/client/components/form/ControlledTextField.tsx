import { TextField, TextFieldProps } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type ControlledTextFieldProps = TextFieldProps & {
  name: string;
};

export const ControlledTextField: React.FC<ControlledTextFieldProps> = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.autoFocus) {
      inputRef.current?.focus();
    }
  }, [props.autoFocus, inputRef]);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <TextField
          inputRef={inputRef}
          {...props}
          {...field}
          error={!!errors[name]}
          helperText={errors[name] ? <>{errors[name]?.message}</> : ''}
        />
      )}
    />
  );
};
