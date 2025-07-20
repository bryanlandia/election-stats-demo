'use client';

import HorizontalBarChart from '@/components/HorizontalBarChart';
import {
  ApiResponse,
  BallotQuestion,
  Candidate,
  Contest,
  Election,
  ElectionResult,
  Jurisdiction,
  Office,
  Party,
  QuestionType,
  Ticket,
} from '@/types';
import {
  FilterList as FilterListIcon,
  InfoOutlined as InfoIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  LinearProgress,
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
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';

export default function HomePage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [ballotQuestions, setBallotQuestions] = useState<BallotQuestion[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [electionResults, setElectionResults] = useState<
    Record<string, ElectionResult>
  >({});
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [filteredBallotQuestions, setFilteredBallotQuestions] = useState<
    BallotQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'year' | 'election'>('year');
  const [yearRange, setYearRange] = useState<number[]>([2024, 2025]);
  const [selectedElection, setSelectedElection] = useState<string>('all');

  // Contest search filters
  const [contestSearchEnabled, setContestSearchEnabled] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<string>('');
  const [candidateSearch, setCandidateSearch] = useState<string>('');

  // Ballot question search filters
  const [ballotQuestionSearchEnabled, setBallotQuestionSearchEnabled] =
    useState(true);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('');
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('');

  // Office header toggle state for each contest
  const [officeHeaderExpanded, setOfficeHeaderExpanded] = useState<
    Record<string, boolean>
  >({});

  // Ballot question extended text toggle state
  const [ballotQuestionExpanded, setBallotQuestionExpanded] = useState<
    Record<string, boolean>
  >({});

  // Function to toggle office header
  const toggleOfficeHeader = (contestId: string) => {
    setOfficeHeaderExpanded((prev) => ({
      ...prev,
      [contestId]: !prev[contestId],
    }));
  };

  // Function to toggle ballot question extended text
  const toggleBallotQuestion = (questionId: string) => {
    setBallotQuestionExpanded((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

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
          questionTypesResponse,
          partiesResponse,
          ticketsResponse,
        ] = await Promise.all([
          fetch('/api/elections'),
          fetch('/api/elections/all/contests'),
          fetch('/api/elections/all/ballot-questions'),
          fetch('/api/offices'),
          fetch('/api/jurisdictions'),
          fetch('/api/candidates'),
          fetch('/api/question-types'),
          fetch('/api/parties'),
          fetch('/api/tickets'),
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
        let partiesData: ApiResponse<Party[]> = {
          success: true,
          data: [],
        };
        let ticketsData: ApiResponse<Ticket[]> = {
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

        // Handle parties response
        if (partiesResponse.ok) {
          partiesData = await partiesResponse.json();
        }

        // Handle tickets response
        if (ticketsResponse.ok) {
          ticketsData = await ticketsResponse.json();
        }

        // Handle question types response
        let questionTypesData: ApiResponse<QuestionType[]> = {
          success: true,
          data: [],
        };
        if (questionTypesResponse.ok) {
          questionTypesData = await questionTypesResponse.json();
        }

        if (electionsData.success) {
          setElections(electionsData.data);
          setContests(contestsData.data || []);
          setFilteredContests(contestsData.data || []);
          setBallotQuestions(ballotQuestionsData.data || []);
          setFilteredBallotQuestions(ballotQuestionsData.data || []);
          setOffices(officesData.data || []);
          setJurisdictions(jurisdictionsData.data || []);
          setCandidates(candidatesData.data || []);
          setQuestionTypes(questionTypesData.data || []);
          setParties(partiesData.data || []);
          setTickets(ticketsData.data || []);

          // Set year range based on available elections
          const years = electionsData.data.map((e) =>
            new Date(e.date).getFullYear()
          );
          const minYear = Math.min(...years);
          const maxYear = Math.max(...years);
          setYearRange([minYear, maxYear]);

          // Fetch election results
          await fetchElectionResults(electionsData.data);
        } else {
          setError(electionsData.message || 'Failed to fetch elections');
        }
      } catch (_err) {
        setError('Failed to fetch election data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch election results for given elections
  const fetchElectionResults = async (elections: Election[]) => {
    const resultsPromises = elections.map(async (election) => {
      try {
        const response = await fetch(`/api/elections/${election.id}/results`);
        if (response.ok) {
          const data: ApiResponse<ElectionResult> = await response.json();
          if (data.success) {
            return { electionId: election.id, result: data.data };
          }
        }
      } catch (err) {
        console.error(
          `Failed to fetch results for election ${election.id}:`,
          err
        );
      }
      return null;
    });

    const results = await Promise.all(resultsPromises);
    const resultsMap: Record<string, ElectionResult> = {};

    results.forEach((result) => {
      if (result) {
        resultsMap[result.electionId] = result.result;
      }
    });

    setElectionResults(resultsMap);
  };

  // Filter contests and ballot questions when search mode or filters change
  useEffect(() => {
    let filteredContests = contests;
    let filteredQuestions = ballotQuestions;

    if (searchMode === 'year') {
      // Year range filter - filter by election dates
      const electionsInRange = elections.filter((election) => {
        const year = new Date(election.date).getFullYear();
        return year >= yearRange[0] && year <= yearRange[1];
      });
      const electionIds = electionsInRange.map((e) => e.id);

      filteredContests = contests.filter((contest) =>
        electionIds.includes(contest.electionId)
      );
      filteredQuestions = ballotQuestions.filter((question) =>
        electionIds.includes(question.electionId)
      );
    } else if (searchMode === 'election') {
      // Election dates filter
      if (selectedElection !== 'all') {
        filteredContests = contests.filter(
          (contest) => contest.electionId === selectedElection
        );
        filteredQuestions = ballotQuestions.filter(
          (question) => question.electionId === selectedElection
        );
      }
    }

    setFilteredContests(filteredContests);
    setFilteredBallotQuestions(filteredQuestions);
  }, [
    searchMode,
    yearRange,
    selectedElection,
    elections,
    contests,
    ballotQuestions,
  ]);

  // Apply contest search filters in addition to main filters
  useEffect(() => {
    if (!contestSearchEnabled) {
      return; // Use the main filtering results
    }

    let filtered = filteredContests; // Start with already filtered contests

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
    filteredContests,
    offices,
    elections,
  ]);

  // Apply ballot question search filters in addition to main filters
  useEffect(() => {
    if (!ballotQuestionSearchEnabled) {
      return; // Use the main filtering results
    }

    let filtered = filteredBallotQuestions; // Start with already filtered questions

    // Filter by selected jurisdiction
    if (selectedJurisdiction) {
      filtered = filtered.filter(
        (question) => question.jurisdictionId === selectedJurisdiction
      );
    }

    // Filter by selected question type
    if (selectedQuestionType) {
      filtered = filtered.filter(
        (question) => question.questionTypeId === selectedQuestionType
      );
    }

    setFilteredBallotQuestions(filtered);
  }, [
    ballotQuestionSearchEnabled,
    selectedJurisdiction,
    selectedQuestionType,
    filteredBallotQuestions,
  ]);

  // Helper functions for chart rendering
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const getColorForResult = (index: number, party?: Party): string => {
    if (party) {
      return party.color || getDefaultColor(index);
    }
    return getDefaultColor(index);
  };

  const getDefaultColor = (index: number): string => {
    const defaultColors = [
      '#1976d2',
      '#dc004e',
      '#388e3c',
      '#f57c00',
      '#7b1fa2',
    ];
    return defaultColors[index % defaultColors.length];
  };

  const handleTabChange = (mode: 'year' | 'election') => {
    setSearchMode(mode);
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

  const handleBallotQuestionSearchToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBallotQuestionSearchEnabled(event.target.checked);
    if (!event.target.checked) {
      setSelectedJurisdiction('');
      setSelectedQuestionType('');
    }
  };

  const handleJurisdictionChange = (event: any) => {
    setSelectedJurisdiction(event.target.value);
  };

  const handleQuestionTypeChange = (event: any) => {
    setSelectedQuestionType(event.target.value);
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

  // Helper function to combine and sort all results by date descending
  const getCombinedResults = () => {
    type CombinedResult = {
      type: 'contest' | 'ballotQuestion';
      item: Contest | BallotQuestion;
      election?: Election;
      date: string;
    };

    const combinedResults: CombinedResult[] = [];

    // Add contests if enabled
    if (contestSearchEnabled) {
      filteredContests.forEach((contest) => {
        const election = elections.find((e) => e.id === contest.electionId);
        if (election) {
          combinedResults.push({
            type: 'contest',
            item: contest,
            election,
            date: election.date,
          });
        }
      });
    }

    // Add ballot questions if enabled
    if (ballotQuestionSearchEnabled) {
      filteredBallotQuestions.forEach((question) => {
        const election = elections.find((e) => e.id === question.electionId);
        if (election) {
          combinedResults.push({
            type: 'ballotQuestion',
            item: question,
            election,
            date: election.date,
          });
        }
      });
    }

    // Sort by date descending (newest first)
    return combinedResults.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
        }}
      >
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

      {/* Two-Column Layout */}
      <Grid container spacing={4}>
        {/* Left Column - Search Form */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <SearchIcon />
              Search By
            </Typography>

            {/* Search Mode Toggle */}
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={searchMode === 'year' ? 0 : 1}
                onChange={(event, newValue) =>
                  handleTabChange(newValue === 0 ? 'year' : 'election')
                }
                sx={{ borderBottom: 1, borderColor: 'divider' }}
                variant="fullWidth"
              >
                <Tab label="YEAR RANGE" />
                <Tab label="ELECTION DATES" />
              </Tabs>
            </Box>

            {/* Main Search Controls */}
            <Box sx={{ mb: 4 }}>
              {searchMode === 'year' && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Year Range
                  </Typography>
                  <Box sx={{ px: 2, py: 2 }}>
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
                        .map((year) => ({
                          value: year,
                          label: year.toString(),
                        }))}
                      sx={{ mt: 2 }}
                    />
                  </Box>
                </Box>
              )}

              {searchMode === 'election' && (
                <Box>
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

            <Divider sx={{ my: 3 }} />

            {/* Contest Filters */}
            <Box sx={{ mb: 4 }}>
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
                <Grid container spacing={2}>
                  <Grid size={12}>
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

                  <Grid size={12}>
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

            <Divider sx={{ my: 3 }} />

            {/* Ballot Question Filters */}
            <Box>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={ballotQuestionSearchEnabled}
                      onChange={handleBallotQuestionSearchToggle}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FilterListIcon />
                      Search for Ballot Questions
                    </Box>
                  }
                />
              </Box>

              {ballotQuestionSearchEnabled && (
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControl fullWidth>
                      <InputLabel>Filter by Jurisdiction</InputLabel>
                      <Select
                        value={selectedJurisdiction}
                        onChange={handleJurisdictionChange}
                        input={<OutlinedInput label="Filter by Jurisdiction" />}
                      >
                        <MenuItem value="">All Jurisdictions</MenuItem>
                        {jurisdictions.map((jurisdiction) => (
                          <MenuItem
                            key={jurisdiction.id}
                            value={jurisdiction.id}
                          >
                            {jurisdiction.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={12}>
                    <FormControl fullWidth>
                      <InputLabel>Filter by Question Type</InputLabel>
                      <Select
                        value={selectedQuestionType}
                        onChange={handleQuestionTypeChange}
                        input={
                          <OutlinedInput label="Filter by Question Type" />
                        }
                      >
                        <MenuItem value="">All Question Types</MenuItem>
                        {questionTypes.map((questionType) => (
                          <MenuItem
                            key={questionType.id}
                            value={questionType.id}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                              }}
                            >
                              <Typography variant="body1">
                                {questionType.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary' }}
                              >
                                {questionType.description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Results Grid */}
        <Grid size={{ xs: 12, md: 9 }}>
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
            <Box>
              {(contestSearchEnabled || ballotQuestionSearchEnabled) && (
                <Box>
                  {(() => {
                    const combinedResults = getCombinedResults();
                    const totalCount = combinedResults.length;
                    const contestCount = combinedResults.filter(
                      (result) => result.type === 'contest'
                    ).length;
                    const ballotQuestionCount = combinedResults.filter(
                      (result) => result.type === 'ballotQuestion'
                    ).length;

                    if (totalCount === 0) {
                      return (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No results found for the selected criteria.
                          </Typography>
                        </Box>
                      );
                    }

                    return (
                      <>
                        <Typography
                          variant="h4"
                          component="h2"
                          gutterBottom
                          sx={{ mb: 3 }}
                        >
                          {contestCount > 0 && ballotQuestionCount > 0
                            ? `${totalCount} Contests and Ballot Questions`
                            : contestCount > 0
                              ? `${contestCount} Contests`
                              : ballotQuestionCount > 0
                                ? `${ballotQuestionCount} Ballot Questions`
                                : ''}
                        </Typography>

                        <Grid container spacing={3}>
                          {combinedResults.map((result) => {
                            if (result.type === 'contest') {
                              const contest = result.item as Contest;
                              const election = result.election!;
                              const office = offices.find(
                                (o) => o.id === election?.officeId
                              );
                              const jurisdiction = jurisdictions.find(
                                (j) => j.id === contest.jurisdictionId
                              );
                              const electionResult = election
                                ? electionResults[election.id]
                                : null;
                              const contestResult =
                                electionResult?.contestResults?.find(
                                  (cr) => cr.contestId === contest.id
                                );

                              // Create lookup objects for the chart component
                              const partiesLookup = parties.reduce(
                                (acc, party) => {
                                  acc[party.id] = party;
                                  return acc;
                                },
                                {} as Record<string, Party>
                              );

                              const candidatesLookup = candidates.reduce(
                                (acc, candidate) => {
                                  acc[candidate.id] = candidate;
                                  return acc;
                                },
                                {} as Record<string, Candidate>
                              );

                              const ticketsLookup = tickets.reduce(
                                (acc, ticket) => {
                                  acc[ticket.id] = ticket;
                                  return acc;
                                },
                                {} as Record<string, Ticket>
                              );

                              return (
                                <Grid
                                  size={{ xs: 12, md: 6, xl: 4 }}
                                  key={`contest-${contest.id}`}
                                >
                                  <Card
                                    sx={{
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      transition:
                                        'transform 0.2s, box-shadow 0.2s',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                      },
                                    }}
                                  >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                      {/* Election info above title */}
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mb: 1, display: 'block' }}
                                      >
                                        {election?.name} •{' '}
                                        {election?.date &&
                                          new Date(
                                            election.date
                                          ).toLocaleDateString()}
                                        {office && ` • ${office.name}`}
                                      </Typography>

                                      {/* Contest title with info toggle */}
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          mb: 1,
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          component="h3"
                                          sx={{ flex: 1 }}
                                        >
                                          {contest.name}
                                        </Typography>

                                        {/* Compact Office Header Toggle */}
                                        {office && (
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              toggleOfficeHeader(contest.id)
                                            }
                                            sx={{
                                              color: 'primary.main',
                                              p: 0.5,
                                            }}
                                          >
                                            <InfoIcon fontSize="small" />
                                          </IconButton>
                                        )}
                                      </Box>

                                      {/* Toggleable Office Header */}
                                      {office &&
                                        officeHeaderExpanded[contest.id] && (
                                          <Box
                                            sx={{
                                              mb: 2,
                                              p: 1.5,
                                              bgcolor: '#f5f5f5',
                                              borderRadius: 1,
                                            }}
                                          >
                                            <Typography
                                              variant="h6"
                                              color="primary"
                                              gutterBottom
                                              sx={{ mb: 1 }}
                                            >
                                              Office: {office.name}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              sx={{ mb: 1.5 }}
                                            >
                                              {office.description}
                                            </Typography>
                                            <Box
                                              sx={{
                                                display: 'flex',
                                                gap: 0.5,
                                                flexWrap: 'wrap',
                                              }}
                                            >
                                              <Chip
                                                label={
                                                  office.isElected
                                                    ? 'Elected Position'
                                                    : 'Appointed Position'
                                                }
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                              />
                                              {office.termLength && (
                                                <Chip
                                                  label={`${office.termLength} year term`}
                                                  color="secondary"
                                                  variant="outlined"
                                                  size="small"
                                                />
                                              )}
                                              {office.maxTerms && (
                                                <Chip
                                                  label={`Max ${office.maxTerms} terms`}
                                                  color="default"
                                                  variant="outlined"
                                                  size="small"
                                                />
                                              )}
                                            </Box>
                                          </Box>
                                        )}

                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          mb: 2,
                                        }}
                                      >
                                        <Chip
                                          label={
                                            contest.isPartisan
                                              ? 'Partisan'
                                              : 'Non-partisan'
                                          }
                                          color={
                                            contest.isPartisan
                                              ? 'primary'
                                              : 'default'
                                          }
                                          size="small"
                                        />
                                      </Box>

                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                      >
                                        {jurisdiction?.name || 'Unknown'}
                                      </Typography>

                                      {/* Horizontal Bar Chart */}
                                      {contestResult ? (
                                        <HorizontalBarChart
                                          contestResult={contestResult}
                                          parties={partiesLookup}
                                          candidates={candidatesLookup}
                                          tickets={ticketsLookup}
                                          getColorForResult={getColorForResult}
                                          formatNumber={formatNumber}
                                        />
                                      ) : (
                                        <Box
                                          sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            bgcolor: '#f5f5f5',
                                            borderRadius: 1,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            No results data available for this
                                            contest
                                          </Typography>
                                        </Box>
                                      )}
                                    </CardContent>
                                  </Card>
                                </Grid>
                              );
                            } else {
                              // Ballot Question
                              const question = result.item as BallotQuestion;
                              const election = result.election!;
                              const jurisdiction = jurisdictions.find(
                                (j) => j.id === question.jurisdictionId
                              );
                              const questionType = questionTypes.find(
                                (qt) => qt.id === question.questionTypeId
                              );
                              const electionResult = election
                                ? electionResults[election.id]
                                : null;
                              const ballotResult =
                                electionResult?.ballotQuestionResults?.find(
                                  (br) => br.ballotQuestionId === question.id
                                );

                              return (
                                <Grid
                                  size={{ xs: 12, md: 6, xl: 4 }}
                                  key={`question-${question.id}`}
                                >
                                  <Card
                                    sx={{
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      transition:
                                        'transform 0.2s, box-shadow 0.2s',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                      },
                                    }}
                                  >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                      {/* Election info above title */}
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mb: 1, display: 'block' }}
                                      >
                                        {election?.name} •{' '}
                                        {election?.date &&
                                          new Date(
                                            election.date
                                          ).toLocaleDateString()}
                                        {questionType &&
                                          ` • ${questionType.name}`}
                                      </Typography>

                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          mb: 2,
                                        }}
                                      >
                                        <Chip
                                          label={
                                            question.passed
                                              ? 'Passed'
                                              : 'Failed'
                                          }
                                          color={
                                            question.passed
                                              ? 'success'
                                              : 'error'
                                          }
                                          size="small"
                                        />
                                      </Box>

                                      {/* Question title with info toggle */}
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          mb: 1,
                                        }}
                                      >
                                        <Typography
                                          variant="h6"
                                          component="h3"
                                          sx={{ flex: 1 }}
                                        >
                                          {question.shortTitle}
                                        </Typography>

                                        {/* Info Toggle for Extended Text */}
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            toggleBallotQuestion(question.id)
                                          }
                                          sx={{
                                            color: 'primary.main',
                                            p: 0.5,
                                          }}
                                        >
                                          <InfoIcon fontSize="small" />
                                        </IconButton>
                                      </Box>

                                      {/* Toggleable Extended Text */}
                                      {ballotQuestionExpanded[question.id] && (
                                        <Box
                                          sx={{
                                            mb: 2,
                                            p: 1.5,
                                            bgcolor: '#f5f5f5',
                                            borderRadius: 1,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            {question.extendedText}
                                          </Typography>
                                        </Box>
                                      )}

                                      {/* Always show truncated text when not expanded */}
                                      {!ballotQuestionExpanded[question.id] && (
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          gutterBottom
                                          sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            mb: 2,
                                          }}
                                        >
                                          {question.extendedText}
                                        </Typography>
                                      )}

                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                      >
                                        {jurisdiction?.name || 'Unknown'}
                                      </Typography>

                                      {/* Ballot Question Results Chart */}
                                      {ballotResult ? (
                                        <Box sx={{ mb: 2 }}>
                                          <Paper
                                            sx={{
                                              p: 1.5,
                                              mb: 1.5,
                                              backgroundColor:
                                                ballotResult.passed
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
                                                  Yes{' '}
                                                  {ballotResult.passed
                                                    ? '✓'
                                                    : ''}
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                >
                                                  {formatNumber(
                                                    ballotResult.yesVotes
                                                  )}{' '}
                                                  votes
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
                                                mt: 0.5,
                                                height: 6,
                                                borderRadius: 3,
                                                '& .MuiLinearProgress-bar': {
                                                  backgroundColor: '#4caf50',
                                                },
                                              }}
                                            />
                                          </Paper>

                                          <Paper
                                            sx={{
                                              p: 1.5,
                                              backgroundColor:
                                                !ballotResult.passed
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
                                                <Typography
                                                  variant="h6"
                                                  color="error.main"
                                                >
                                                  No{' '}
                                                  {!ballotResult.passed
                                                    ? '✓'
                                                    : ''}
                                                </Typography>
                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                >
                                                  {formatNumber(
                                                    ballotResult.noVotes
                                                  )}{' '}
                                                  votes
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
                                                mt: 0.5,
                                                height: 6,
                                                borderRadius: 3,
                                                '& .MuiLinearProgress-bar': {
                                                  backgroundColor: '#f44336',
                                                },
                                              }}
                                            />
                                          </Paper>

                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                              mt: 1.5,
                                              textAlign: 'center',
                                            }}
                                          >
                                            Result:{' '}
                                            <strong>
                                              {ballotResult.passed
                                                ? 'PASSED'
                                                : 'FAILED'}
                                            </strong>
                                          </Typography>
                                        </Box>
                                      ) : (
                                        <Box
                                          sx={{
                                            p: 3,
                                            textAlign: 'center',
                                            bgcolor: '#f5f5f5',
                                            borderRadius: 1,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            No results data available for this
                                            ballot question
                                          </Typography>
                                        </Box>
                                      )}
                                    </CardContent>
                                  </Card>
                                </Grid>
                              );
                            }
                          })}
                        </Grid>
                      </>
                    );
                  })()}
                </Box>
              )}

              {/* Show message when both searches are disabled */}
              {!contestSearchEnabled && !ballotQuestionSearchEnabled && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Please enable contest search, ballot question search, or
                    both to see results.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
