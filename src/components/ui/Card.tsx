import React from 'react';
import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <MuiCard sx={{ height: '100%' }} className={className}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Box>
          {children}
        </Box>
      </CardContent>
    </MuiCard>
  );
}
