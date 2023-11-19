import { TextField, TextFieldProps } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type ControlledTextFieldProps = TextFieldProps & {
  name: string;
};

export function ControlledTextField({ name, ...props }: ControlledTextFieldProps) {
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
          {...field}
          {...props}
          error={!!errors[name]}
          helperText={errors[name] ? <>{errors[name]?.message}</> : ''}
        />
      )}
    />
  );
}
