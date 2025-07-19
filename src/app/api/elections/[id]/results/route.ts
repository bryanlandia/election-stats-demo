import { ElectionResult } from '@/types';
import { NextResponse } from 'next/server';

const mockResults: Record<string, ElectionResult> = {
  '1': {
    id: '1',
    electionId: '1',
    totalVotes: 158000000,
    reportingPercentage: 100,
    lastUpdated: '2024-11-06T10:30:00Z',
    candidates: [
      {
        id: '1',
        name: 'Candidate A',
        party: 'Democratic',
        votes: 81000000,
        percentage: 51.3,
        color: '#2563eb'
      },
      {
        id: '2', 
        name: 'Candidate B',
        party: 'Republican',
        votes: 74000000,
        percentage: 46.8,
        color: '#dc2626'
      },
      {
        id: '3',
        name: 'Other Candidates',
        party: 'Independent',
        votes: 3000000,
        percentage: 1.9,
        color: '#059669'
      }
    ]
  }
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const electionId = params.id;
    const result = mockResults[electionId];
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Election results not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch election results' },
      { status: 500 }
    );
  }
}
