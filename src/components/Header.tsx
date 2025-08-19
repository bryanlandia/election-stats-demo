'use client';

import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
}

export default function Header({
  title = 'State of New Grampshire Election Stats',
}: HeaderProps) {
  const secretaryOfState = 'Gramps McGramps';

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: { xs: '100%', md: '50%' }, pr: { md: 2 } }}>
            <Toolbar
              disableGutters
              sx={{
                py: 1,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 2,
                pl: 0,
              }}
            >
              {/* New Grampshire Seal */}
              <Box
                sx={{
                  width: { xs: 48, sm: 56, md: 64 },
                  height: { xs: 48, sm: 56, md: 64 },
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #DAA520',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  backgroundColor: 'white',
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/img/seal_of_new_crampshire.jpg"
                  alt="Seal of New Grampshire"
                  width={64}
                  height={64}
                  priority
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>

              {/* Title */}
              <Typography
                variant="h6"
                component={Link}
                href="/"
                sx={{
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                  flexGrow: 1,
                  pl: 1,
                  alignSelf: 'flex-start',
                  mt: 0.5,
                }}
              >
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}
                >
                  <Box component="span">{title}</Box>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 400,
                      fontSize: '0.75rem',
                    }}
                  >
                    Secretary of State: {secretaryOfState}
                  </Typography>
                </Box>
              </Typography>
            </Toolbar>
          </Box>

          <Box sx={{ width: { xs: '0%', md: '75%' } }} />
        </Box>
      </Container>
    </AppBar>
  );
}
