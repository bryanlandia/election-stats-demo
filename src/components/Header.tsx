'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Election Stats' }: HeaderProps) {
  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              mr: 4,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 0,
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
            <Button
              component={Link}
              href="/"
              sx={{ color: 'white', display: 'block' }}
            >
              Home
            </Button>
            <Button
              component={Link}
              href="/results"
              sx={{ color: 'white', display: 'block' }}
            >
              Results
            </Button>
            <Button
              component={Link}
              href="/demographics"
              sx={{ color: 'white', display: 'block' }}
            >
              Demographics
            </Button>
            <Button
              component={Link}
              href="/trends"
              sx={{ color: 'white', display: 'block' }}
            >
              Trends
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
