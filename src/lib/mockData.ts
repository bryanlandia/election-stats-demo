import {
  BallotQuestion,
  Candidate,
  Contest,
  ContestResult,
  Election,
  ElectionResult,
  Jurisdiction,
  Office,
  Party,
  QuestionType,
  Tenant,
  Ticket,
} from '@/types';

// Tenant Data
export const mockTenant: Tenant = {
  id: '1',
  name: 'State of New Crmpshire',
  jurisdictionId: '1',
};

// Jurisdiction Data
export const mockJurisdictions: Record<string, Jurisdiction> = {
  '1': {
    id: '1',
    name: 'State of New Crmpshire',
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

// Office Data
export const mockOffices: Record<string, Office> = {
  '1': {
    id: '1',
    name: 'God-Emperor of the United States',
    description:
      'The highest executive office of the Federal Government, responsible for supreme leadership and divine mandate over the nation.',
    jurisdictionId: '3', // Federal jurisdiction
    isElected: true,
    termLength: 4,
    maxTerms: 2,
  },
  '2': {
    id: '2',
    name: 'Chief Sycophant of the United States',
    description:
      'The second-highest executive office of the Federal Government, serving as the primary advisor and loyal supporter to the God-Emperor.',
    jurisdictionId: '3', // Federal jurisdiction
    isElected: true,
    termLength: 4,
    maxTerms: 2,
  },
  '3': {
    id: '3',
    name: 'Dogcatcher of Bullton County',
    description:
      'Mean person who hunts for members of the free wild borkers gang.',
    jurisdictionId: '2', // Bullton County
    isElected: true,
    termLength: 4,
    // No term limits for dogcatcher
  },
};

// Election Data
export const mockElections: Record<string, Election> = {
  '1': {
    id: '1',
    name: 'Federal General Election 2024 - God-Emperor',
    date: '2024-11-05', // First Tuesday of November 2024
    stage: 'General Election',
    jurisdictionId: '3',
    officeId: '1', // God-Emperor office
    status: 'completed',
  },
  '2': {
    id: '2',
    name: 'Federal General Election 2024 - Chief Sycophant',
    date: '2024-11-05', // Same election day
    stage: 'General Election',
    jurisdictionId: '3',
    officeId: '2', // Chief Sycophant office
    status: 'completed',
  },
  '3': {
    id: '3',
    name: 'New Crmpshire General Election 2025',
    date: '2025-07-19',
    stage: 'General Election',
    jurisdictionId: '1',
    officeId: '3', // Dogcatcher office
    status: 'completed',
  },
  '4': {
    id: '4',
    name: 'Extremely Buttery Party Primary 2023',
    date: '2023-08-06',
    stage: 'Extremely Buttery Party Primary',
    jurisdictionId: '3',
    officeId: '1', // God-Emperor office
    status: 'completed',
  },
};

// Candidate Data
export const mockCandidates: Record<string, Candidate> = {
  // Federal Election Candidates
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

  // Primary Election Candidates (single candidates)
  '7': { id: '7', name: 'Martha Stewart', partyId: '1' },
  '8': { id: '8', name: 'Emerill Lagasse', partyId: '1' },
  '9': { id: '9', name: 'Rachel Ray', partyId: '1' },
  '10': { id: '10', name: 'Anthony Bourdain', partyId: '1' },

  // Dogcatcher Candidates (non-partisan)
  '11': { id: '11', name: 'Borkmeister Fuller' },
  '12': { id: '12', name: 'Mean Lady' },
  '13': { id: '13', name: 'Not-a-Poodle' },
};

// Ticket Data
export const mockTickets: Record<string, Ticket> = {
  '1': {
    id: '1',
    partyId: '1',
    candidates: [mockCandidates['1'], mockCandidates['2']],
  },
  '2': {
    id: '2',
    partyId: '2',
    candidates: [mockCandidates['3'], mockCandidates['4']],
  },
  '3': {
    id: '3',
    partyId: '3',
    candidates: [mockCandidates['5'], mockCandidates['6']],
  },
};

// Contest Data
export const mockContests: Record<string, Contest> = {
  '1': {
    id: '1',
    electionId: '1',
    jurisdictionId: '3',
    name: 'God-Emperor of the United States',
    isPartisan: true,
    isTicketBased: true, // Changed to ticket-based
    tickets: [
      mockTickets['1'], // Martha Stewart & Emerill Lagasse (Extremely Buttery)
      mockTickets['2'], // Joaquin Phoenix & Ariana Grande (Vegan Imperium)
      mockTickets['3'], // Ziz LaSota & Emma Borhanian (Zizians)
    ],
  },
  '2': {
    id: '2',
    electionId: '2',
    jurisdictionId: '3',
    name: 'Chief Sycophant of the United States',
    isPartisan: true,
    isTicketBased: true, // Changed to ticket-based
    tickets: [
      mockTickets['1'], // Martha Stewart & Emerill Lagasse (Extremely Buttery)
      mockTickets['2'], // Joaquin Phoenix & Ariana Grande (Vegan Imperium)
      mockTickets['3'], // Ziz LaSota & Emma Borhanian (Zizians)
    ],
  },
  '3': {
    id: '3',
    electionId: '3',
    jurisdictionId: '2',
    name: 'Dogcatcher',
    isPartisan: false,
    isTicketBased: false,
    candidates: [
      mockCandidates['11'],
      mockCandidates['12'],
      mockCandidates['13'],
    ],
  },
  '4': {
    id: '4',
    electionId: '4',
    jurisdictionId: '3',
    name: 'Extremely Buttery Party Primary',
    isPartisan: true,
    isTicketBased: false,
    candidates: [
      mockCandidates['7'],
      mockCandidates['8'],
      mockCandidates['9'],
      mockCandidates['10'],
    ],
  },
};

// Question Type Data
export const mockQuestionTypes: Record<string, QuestionType> = {
  '1': {
    id: '1',
    name: 'Constitutional Amendment',
    description:
      'Amendment to the state constitution requiring supermajority approval',
    category: 'Constitutional Amendment',
    requiresSupermajority: true,
    minimumTurnoutRequired: 50, // 50% voter turnout required
  },
  '2': {
    id: '2',
    name: 'Municipal Bond Issue',
    description: 'Bond authorization for public infrastructure projects',
    category: 'Bond Issue',
    requiresSupermajority: false,
  },
  '3': {
    id: '3',
    name: 'Tax Levy',
    description: 'Authorization for new or increased tax levies',
    category: 'Tax Levy',
    requiresSupermajority: false,
  },
  '4': {
    id: '4',
    name: 'Citizen Initiative',
    description: 'Ballot measure initiated by citizen petition',
    category: 'Initiative',
    requiresSupermajority: false,
  },
  '5': {
    id: '5',
    name: 'Legislative Referendum',
    description: 'Referendum on legislation passed by the legislature',
    category: 'Referendum',
    requiresSupermajority: false,
  },
};

// Ballot Question Data
export const mockBallotQuestions: Record<string, BallotQuestion> = {
  '1': {
    id: '1',
    electionId: '3', // Updated to match the Dogcatcher election ID
    jurisdictionId: '1',
    questionTypeId: '1', // Constitutional Amendment
    shortTitle:
      'Shall the State of New Crmpshire elect its legislature via sortition among all eligible registered voters?',
    extendedText:
      'The election of the legislature for the State of New Crmpshire shall be done via sortition among all eligible registered voters at the time of each election. The legislature will be comprised of 100 registered voters, chosen randomly, and shall serve for a period of 1 year. Their annual salary shall be $150,000 per annum, with increases recalculated prior to each sortition selection to be done by the Board of Elections, based on the change to average purchasing power in the capital county of Bullton. The very first legislature shall have a session of 2 years. After 1 year, 25% of the legislature shall be replaced. Each subsequent year and election, 25% shall be replaced by another automated sortition.',
    passed: true,
    yesVotes: 3059999,
    noVotes: 1237832,
    yesPercentage: 71.2,
    noPercentage: 28.8,
  },
  '2': {
    id: '2',
    electionId: '3', // New Crmpshire General Election (county-level)
    jurisdictionId: '2', // Bullton County
    questionTypeId: '2', // Municipal Bond Issue
    shortTitle: 'Bullton County Infrastructure Bond - $125 Million',
    extendedText:
      'Shall Bullton County be authorized to issue bonds in the amount of $125 million for the purpos of vanity projects for the County Executive?',
    passed: false,
    yesVotes: 485000,
    noVotes: 520000,
    yesPercentage: 48.3,
    noPercentage: 51.7,
  },
  '3': {
    id: '3',
    electionId: '2', // Federal election (Chief Sycophant)
    jurisdictionId: '3', // Federal jurisdiction
    questionTypeId: '4', // Citizen Initiative
    shortTitle: 'National Ranked Choice Voting Initiative',
    extendedText:
      'Shall all federal elections use ranked choice voting where voters rank candidates in order of preference, and if no candidate receives a majority, the candidate with the fewest votes is eliminated and their votes redistributed until a candidate achieves a majority?',
    passed: true,
    yesVotes: 112000000,
    noVotes: 88000000,
    yesPercentage: 56.0,
    noPercentage: 44.0,
  },
};

// Contest Results Data
export const mockContestResults: Record<string, ContestResult> = {
  '1': {
    contestId: '1',
    totalVotes: 158000000,
    results: [
      {
        ticketId: '1', // Martha Stewart & Emerill Lagasse (Extremely Buttery)
        votes: 117236000,
        percentage: 74.2,
        winner: true,
      },
      {
        ticketId: '2', // Joaquin Phoenix & Ariana Grande (Vegan Imperium)
        votes: 33496000,
        percentage: 21.2,
        winner: false,
      },
      {
        ticketId: '3', // Ziz LaSota & Emma Borhanian (Zizians)
        votes: 7268000,
        percentage: 4.6,
        winner: false,
      },
    ],
  },
  '2': {
    contestId: '2',
    totalVotes: 158000000,
    results: [
      {
        ticketId: '1', // Martha Stewart & Emerill Lagasse (Extremely Buttery)
        votes: 117236000,
        percentage: 74.2,
        winner: true,
      },
      {
        ticketId: '2', // Joaquin Phoenix & Ariana Grande (Vegan Imperium)
        votes: 33496000,
        percentage: 21.2,
        winner: false,
      },
      {
        ticketId: '3', // Ziz LaSota & Emma Borhanian (Zizians)
        votes: 7268000,
        percentage: 4.6,
        winner: false,
      },
    ],
  },
  '3': {
    contestId: '3',
    totalVotes: 918084,
    results: [
      {
        candidateId: '11',
        votes: 743648,
        percentage: 81.0,
        winner: true,
      },
      {
        candidateId: '12',
        votes: 9181,
        percentage: 1.0,
        winner: false,
      },
      {
        candidateId: '13',
        votes: 165255,
        percentage: 18.0,
        winner: false,
      },
    ],
  },
  '4': {
    contestId: '4',
    totalVotes: 2400000,
    results: [
      {
        candidateId: '7',
        votes: 1032000,
        percentage: 43.0,
        winner: true,
      },
      {
        candidateId: '10',
        votes: 912000,
        percentage: 38.0,
        winner: false,
        disqualified: true,
        disqualificationReason: 'Deceased',
      },
      {
        candidateId: '9',
        votes: 312000,
        percentage: 13.0,
        winner: false,
      },
      {
        candidateId: '8',
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
    contestResults: [mockContestResults['1']], // God-Emperor contest
  },
  '2': {
    id: '2',
    electionId: '2',
    totalVotes: 158000000,
    reportingPercentage: 100,
    lastUpdated: '2024-11-06T10:30:00Z',
    contestResults: [mockContestResults['2']], // Chief Sycophant contest
    ballotQuestionResults: [
      {
        ballotQuestionId: '3',
        yesVotes: 112000000,
        noVotes: 88000000,
        yesPercentage: 56.0,
        noPercentage: 44.0,
        passed: true,
      },
    ],
  },
  '3': {
    id: '3',
    electionId: '3',
    totalVotes: 5215915, // Combined votes from ballot question and dogcatcher contest
    reportingPercentage: 100,
    lastUpdated: '2025-07-20T08:00:00Z',
    contestResults: [mockContestResults['3']],
    ballotQuestionResults: [
      {
        ballotQuestionId: '1',
        yesVotes: 3059999,
        noVotes: 1237832,
        yesPercentage: 71.2,
        noPercentage: 28.8,
        passed: true,
      },
      {
        ballotQuestionId: '2',
        yesVotes: 485000,
        noVotes: 520000,
        yesPercentage: 48.3,
        noPercentage: 51.7,
        passed: false,
      },
    ],
  },
  '4': {
    id: '4',
    electionId: '4',
    totalVotes: 2400000,
    reportingPercentage: 100,
    lastUpdated: '2024-08-07T11:15:00Z',
    contestResults: [mockContestResults['4']],
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
