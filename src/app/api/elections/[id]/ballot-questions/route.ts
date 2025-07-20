import { mockBallotQuestions } from '@/lib/mockData';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const electionId = id;
    const ballotQuestions = Object.values(mockBallotQuestions).filter(
      (question) => question.electionId === electionId
    );

    return NextResponse.json({
      success: true,
      data: ballotQuestions,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch ballot questions' },
      { status: 500 }
    );
  }
}
