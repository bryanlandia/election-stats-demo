import { mockCandidates } from '@/lib/mockData';
import { ApiResponse, Candidate } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const candidates = Object.values(mockCandidates);

    const response: ApiResponse<Candidate[]> = {
      success: true,
      data: candidates,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch candidates',
      data: null,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
