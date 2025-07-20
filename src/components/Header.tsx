'use client';

import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
}

export default function Header({
  title = 'State of New Crampshire Election Stats',
}: HeaderProps) {
  return (
    <Box sx={{ position: 'relative' }}>
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
                ml: 8, // Add left margin to make room for the seal
              }}
            >
              {title}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      {/* New Crampshire Seal - overlaid on top left */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 4, sm: 8, md: 10 },
          left: { xs: 8, sm: 12, md: 16 },
          zIndex: 1300,
          width: { xs: 64, sm: 96, md: 128, lg: 164 },
          height: { xs: 64, sm: 96, md: 128, lg: 164 },
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #DAA520',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          backgroundColor: 'white',
        }}
      >
        <Image
          src="/img/seal_of_new_crampshire.jpg"
          alt="Seal of New Crampshire"
          width={164}
          height={164}
          priority
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </Box>
  );
}
