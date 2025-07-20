import { mockContests } from '@/lib/mockData';
import { ApiResponse, Contest } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse<Contest[]>>> {
  try {
    const contests = Object.values(mockContests);

    return NextResponse.json({
      success: true,
      data: contests,
      message: `Found ${contests.length} contests`,
    });
  } catch (_error) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: 'Failed to fetch contests',
      },
      { status: 500 }
    );
  }
}
