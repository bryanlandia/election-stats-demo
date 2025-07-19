import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'contained' | 'outlined' | 'text';
}

export default function Button({
  children,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const muiVariant = variant === 'primary' ? 'contained' : 
                     variant === 'secondary' ? 'outlined' : 
                     variant as 'contained' | 'outlined' | 'text';

  return (
    <MuiButton 
      variant={muiVariant}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
