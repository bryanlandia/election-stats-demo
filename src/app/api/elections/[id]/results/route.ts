import { mockElectionResults } from '@/lib/mockData';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const electionId = id;

    // First try to get the new data structure
    const result = mockElectionResults[electionId];

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Election results not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch election results' },
      { status: 500 }
    );
  }
}
