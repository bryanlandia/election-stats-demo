import { NextResponse } from 'next/server';
import { mockJurisdictions } from '@/lib/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: Object.values(mockJurisdictions),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jurisdictions' },
      { status: 500 }
    );
  }
}
