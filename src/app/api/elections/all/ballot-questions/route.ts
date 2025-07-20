import { mockBallotQuestions } from '@/lib/mockData';
import { ApiResponse, BallotQuestion } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<
  NextResponse<ApiResponse<BallotQuestion[]>>
> {
  try {
    const ballotQuestions = Object.values(mockBallotQuestions);

    return NextResponse.json({
      success: true,
      data: ballotQuestions,
      message: `Found ${ballotQuestions.length} ballot questions`,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: 'Failed to fetch ballot questions',
      },
      { status: 500 }
    );
  }
}
