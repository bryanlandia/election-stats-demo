import { NextResponse } from 'next/server';
import { mockContests } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const electionId = params.id;
    const contests = Object.values(mockContests).filter(
      contest => contest.electionId === electionId
    );
    
    return NextResponse.json({
      success: true,
      data: contests
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contests' },
      { status: 500 }
    );
  }
}
