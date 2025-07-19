const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export async function fetchElections() {
  const response = await fetch(`${API_BASE_URL}/elections`);
  if (!response.ok) {
    throw new Error('Failed to fetch elections');
  }
  return response.json();
}

export async function fetchElectionResults(electionId: string) {
  const response = await fetch(
    `${API_BASE_URL}/elections/${electionId}/results`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch election results');
  }
  return response.json();
}

export async function fetchDemographics(electionId: string) {
  const response = await fetch(
    `${API_BASE_URL}/elections/${electionId}/demographics`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch demographics');
  }
  return response.json();
}
