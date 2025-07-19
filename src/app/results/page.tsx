'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ElectionResult,
  Election,
  Contest,
  BallotQuestion,
  Party,
  Contestant,
  Ticket,
  ApiResponse,
} from '@/types';
import HorizontalBarChart from '@/components/HorizontalBarChart';

interface ElectionData {
  election: Election;
  results: ElectionResult;
  contests: Contest[];
  ballotQuestions: BallotQuestion[];
  parties: Record<string, Party>;
  contestants: Record<string, Contestant>;
  tickets: Record<string, Ticket>;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [electionId, setElectionId] = useState<string>(
    searchParams.get('id') || '1'
  );
  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available elections for the dropdown
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('/api/elections');
        const data: ApiResponse<Election[]> = await response.json();
        if (data.success) {
          setElections(data.data);
        }
      } catch (err) {
        console.error('Error fetching elections:', err);
      }
    };
    fetchElections();
  }, []);

  // Fetch election data when electionId changes
  useEffect(() => {
    const fetchElectionData = async () => {
      if (!electionId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch election results, contests, and ballot questions in parallel
        const [resultsRes, electionsRes, contestsRes, ballotQuestionsRes] =
          await Promise.all([
            fetch(`/api/elections/${electionId}/results`),
            fetch('/api/elections'),
            fetch(`/api/elections/${electionId}/contests`),
            fetch(`/api/elections/${electionId}/ballot-questions`),
          ]);

        const [resultsData, electionsData, contestsData, ballotQuestionsData] =
          await Promise.all([
            resultsRes.json(),
            electionsRes.json(),
            contestsRes.json(),
            ballotQuestionsRes.json(),
          ]);

        if (!resultsData.success) {
          throw new Error(
            resultsData.message || 'Failed to fetch election results'
          );
        }

        // Find the specific election
        const election = electionsData.data?.find(
          (e: Election) => e.id === electionId
        );
        if (!election) {
          throw new Error('Election not found');
        }

        // Create lookup objects for parties, contestants, and tickets from mock data
        // In a real app, these would come from separate API endpoints
        const parties: Record<string, Party> = {
          '1': { id: '1', name: 'Extremely Buttery', color: '#FFDB58' },
          '2': { id: '2', name: 'Vegan Imperium', color: '#CC8899' },
          '3': { id: '3', name: 'Zizians', color: '#000000' },
        };

        const contestants: Record<string, Contestant> = {
          '1': {
            id: '1',
            name: 'Martha Stewart',
            partyId: '1',
            position: 'God-Emperor',
          },
          '2': {
            id: '2',
            name: 'Emerill Lagasse',
            partyId: '1',
            position: 'Chief Sycophant',
          },
          '3': {
            id: '3',
            name: 'Joaquin Phoenix',
            partyId: '2',
            position: 'God-Emperor',
          },
          '4': {
            id: '4',
            name: 'Ariana Grande',
            partyId: '2',
            position: 'Chief Sycophant',
          },
          '5': {
            id: '5',
            name: 'Ziz LaSota',
            partyId: '3',
            position: 'God-Emperor',
          },
          '6': {
            id: '6',
            name: 'Emma Borhanian',
            partyId: '3',
            position: 'Chief Sycophant',
          },
          '7': { id: '7', name: 'Martha Stewart', partyId: '1' },
          '8': { id: '8', name: 'Emerill Lagasse', partyId: '1' },
          '9': { id: '9', name: 'Rachel Ray', partyId: '1' },
          '10': { id: '10', name: 'Anthony Bourdain', partyId: '1' },
          '11': { id: '11', name: 'Borkmeister Fuller' },
          '12': { id: '12', name: 'Mean Lady' },
          '13': { id: '13', name: 'Not-a-Poodle' },
        };

        const tickets: Record<string, Ticket> = {
          '1': {
            id: '1',
            partyId: '1',
            contestants: [contestants['1'], contestants['2']],
          },
          '2': {
            id: '2',
            partyId: '2',
            contestants: [contestants['3'], contestants['4']],
          },
          '3': {
            id: '3',
            partyId: '3',
            contestants: [contestants['5'], contestants['6']],
          },
        };

        setElectionData({
          election,
          results: resultsData.data,
          contests: contestsData.success ? contestsData.data : [],
          ballotQuestions: ballotQuestionsData.success
            ? ballotQuestionsData.data
            : [],
          parties,
          contestants,
          tickets,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [electionId]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getColorForResult = (index: number, party?: Party) => {
    if (party?.color) {
      return party.color;
    }
    // Default colors for non-partisan contests
    const defaultColors = [
      '#1976d2',
      '#d32f2f',
      '#388e3c',
      '#f57c00',
      '#7b1fa2',
    ];
    return defaultColors[index % defaultColors.length];
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 4, display: 'flex', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!electionData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No election data available</Alert>
      </Container>
    );
  }

  const {
    election,
    results,
    contests,
    ballotQuestions,
    parties,
    contestants,
    tickets,
  } = electionData;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Election Results
        </Typography>

        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel id="election-select-label">Select Election</InputLabel>
          <Select
            labelId="election-select-label"
            value={electionId}
            label="Select Election"
            onChange={(e) => setElectionId(e.target.value)}
          >
            {elections.map((election) => (
              <MenuItem key={election.id} value={election.id}>
                {election.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {election.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(election.date).toLocaleDateString()} •{' '}
                {election.stage}
              </Typography>

              {/* Contest Results */}
              {results.contestResults.map((contestResult, contestIndex) => {
                const contest = contests.find(
                  (c) => c.id === contestResult.contestId
                );
                if (!contest) return null;

                return (
                  <Box key={contestResult.contestId} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      {contest.name}
                    </Typography>

                    <HorizontalBarChart
                      contestResult={contestResult}
                      parties={parties}
                      contestants={contestants}
                      tickets={tickets}
                      getColorForResult={getColorForResult}
                      formatNumber={formatNumber}
                    />
                  </Box>
                );
              })}

              {/* Ballot Question Results */}
              {results.ballotQuestionResults?.map((ballotResult) => {
                const ballotQuestion = ballotQuestions.find(
                  (bq) => bq.id === ballotResult.ballotQuestionId
                );
                if (!ballotQuestion) return null;

                return (
                  <Box key={ballotResult.ballotQuestionId} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Ballot Question: {ballotQuestion.shortTitle}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Paper
                        sx={{
                          p: 2,
                          mb: 2,
                          backgroundColor: ballotResult.passed
                            ? '#4caf5015'
                            : '#f4433615',
                          border: ballotResult.passed
                            ? '1px solid #4caf5040'
                            : '1px solid #f4433640',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              color={
                                ballotResult.passed
                                  ? 'success.main'
                                  : 'error.main'
                              }
                            >
                              Yes {ballotResult.passed ? '✓' : ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatNumber(ballotResult.yesVotes)} votes
                            </Typography>
                          </Box>
                          <Typography
                            variant="h4"
                            color={
                              ballotResult.passed
                                ? 'success.main'
                                : 'text.primary'
                            }
                          >
                            {ballotResult.yesPercentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={ballotResult.yesPercentage}
                          sx={{
                            mt: 1,
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#4caf50',
                            },
                          }}
                        />
                      </Paper>

                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: !ballotResult.passed
                            ? '#f4433615'
                            : 'background.paper',
                          border: '1px solid #f4433640',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography variant="h6" color="error.main">
                              No {!ballotResult.passed ? '✓' : ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatNumber(ballotResult.noVotes)} votes
                            </Typography>
                          </Box>
                          <Typography
                            variant="h4"
                            color={
                              !ballotResult.passed
                                ? 'error.main'
                                : 'text.primary'
                            }
                          >
                            {ballotResult.noPercentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={ballotResult.noPercentage}
                          sx={{
                            mt: 1,
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#f44336',
                            },
                          }}
                        />
                      </Paper>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Result:{' '}
                      <strong>
                        {ballotResult.passed ? 'PASSED' : 'FAILED'}
                      </strong>
                    </Typography>
                  </Box>
                );
              })}

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total votes: {formatNumber(results.totalVotes)}
                </Typography>
                <Chip
                  label={`${results.reportingPercentage}% Reporting`}
                  color={
                    results.reportingPercentage === 100 ? 'success' : 'warning'
                  }
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Election Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Election Date"
                    secondary={new Date(election.date).toLocaleDateString()}
                    slotProps={{
                      secondary: { fontWeight: 'bold' },
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Election Stage"
                    secondary={election.stage}
                    slotProps={{
                      secondary: { fontWeight: 'bold' },
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={
                      election.status.charAt(0).toUpperCase() +
                      election.status.slice(1)
                    }
                    slotProps={{
                      secondary: { fontWeight: 'bold' },
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Total Votes"
                    secondary={formatNumber(results.totalVotes)}
                    slotProps={{
                      secondary: { fontWeight: 'bold' },
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Reporting"
                    secondary={`${results.reportingPercentage}%`}
                    slotProps={{
                      secondary: { fontWeight: 'bold' },
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Last Updated"
                    secondary={new Date(results.lastUpdated).toLocaleString()}
                    slotProps={{
                      secondary: { fontWeight: 'bold' },
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <Container
          maxWidth="lg"
          sx={{ py: 4, display: 'flex', justifyContent: 'center' }}
        >
          <CircularProgress />
        </Container>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
