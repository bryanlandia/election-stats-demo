'use client';

import { ApiResponse, Election } from '@/types';
import {
  BarChart as BarChartIcon,
  Event as EventIcon,
  HowToVote as VoteIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('/api/elections');
        const data: ApiResponse<Election[]> = await response.json();
        if (data.success) {
          setElections(data.data);
        } else {
          setError(data.message || 'Failed to fetch elections');
        }
      } catch (err) {
        setError('Failed to fetch elections');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'ongoing': return 'warning';
      case 'upcoming': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'ongoing': return '⏳';
      case 'upcoming': return '📅';
      default: return '';
    }
  };

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

      {/* Quick Access Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Quick Access
        </Typography>
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
                  <Typography variant="h5" component="h3">
                    All Results
                  </Typography>
                </Box>
                <Typography sx={{
                  color: "text.secondary"
                }}>
                  View all election results with interactive selection.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={Link} 
                  href="/results" 
                  variant="contained" 
                  fullWidth
                >
                  View All Results
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Elections Section */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Available Elections
        </Typography>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Grid container spacing={4}>
            {elections.map((election) => (
              <Grid item xs={12} md={6} lg={4} key={election.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 1 }}>
                        {election.name}
                      </Typography>
                      <Chip 
                        label={`${getStatusIcon(election.status)} ${election.status.charAt(0).toUpperCase() + election.status.slice(1)}`}
                        color={getStatusColor(election.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(election.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <VoteIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {election.stage}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    {election.status === 'completed' ? (
                      <Button 
                        component={Link} 
                        href={`/results?id=${election.id}`}
                        variant="contained" 
                        fullWidth
                        startIcon={<BarChartIcon />}
                      >
                        View Results
                      </Button>
                    ) : (
                      <Button 
                        variant="outlined" 
                        fullWidth
                        disabled
                      >
                        {election.status === 'ongoing' ? 'Results Pending' : 'Not Available Yet'}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !error && elections.length === 0 && (
          <Alert severity="info" sx={{ mt: 4 }}>
            No elections available at this time.
          </Alert>
        )}
      </Box>
    </Container>
  );
}
