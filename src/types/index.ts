export interface Election {
  id: string;
  name: string;
  date: string;
  type: 'presidential' | 'congressional' | 'local' | 'referendum';
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  color?: string;
}

export interface ElectionResult {
  id: string;
  electionId: string;
  candidates: Candidate[];
  totalVotes: number;
  reportingPercentage: number;
  lastUpdated: string;
}

export interface DemographicData {
  category: string;
  subcategory: string;
  votes: number;
  percentage: number;
}

export interface VotingTrend {
  year: number;
  turnout: number;
  totalEligibleVoters: number;
  totalVotes: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
