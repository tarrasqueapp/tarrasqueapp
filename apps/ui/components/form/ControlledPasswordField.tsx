import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, Tooltip } from '@mui/material';
import React, { useState } from 'react';

import { ControlledTextField, ControlledTextFieldProps } from './ControlledTextField';

export const ControlledPasswordField: React.FC<ControlledTextFieldProps> = ({ name, ...props }) => {
  const [visible, setVisible] = useState(false);

  /**
   * Toggle visibility of password in plain-text
   * @param event
   */
  function handleToggleVisibility(event: React.MouseEvent) {
    event.preventDefault();
    setVisible(!visible);
  }

  return (
    <ControlledTextField
      name={name}
      type={visible ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={visible ? 'Hide' : 'Reveal'}>
              <IconButton onClick={handleToggleVisibility} edge="end">
                {visible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};
