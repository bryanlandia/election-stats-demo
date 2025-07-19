import { mockParties } from '@/lib/mockData';
import { ApiResponse, Party } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const parties = Object.values(mockParties);
    
    const response: ApiResponse<Party[]> = {
      success: true,
      data: parties,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch parties',
      data: null,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
