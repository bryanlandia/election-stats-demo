'use client';

import {
  AppBar,
  Container,
  Toolbar,
  Typography
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

        </Toolbar>
      </Container>
    </AppBar>
  );
}
