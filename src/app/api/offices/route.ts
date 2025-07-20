import { mockOffices } from '@/lib/mockData';
import { ApiResponse, Office } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const offices = Object.values(mockOffices);

    const response: ApiResponse<Office[]> = {
      success: true,
      data: offices,
    };

    return NextResponse.json(response);
  } catch (_error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch offices',
      data: null,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
