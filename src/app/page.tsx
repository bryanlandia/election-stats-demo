'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  BarChart as BarChartIcon,
  Event as EventIcon,
  Search as SearchIcon,
  HowToVote as VoteIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { Election, ApiResponse } from '@/types';

export default function HomePage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [ballotQuestions, setBallotQuestions] = useState<BallotQuestion[]>([]);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [yearRange, setYearRange] = useState<number[]>([2024, 2025]);
  const [selectedElection, setSelectedElection] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [electionsResponse, contestsResponse, ballotQuestionsResponse] =
          await Promise.all([
            fetch('/api/elections'),
            fetch('/api/elections/all/contests'),
            fetch('/api/elections/all/ballot-questions'),
          ]);

        const electionsData: ApiResponse<Election[]> =
          await electionsResponse.json();
        let contestsData: ApiResponse<Contest[]> = { success: true, data: [] };
        let ballotQuestionsData: ApiResponse<BallotQuestion[]> = {
          success: true,
          data: [],
        };

        // Handle contests response (might not exist for all elections)
        if (contestsResponse.ok) {
          contestsData = await contestsResponse.json();
        }

        // Handle ballot questions response (might not exist for all elections)
        if (ballotQuestionsResponse.ok) {
          ballotQuestionsData = await ballotQuestionsResponse.json();
        }

        if (electionsData.success) {
          setElections(electionsData.data);
          setFilteredElections(electionsData.data);
          setContests(contestsData.data || []);
          setBallotQuestions(ballotQuestionsData.data || []);

          // Set year range based on available elections
          const years = electionsData.data.map((e) =>
            new Date(e.date).getFullYear()
          );
          const minYear = Math.min(...years);
          const maxYear = Math.max(...years);
          setYearRange([minYear, maxYear]);
        } else {
          setError(electionsData.message || 'Failed to fetch elections');
        }
      } catch (err) {
        setError('Failed to fetch election data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter elections when tab or filters change
  useEffect(() => {
    let filtered = elections;

    if (selectedTab === 0) {
      // Year range filter
      filtered = elections.filter((election) => {
        const year = new Date(election.date).getFullYear();
        return year >= yearRange[0] && year <= yearRange[1];
      });
    } else if (selectedTab === 1) {
      // Election dates filter
      if (selectedElection !== 'all') {
        filtered = elections.filter(
          (election) => election.id === selectedElection
        );
      }
    }

    setFilteredElections(filtered);
  }, [selectedTab, yearRange, selectedElection, elections]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleYearRangeChange = (event: Event, newValue: number | number[]) => {
    setYearRange(newValue as number[]);
  };

  const handleElectionChange = (event: any) => {
    setSelectedElection(event.target.value);
  };

  const getContestCount = (electionId: string) => {
    const contestCount = contests.filter(
      (c) => c.electionId === electionId
    ).length;
    const ballotQuestionCount = ballotQuestions.filter(
      (bq) => bq.electionId === electionId
    ).length;
    return contestCount + ballotQuestionCount;
  };

  const formatElectionDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getFullYear()} ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const groupElectionsByYear = (elections: Election[]) => {
    return elections.reduce((groups: Record<string, Election[]>, election) => {
      const year = new Date(election.date).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(election);
      return groups;
    }, {});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'ongoing':
        return 'warning';
      case 'upcoming':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'ongoing':
        return '⏳';
      case 'upcoming':
        return '📅';
      default:
        return '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          Election Stats
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto'
          }}>
          Comprehensive election statistics and data visualization platform. 
          Real-time election results and vote tracking.
        </Typography>
      </Box>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <SearchIcon />
          Search By
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          centered
        >
          <Tab label="YEAR RANGE" />
          <Tab label="ELECTION DATES" />
        </Tabs>

        <Box sx={{ minHeight: 120 }}>
          {selectedTab === 0 && (
            <Box sx={{ px: 2 }}>
              <Typography variant="h6" gutterBottom>
                Year Range
              </Typography>
              <Box sx={{ px: 3, py: 2 }}>
                <Slider
                  value={yearRange}
                  onChange={handleYearRangeChange}
                  valueLabelDisplay="on"
                  min={Math.min(
                    ...elections.map((e) => new Date(e.date).getFullYear())
                  )}
                  max={Math.max(
                    ...elections.map((e) => new Date(e.date).getFullYear())
                  )}
                  step={1}
                  marks={Array.from(
                    new Set(
                      elections.map((e) => new Date(e.date).getFullYear())
                    )
                  )
                    .sort((a, b) => a - b)
                    .map((year) => ({ value: year, label: year.toString() }))}
                  sx={{ mt: 2 }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 2,
                }}
              ></Box>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box sx={{ px: 2 }}>
              <FormControl fullWidth>
                <InputLabel>All Elections</InputLabel>
                <Select
                  value={selectedElection}
                  onChange={handleElectionChange}
                  input={<OutlinedInput label="All Elections" />}
                >
                  <MenuItem value="all">All Elections</MenuItem>
                  {Object.entries(groupElectionsByYear(elections))
                    .map(([year, yearElections]) => [
                      <Divider key={`divider-${year}`}>
                        <Chip label={year} size="small" />
                      </Divider>,
                      ...yearElections.map((election) => (
                        <MenuItem key={election.id} value={election.id}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              {formatElectionDate(election.date)} -{' '}
                              {election.stage}
                            </Box>
                            <Chip
                              label={`${getContestCount(election.id)} contests`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </MenuItem>
                      )),
                    ])
                    .flat()}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
      </Paper>

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

      {/* Elections Grid */}
      {!loading && !error && (
        <>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Elections ({filteredElections.length})
          </Typography>

          <Grid container spacing={3}>
            {[...filteredElections]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((election) => (
                <Grid item xs={12} sm={6} md={4} key={election.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Chip
                          label={`${getStatusIcon(election.status)} ${election.status}`}
                          color={getStatusColor(election.status) as any}
                          size="small"
                        />
                      </Box>

                      <Typography variant="h6" component="h3" gutterBottom>
                        {election.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>Date:</strong>{' '}
                        {formatElectionDate(election.date)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>Stage:</strong> {election.stage}
                      </Typography>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mt: 2 }}
                      >
                        <VoteIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {getContestCount(election.id)} contests
                        </Typography>
                      </Box>
                    </CardContent>

                    <CardActions>
                      <Button
                        component={Link}
                        href={`/results?election=${election.id}`}
                        size="small"
                        startIcon={<BarChartIcon />}
                        fullWidth
                        variant="contained"
                      >
                        View Results
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>

          {filteredElections.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No elections found for the selected criteria.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
