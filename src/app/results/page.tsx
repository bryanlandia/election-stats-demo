'use client';

import HorizontalBarChart from '@/components/HorizontalBarChart';
import {
  ApiResponse,
  BallotQuestion,
  Candidate,
  Contest,
  Election,
  ElectionResult,
  Office,
  Party,
  Ticket,
} from '@/types';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface ElectionData {
  election: Election;
  results: ElectionResult;
  contests: Contest[];
  ballotQuestions: BallotQuestion[];
  parties: Record<string, Party>;
  candidates: Record<string, Candidate>;
  tickets: Record<string, Ticket>;
  offices: Record<string, Office>;
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
        // Fetch all necessary data in parallel
        const [
          resultsRes,
          electionsRes,
          contestsRes,
          ballotQuestionsRes,
          partiesRes,
          candidatesRes,
          ticketsRes,
          officesRes,
        ] = await Promise.all([
          fetch(`/api/elections/${electionId}/results`),
          fetch('/api/elections'),
          fetch(`/api/elections/${electionId}/contests`),
          fetch(`/api/elections/${electionId}/ballot-questions`),
          fetch('/api/parties'),
          fetch('/api/candidates'),
          fetch('/api/tickets'),
          fetch('/api/offices'),
        ]);

        const [
          resultsData,
          electionsData,
          contestsData,
          ballotQuestionsData,
          partiesData,
          candidatesData,
          ticketsData,
          officesData,
        ] = await Promise.all([
          resultsRes.json(),
          electionsRes.json(),
          contestsRes.json(),
          ballotQuestionsRes.json(),
          partiesRes.json(),
          candidatesRes.json(),
          ticketsRes.json(),
          officesRes.json(),
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

        // Create lookup objects from API responses
        const parties: Record<string, Party> = {};
        if (partiesData.success) {
          partiesData.data.forEach((party: Party) => {
            parties[party.id] = party;
          });
        }

        const candidates: Record<string, Candidate> = {};
        if (candidatesData.success) {
          candidatesData.data.forEach((candidate: Candidate) => {
            candidates[candidate.id] = candidate;
          });
        }

        const tickets: Record<string, Ticket> = {};
        if (ticketsData.success) {
          ticketsData.data.forEach((ticket: Ticket) => {
            tickets[ticket.id] = ticket;
          });
        }

        const offices: Record<string, Office> = {};
        if (officesData.success) {
          officesData.data.forEach((office: Office) => {
            offices[office.id] = office;
          });
        }

        setElectionData({
          election,
          results: resultsData.data,
          contests: contestsData.success ? contestsData.data : [],
          ballotQuestions: ballotQuestionsData.success
            ? ballotQuestionsData.data
            : [],
          parties,
          candidates,
          tickets,
          offices,
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
    candidates,
    tickets,
    offices,
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
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {election.name}
              </Typography>

              {/* Office Information */}
              {election.officeId && offices[election.officeId] && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Office: {offices[election.officeId].name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {offices[election.officeId].description}
                  </Typography>
                  <Box
                    sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}
                  >
                    <Chip
                      label={
                        offices[election.officeId].isElected
                          ? 'Elected Position'
                          : 'Appointed Position'
                      }
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    {offices[election.officeId].termLength && (
                      <Chip
                        label={`${offices[election.officeId].termLength} year term`}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {offices[election.officeId].maxTerms && (
                      <Chip
                        label={`Max ${offices[election.officeId].maxTerms} terms`}
                        color="default"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              )}

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
                      candidates={candidates}
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
                  Total ballots: {formatNumber(results.totalVotes)}
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
