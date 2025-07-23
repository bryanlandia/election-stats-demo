'use client';

// import { theme } from '@/lib/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

const newCrampshireTheme = createTheme({
  palette: {
    primary: {
      main: '#1A3A2B', // deep green from seal
      contrastText: '#F7E7B4', // lighter gold from seal
    },
    secondary: {
      main: '#B49A5A', // gold from seal
      contrastText: '#1A3A2B', // deep green
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A3A2B', // deep green
      secondary: '#B49A5A', // gold
    },
    action: {
      active: '#1A3A2B', // deep green
    },
  },
});

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={newCrampshireTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
