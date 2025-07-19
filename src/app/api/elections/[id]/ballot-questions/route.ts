import { NextResponse } from 'next/server';
import { mockBallotQuestions } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const electionId = params.id;
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
