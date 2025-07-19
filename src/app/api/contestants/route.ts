import { mockContestants } from '@/lib/mockData';
import { ApiResponse, Contestant } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const contestants = Object.values(mockContestants);

    const response: ApiResponse<Contestant[]> = {
      success: true,
      data: contestants,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch contestants',
      data: null,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
