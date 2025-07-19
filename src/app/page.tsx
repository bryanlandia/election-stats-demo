import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Box 
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon 
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography
} from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          textAlign: "center",
          mb: 6
        }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Election Stats
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            maxWidth: 600,
            mx: 'auto'
          }}>
          Comprehensive election statistics and data visualization platform. 
          Track voting trends, analyze demographics, and explore democratic participation.
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2
                }}>
                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Live Results
                </Typography>
              </Box>
              <Typography sx={{
                color: "text.secondary"
              }}>
                Real-time election results and vote counting updates.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                href="/results" 
                variant="contained" 
                fullWidth
              >
                View Results
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
