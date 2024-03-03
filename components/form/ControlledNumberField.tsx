import { TextField, TextFieldProps } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type ControlledNumberFieldProps = TextFieldProps & {
  name: string;
};

export function ControlledNumberField({ name, ...props }: ControlledNumberFieldProps) {
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
      defaultValue={0}
      render={({ field }) => (
        <TextField
          type="number"
          inputRef={inputRef}
          {...field}
          {...props}
          value={String(parseFloat(field.value))}
          error={!!errors[name]}
          helperText={errors[name] ? <>{errors[name]?.message}</> : ''}
          onChange={(event) => {
            // Call the original onChange event if it exists
            if (props.onChange) {
              props.onChange(event);
              return;
            }

            // Convert value to number before updating the form state
            const value = event.target.value ? parseFloat(event.target.value) : 0;
            field.onChange(value);
          }}
          inputProps={{
            ...props.inputProps,
            type: 'number',
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
        />
      )}
    />
  );
}
