import { mockTickets } from '@/lib/mockData';
import { ApiResponse, Ticket } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tickets = Object.values(mockTickets);

    const response: ApiResponse<Ticket[]> = {
      success: true,
      data: tickets,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch tickets',
      data: null,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
