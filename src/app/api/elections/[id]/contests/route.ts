import { mockContests } from '@/lib/mockData';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const electionId = id;
    const contests = Object.values(mockContests).filter(
      (contest) => contest.electionId === electionId
    );

    return NextResponse.json({
      success: true,
      data: contests,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contests' },
      { status: 500 }
    );
  }
}
