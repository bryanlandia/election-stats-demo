import { NextResponse } from 'next/server';
import { mockElections } from '@/lib/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: Object.values(mockElections),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch elections' },
      { status: 500 }
    );
  }
}
