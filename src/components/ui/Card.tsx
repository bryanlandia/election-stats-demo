import { Box, CardContent, Card as MuiCard, Typography } from '@mui/material';
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <MuiCard sx={{ height: '100%' }} className={className}>
      <CardContent>
        <Typography variant="h6" component="h4" gutterBottom>
          {title}
        </Typography>
        <Box>{children}</Box>
      </CardContent>
    </MuiCard>
  );
}
