import { mockElections } from '@/lib/mockData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: Object.values(mockElections),
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch elections' },
      { status: 500 }
    );
  }
}
