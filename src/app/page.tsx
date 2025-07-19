'use client';

import {
  ApiResponse,
  BallotQuestion,
  Candidate,
  Contest,
  Election,
  Jurisdiction,
  Office,
} from '@/types';
import {
  BarChart as BarChartIcon,
  Event as EventIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  HowToVote as VoteIcon,
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
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Slider,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [ballotQuestions, setBallotQuestions] = useState<BallotQuestion[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [yearRange, setYearRange] = useState<number[]>([2024, 2025]);
  const [selectedElection, setSelectedElection] = useState<string>('all');

  // Contest search filters
  const [contestSearchEnabled, setContestSearchEnabled] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<string>('');
  const [candidateSearch, setCandidateSearch] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          electionsResponse,
          contestsResponse,
          ballotQuestionsResponse,
          officesResponse,
          jurisdictionsResponse,
          candidatesResponse,
        ] = await Promise.all([
          fetch('/api/elections'),
          fetch('/api/elections/all/contests'),
          fetch('/api/elections/all/ballot-questions'),
          fetch('/api/offices'),
          fetch('/api/jurisdictions'),
          fetch('/api/candidates'),
        ]);

        const electionsData: ApiResponse<Election[]> =
          await electionsResponse.json();
        let contestsData: ApiResponse<Contest[]> = { success: true, data: [] };
        let ballotQuestionsData: ApiResponse<BallotQuestion[]> = {
          success: true,
          data: [],
        };
        let officesData: ApiResponse<Office[]> = { success: true, data: [] };
        let jurisdictionsData: ApiResponse<Jurisdiction[]> = {
          success: true,
          data: [],
        };
        let candidatesData: ApiResponse<Candidate[]> = {
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

        // Handle offices response
        if (officesResponse.ok) {
          officesData = await officesResponse.json();
        }

        // Handle jurisdictions response
        if (jurisdictionsResponse.ok) {
          jurisdictionsData = await jurisdictionsResponse.json();
        }

        // Handle candidates response
        if (candidatesResponse.ok) {
          candidatesData = await candidatesResponse.json();
        }

        if (electionsData.success) {
          setElections(electionsData.data);
          setFilteredElections(electionsData.data);
          setContests(contestsData.data || []);
          setFilteredContests(contestsData.data || []);
          setBallotQuestions(ballotQuestionsData.data || []);
          setOffices(officesData.data || []);
          setJurisdictions(jurisdictionsData.data || []);
          setCandidates(candidatesData.data || []);

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

  // Filter contests when contest search filters change
  useEffect(() => {
    if (!contestSearchEnabled) {
      setFilteredContests(contests);
      return;
    }

    let filtered = contests;

    // Filter by selected office
    if (selectedOffice) {
      const office = offices.find((o) => o.id === selectedOffice);
      if (office) {
        // Find elections for this office
        const electionsForOffice = elections.filter(
          (e) => e.officeId === selectedOffice
        );
        const electionIds = electionsForOffice.map((e) => e.id);
        filtered = filtered.filter((c) => electionIds.includes(c.electionId));
      }
    }

    // Filter by candidate search
    if (candidateSearch.trim()) {
      const searchTerm = candidateSearch.toLowerCase().trim();
      filtered = filtered.filter((contest) => {
        // Search in single candidates
        if (contest.candidates) {
          return contest.candidates.some((candidate) =>
            candidate.name.toLowerCase().includes(searchTerm)
          );
        }
        // Search in ticket candidates
        if (contest.tickets) {
          return contest.tickets.some((ticket) =>
            ticket.candidates.some((candidate) =>
              candidate.name.toLowerCase().includes(searchTerm)
            )
          );
        }
        return false;
      });
    }

    setFilteredContests(filtered);
  }, [
    contestSearchEnabled,
    selectedOffice,
    candidateSearch,
    contests,
    offices,
    elections,
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleYearRangeChange = (event: Event, newValue: number | number[]) => {
    setYearRange(newValue as number[]);
  };

  const handleElectionChange = (event: any) => {
    setSelectedElection(event.target.value);
  };

  const handleContestSearchToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContestSearchEnabled(event.target.checked);
    if (!event.target.checked) {
      setSelectedOffice('');
      setCandidateSearch('');
    }
  };

  const handleOfficeChange = (event: any) => {
    setSelectedOffice(event.target.value);
  };

  const handleCandidateSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCandidateSearch(event.target.value);
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

  const groupOfficesByJurisdiction = () => {
    return offices.reduce((groups: Record<string, Office[]>, office) => {
      const jurisdiction = jurisdictions.find(
        (j) => j.id === office.jurisdictionId
      );
      const jurisdictionName = jurisdiction
        ? jurisdiction.name
        : 'Unknown Jurisdiction';
      if (!groups[jurisdictionName]) {
        groups[jurisdictionName] = [];
      }
      groups[jurisdictionName].push(office);
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
          <Tab label="CONTESTS" />
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

          {selectedTab === 2 && (
            <Box sx={{ px: 2 }}>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={contestSearchEnabled}
                      onChange={handleContestSearchToggle}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FilterListIcon />
                      Search for Contests
                    </Box>
                  }
                />
              </Box>

              {contestSearchEnabled && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Office</InputLabel>
                      <Select
                        value={selectedOffice}
                        onChange={handleOfficeChange}
                        input={<OutlinedInput label="Office" />}
                      >
                        <MenuItem value="">
                          <em>All Offices</em>
                        </MenuItem>
                        {Object.entries(groupOfficesByJurisdiction())
                          .map(([jurisdictionName, jurisdictionOffices]) => [
                            <Divider key={`divider-${jurisdictionName}`}>
                              <Chip label={jurisdictionName} size="small" />
                            </Divider>,
                            ...jurisdictionOffices.map((office) => (
                              <MenuItem key={office.id} value={office.id}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                  }}
                                >
                                  <Typography variant="body1">
                                    {office.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    {office.description}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            )),
                          ])
                          .flat()}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Search Candidates"
                      placeholder="Enter candidate name..."
                      value={candidateSearch}
                      onChange={handleCandidateSearchChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              )}
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

      {/* Results Grid */}
      {!loading && !error && (
        <>
          {selectedTab !== 2 && (
            <>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mb: 3 }}
              >
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
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
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
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 2,
                            }}
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

          {selectedTab === 2 && (
            <>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Contests ({filteredContests.length})
              </Typography>

              <Grid container spacing={3}>
                {filteredContests.map((contest) => {
                  const election = elections.find(
                    (e) => e.id === contest.electionId
                  );
                  const office = offices.find(
                    (o) => o.id === election?.officeId
                  );
                  const jurisdiction = jurisdictions.find(
                    (j) => j.id === contest.jurisdictionId
                  );

                  return (
                    <Grid item xs={12} sm={6} md={4} key={contest.id}>
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
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <VoteIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Chip
                              label={
                                contest.isPartisan ? 'Partisan' : 'Non-partisan'
                              }
                              color={contest.isPartisan ? 'primary' : 'default'}
                              size="small"
                            />
                          </Box>

                          <Typography variant="h6" component="h3" gutterBottom>
                            {contest.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            <strong>Office:</strong> {office?.name || 'Unknown'}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            <strong>Jurisdiction:</strong>{' '}
                            {jurisdiction?.name || 'Unknown'}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            <strong>Election:</strong>{' '}
                            {election?.name || 'Unknown'}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            <strong>Type:</strong>{' '}
                            {contest.isTicketBased
                              ? 'Ticket-based'
                              : 'Individual Candidates'}
                          </Typography>

                          {contest.candidates &&
                            contest.candidates.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Candidates:{' '}
                                  {contest.candidates
                                    .map((c) => c.name)
                                    .join(', ')}
                                </Typography>
                              </Box>
                            )}

                          {contest.tickets && contest.tickets.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Tickets:{' '}
                                {contest.tickets
                                  .map((t) =>
                                    t.candidates.map((c) => c.name).join(' & ')
                                  )
                                  .join(', ')}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>

                        <CardActions>
                          <Button
                            component={Link}
                            href={`/results?election=${contest.electionId}`}
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
                  );
                })}
              </Grid>

              {filteredContests.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    {contestSearchEnabled
                      ? 'No contests found for the selected criteria.'
                      : 'Enable contest search to filter contests by office or candidate.'}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}
