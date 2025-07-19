// Tenant and Jurisdiction Models
export interface Tenant {
  id: string;
  name: string;
  jurisdictionId: string;
}

export interface Jurisdiction {
  id: string;
  name: string;
  registeredVoters: number;
  parentJurisdictionId?: string;
  partisanContestTypes: string[];
  nonPartisanContestTypes: string[];
}

// Party and Political Models
export interface Party {
  id: string;
  name: string;
  color: string;
}

export interface Contestant {
  id: string;
  name: string;
  partyId?: string;
  position?: string; // For tickets (e.g., "God-Emperor", "Chief Sycophant")
}

export interface Ticket {
  id: string;
  partyId?: string;
  contestants: Contestant[];
}

// Election Models
export type ElectionStage =
  | 'Just Shopping'
  | 'Extremely Buttery Party Primary'
  | 'Vegan Imperium Party Primary'
  | 'General Election';

export interface Election {
  id: string;
  name: string;
  date: string;
  stage: ElectionStage;
  jurisdictionId: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Contest {
  id: string;
  electionId: string;
  jurisdictionId: string;
  name: string;
  isPartisan: boolean;
  isTicketBased: boolean; // true for tickets, false for single contestants
  tickets?: Ticket[];
  contestants?: Contestant[];
}

export interface BallotQuestion {
  id: string;
  electionId: string;
  jurisdictionId: string;
  shortTitle: string;
  extendedText: string;
  passed: boolean;
  yesVotes: number;
  noVotes: number;
  yesPercentage: number;
  noPercentage: number;
}

// Results Models
export interface ContestResult {
  contestId: string;
  totalVotes: number;
  results: Array<{
    ticketId?: string;
    contestantId?: string;
    votes: number;
    percentage: number;
    winner: boolean;
    disqualified?: boolean;
    disqualificationReason?: string;
  }>;
}

export interface ElectionResult {
  id: string;
  electionId: string;
  totalVotes: number;
  reportingPercentage: number;
  lastUpdated: string;
  contestResults: ContestResult[];
  ballotQuestionResults?: Array<{
    ballotQuestionId: string;
    yesVotes: number;
    noVotes: number;
    yesPercentage: number;
    noPercentage: number;
    passed: boolean;
  }>;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
