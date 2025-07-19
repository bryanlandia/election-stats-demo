import { NextResponse } from 'next/server';
import { Election } from '@/types';

// Mock data - in a real app, this would come from a database
const mockElections: Election[] = [
  {
    id: '1',
    name: '2024 Presidential Election',
    date: '2024-11-05',
    type: 'presidential',
    status: 'completed'
  },
  {
    id: '2', 
    name: '2024 Congressional Elections',
    date: '2024-11-05',
    type: 'congressional',
    status: 'completed'
  },
  {
    id: '3',
    name: '2025 Local Elections',
    date: '2025-11-04',
    type: 'local',
    status: 'upcoming'
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockElections
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch elections' },
      { status: 500 }
    );
  }
}
