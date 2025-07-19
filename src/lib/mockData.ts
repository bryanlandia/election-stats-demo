import {
  BallotQuestion,
  Contest,
  Contestant,
  ContestResult,
  Election,
  ElectionResult,
  Jurisdiction,
  Party,
  Tenant,
  Ticket,
} from '@/types';

// Tenant Data
export const mockTenant: Tenant = {
  id: '1',
  name: 'State of New Crampshire',
  jurisdictionId: '1',
};

// Jurisdiction Data
export const mockJurisdictions: Record<string, Jurisdiction> = {
  '1': {
    id: '1',
    name: 'State of New Crampshire',
    registeredVoters: 4297831,
    partisanContestTypes: ['God-Emperor and Chief Sycophant'],
    nonPartisanContestTypes: ['Dogcatcher'],
  },
  '2': {
    id: '2',
    name: 'Bullton County',
    registeredVoters: 1134672,
    parentJurisdictionId: '1',
    partisanContestTypes: [],
    nonPartisanContestTypes: ['Dogcatcher'],
  },
  '3': {
    id: '3',
    name: 'United States Federal Government',
    registeredVoters: 240000000,
    partisanContestTypes: ['God-Emperor and Chief Sycophant'],
    nonPartisanContestTypes: [],
  },
};

// Party Data
export const mockParties: Record<string, Party> = {
  '1': {
    id: '1',
    name: 'Extremely Buttery',
    color: '#FFDB58', // butter yellow
  },
  '2': {
    id: '2',
    name: 'Vegan Imperium',
    color: '#CC8899', // puce
  },
  '3': {
    id: '3',
    name: 'Zizians',
    color: '#000000', // black
  },
};

// Election Data
export const mockElections: Record<string, Election> = {
  '1': {
    id: '1',
    name: 'Federal General Election 2024',
    date: '2024-11-05', // First Tuesday of November 2024
    stage: 'General Election',
    jurisdictionId: '3',
    status: 'completed',
  },
  '2': {
    id: '2',
    name: 'New Crampshire General Election 2025',
    date: '2025-07-19',
    stage: 'General Election',
    jurisdictionId: '1',
    status: 'completed',
  },
  '3': {
    id: '3',
    name: 'Extremely Buttery Party Primary 2023',
    date: '2023-08-06',
    stage: 'Extremely Buttery Party Primary',
    jurisdictionId: '3',
    status: 'completed',
  },
};

// Contestant Data
export const mockContestants: Record<string, Contestant> = {
  // Federal Election Contestants
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
  '5': { id: '5', name: 'Ziz LaSota', partyId: '3', position: 'God-Emperor' },
  '6': {
    id: '6',
    name: 'Emma Borhanian',
    partyId: '3',
    position: 'Chief Sycophant',
  },

  // Primary Election Contestants (single contestants)
  '7': { id: '7', name: 'Martha Stewart', partyId: '1' },
  '8': { id: '8', name: 'Emerill Lagasse', partyId: '1' },
  '9': { id: '9', name: 'Rachel Ray', partyId: '1' },
  '10': { id: '10', name: 'Anthony Bourdain', partyId: '1' },

  // Dogcatcher Contestants (non-partisan)
  '11': { id: '11', name: 'Borkmeister Fuller' },
  '12': { id: '12', name: 'Mean Lady' },
  '13': { id: '13', name: 'Not-a-Poodle' },
};

// Ticket Data
export const mockTickets: Record<string, Ticket> = {
  '1': {
    id: '1',
    partyId: '1',
    contestants: [mockContestants['1'], mockContestants['2']],
  },
  '2': {
    id: '2',
    partyId: '2',
    contestants: [mockContestants['3'], mockContestants['4']],
  },
  '3': {
    id: '3',
    partyId: '3',
    contestants: [mockContestants['5'], mockContestants['6']],
  },
};

// Contest Data
export const mockContests: Record<string, Contest> = {
  '1': {
    id: '1',
    electionId: '1',
    jurisdictionId: '3',
    name: 'God-Emperor and Chief Sycophant of the United States',
    isPartisan: true,
    isTicketBased: true,
    tickets: [mockTickets['1'], mockTickets['2'], mockTickets['3']],
  },
  '2': {
    id: '2',
    electionId: '2',
    jurisdictionId: '2',
    name: 'Dogcatcher',
    isPartisan: false,
    isTicketBased: false,
    contestants: [
      mockContestants['11'],
      mockContestants['12'],
      mockContestants['13'],
    ],
  },
  '3': {
    id: '3',
    electionId: '3',
    jurisdictionId: '3',
    name: 'Extremely Buttery Party Primary',
    isPartisan: true,
    isTicketBased: false,
    contestants: [
      mockContestants['7'],
      mockContestants['8'],
      mockContestants['9'],
      mockContestants['10'],
    ],
  },
};

// Ballot Question Data
export const mockBallotQuestions: Record<string, BallotQuestion> = {
  '1': {
    id: '1',
    electionId: '2',
    jurisdictionId: '1',
    shortTitle:
      'Decided: The State of New Crampshire shall elect its legislature via sortition among all eligible registered voters in the State of New Crampshire.',
    extendedText:
      'The election of the legislature for the State of New Crampshire shall be done via sortition among all eligible registered voters at the time of each election. The legislature will be comprised of 100 registered voters, chosen randomly, and shall serve for a period of 1 year. Their annual salary shall be $150,000 per annum, with increases recalculated prior to each sortition selection to be done by the Board of Elections, based on the change to average purchasing power in the capital county of Bullton. The very first legislature shall have a session of 2 years. After 1 year, 25% of the legislature shall be replaced. Each subsequent year and election, 25% shall be replaced by another automated sortition.',
    passed: true,
    yesVotes: 3059999,
    noVotes: 1237832,
    yesPercentage: 71.2,
    noPercentage: 28.8,
  },
};

// Contest Results Data
export const mockContestResults: Record<string, ContestResult> = {
  '1': {
    contestId: '1',
    totalVotes: 158000000,
    results: [
      {
        ticketId: '1',
        votes: 117236000,
        percentage: 74.2,
        winner: true,
      },
      {
        ticketId: '2',
        votes: 33496000,
        percentage: 21.2,
        winner: false,
      },
      {
        ticketId: '3',
        votes: 7268000,
        percentage: 4.6,
        winner: false,
      },
    ],
  },
  '2': {
    contestId: '2',
    totalVotes: 918084,
    results: [
      {
        contestantId: '11',
        votes: 743648,
        percentage: 81.0,
        winner: true,
      },
      {
        contestantId: '12',
        votes: 9181,
        percentage: 1.0,
        winner: false,
      },
      {
        contestantId: '13',
        votes: 165255,
        percentage: 18.0,
        winner: false,
      },
    ],
  },
  '3': {
    contestId: '3',
    totalVotes: 2400000,
    results: [
      {
        contestantId: '7',
        votes: 1032000,
        percentage: 43.0,
        winner: true,
      },
      {
        contestantId: '10',
        votes: 912000,
        percentage: 38.0,
        winner: false,
        disqualified: true,
        disqualificationReason: 'Deceased',
      },
      {
        contestantId: '9',
        votes: 312000,
        percentage: 13.0,
        winner: false,
      },
      {
        contestantId: '8',
        votes: 144000,
        percentage: 6.0,
        winner: false,
      },
    ],
  },
};

// Election Results Data
export const mockElectionResults: Record<string, ElectionResult> = {
  '1': {
    id: '1',
    electionId: '1',
    totalVotes: 158000000,
    reportingPercentage: 100,
    lastUpdated: '2024-11-06T10:30:00Z',
    contestResults: [mockContestResults['1']],
  },
  '2': {
    id: '2',
    electionId: '2',
    totalVotes: 5215915, // Combined votes from ballot question and dogcatcher contest
    reportingPercentage: 100,
    lastUpdated: '2025-07-20T08:00:00Z',
    contestResults: [mockContestResults['2']],
    ballotQuestionResults: [
      {
        ballotQuestionId: '1',
        yesVotes: 3059999,
        noVotes: 1237832,
        yesPercentage: 71.2,
        noPercentage: 28.8,
        passed: true,
      },
    ],
  },
  '3': {
    id: '3',
    electionId: '3',
    totalVotes: 2400000,
    reportingPercentage: 100,
    lastUpdated: '2024-08-07T11:15:00Z',
    contestResults: [mockContestResults['3']],
  },
};

// Legacy format for backward compatibility
export const legacyMockResults: Record<string, any> = {
  '1': {
    id: '1',
    electionId: '1',
    totalVotes: 158000000,
    reportingPercentage: 100,
    lastUpdated: '2024-11-06T10:30:00Z',
    candidates: [
      {
        id: '1',
        name: 'Martha Stewart & Emerill Lagasse',
        party: 'Extremely Buttery',
        votes: 117236000,
        percentage: 74.2,
        color: '#FFDB58',
      },
      {
        id: '2',
        name: 'Joaquin Phoenix & Ariana Grande',
        party: 'Vegan Imperium',
        votes: 33496000,
        percentage: 21.2,
        color: '#CC8899',
      },
      {
        id: '3',
        name: 'Ziz LaSota & Emma Borhanian',
        party: 'Zizians',
        votes: 7268000,
        percentage: 4.6,
        color: '#000000',
      },
    ],
  },
};
