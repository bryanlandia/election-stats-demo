import { mockQuestionTypes } from '@/lib/mockData';
import { ApiResponse, QuestionType } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const questionTypes = Object.values(mockQuestionTypes);

    const response: ApiResponse<QuestionType[]> = {
      success: true,
      data: questionTypes,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch question types',
      data: null,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
