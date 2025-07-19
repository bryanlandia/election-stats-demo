import { legacyMockResults, mockElectionResults } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const electionId = params.id;
    
    // First try to get the new data structure
    let result = mockElectionResults[electionId];
    
    // Fall back to legacy format for backward compatibility
    if (!result) {
      result = legacyMockResults[electionId];
    }
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Election results not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch election results' },
      { status: 500 }
    );
  }
}
