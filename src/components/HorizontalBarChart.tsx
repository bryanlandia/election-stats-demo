import { Candidate, ContestResult, Party, Ticket } from '@/types';
import { Box, Paper } from '@mui/material';
import React from 'react';

// Horizontal Bar Chart Component for Election Results
interface HorizontalBarChartProps {
  contestResult: ContestResult;
  parties: Record<string, Party>;
  candidates: Record<string, Candidate>;
  tickets: Record<string, Ticket>;
  getColorForResult: (index: number, party?: Party) => string;
  formatNumber: (num: number) => string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  contestResult,
  parties,
  candidates,
  tickets,
  getColorForResult,
  formatNumber,
}) => {
  // Helper function to extract last name from full name
  const getLastName = (fullName: string): string => {
    const nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
  };

  // Sort results by vote count (descending)
  const sortedResults = [...contestResult.results].sort(
    (a, b) => b.votes - a.votes
  );

  // Find the maximum votes for scaling
  const maxVotes = Math.max(...contestResult.results.map((r) => r.votes));

  const chartHeight = sortedResults.length * 75 + 30; // Reduced from 50px to 35px per bar
  const chartWidth = 900;
  const leftMargin = 30; // Reduced from 160 to 120
  const rightMargin = 30; // Reduced from 40 to 30
  const barHeight = 20; // Reduced from 32 to 18 (about half)
  const barSpacing = 8; // Reduced from 18 to 17
  const availableWidth = chartWidth - leftMargin - rightMargin;

  return (
    <Paper sx={{ p: 2, mb: 1, backgroundColor: 'background.paper' }}>
      {' '}
      {/* Reduced padding from 3 to 2, margin from 2 to 1 */}
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <svg
          width={chartWidth}
          height={chartHeight}
          style={{ maxWidth: '100%' }}
        >
          {/* Chart background */}
          <rect
            x={0}
            y={0}
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
          />

          {/* Bars and labels */}
          {sortedResults.map((result, index) => {
            let displayName = '';
            let fullName = '';
            let party: Party | undefined;
            let partyAbbrev = '';

            if (result.ticketId && tickets[result.ticketId]) {
              const ticket = tickets[result.ticketId];
              displayName = ticket.candidates
                .map((c) => getLastName(c.name))
                .join(' & ');
              fullName = ticket.candidates.map((c) => c.name).join(' & ');
              party = ticket.partyId ? parties[ticket.partyId] : undefined;
              partyAbbrev = party ? ` (${party.name.charAt(0)})` : '';
            } else if (result.candidateId && candidates[result.candidateId]) {
              const candidate = candidates[result.candidateId];
              displayName = getLastName(candidate.name);
              fullName = candidate.name;
              party = candidate.partyId
                ? parties[candidate.partyId]
                : undefined;
              partyAbbrev = party ? ` (${party.name.charAt(0)})` : '';
            }

            const color = getColorForResult(index, party);
            const barWidth = (result.votes / maxVotes) * availableWidth;
            const y = 25 + index * (barHeight + barSpacing); // Reduced top padding from 30 to 25
            const isWinner = result.winner;

            return (
              <g key={result.ticketId || result.candidateId}>
                {/* Candidate name */}
                <text
                  x={leftMargin - 8} // Reduced from -10 to -8
                  y={y + barHeight / 2 + 1} // Adjusted vertical alignment
                  textAnchor="end"
                  fontSize="13" // Reduced from 14 to 13
                  fontWeight={isWinner ? 'bold' : 'normal'}
                  fill="#333"
                >
                  <title>{fullName}</title>
                  {displayName.length > 16 // Reduced from 20 to 16 for tighter fit
                    ? `${displayName.substring(0, 16)}...`
                    : displayName}
                </text>

                {/* Party abbreviation */}
                {partyAbbrev && (
                  <text
                    x={leftMargin - 8} // Reduced from -10 to -8
                    y={y + barHeight / 2 + 13} // Reduced spacing from 16 to 13
                    textAnchor="end"
                    fontSize="10" // Reduced from 11 to 10
                    fill="#666"
                  >
                    <title>{party?.name}</title>
                    {partyAbbrev}
                  </text>
                )}

                {/* Bar background */}
                <rect
                  x={leftMargin}
                  y={y}
                  width={availableWidth}
                  height={barHeight}
                  fill="#f5f5f5"
                  stroke="#e0e0e0"
                  strokeWidth="1"
                  rx="4"
                />

                {/* Vote bar */}
                <rect
                  x={leftMargin}
                  y={y}
                  width={Math.max(barWidth, 2)} // Minimum width for visibility
                  height={barHeight}
                  fill={color}
                  opacity={isWinner ? '1' : '0.8'}
                  rx="4"
                />

                {/* Vote count text */}
                <text
                  x={leftMargin + Math.max(barWidth / 2, 25)} // Reduced from 30 to 25
                  y={y + barHeight / 2 + 1} // Adjusted vertical alignment
                  textAnchor="left"
                  fontSize="12" // Reduced from 13 to 12
                  fontWeight="600"
                  fill={barWidth > 60 ? 'white' : '#333'} // Reduced threshold from 80 to 60
                >
                  {formatNumber(result.votes)}
                </text>

                {/* Percentage text */}
                <text
                  x={leftMargin + Math.max(barWidth / 2, 25)} // Reduced from 30 to 25
                  y={y + barHeight / 2 + 12} // Reduced spacing from 16 to 12
                  textAnchor="left"
                  fontSize="10" // Reduced from 11 to 10
                  fontWeight="500"
                  fill={barWidth > 60 ? 'rgba(255,255,255,0.9)' : '#666'} // Reduced threshold from 80 to 60
                >
                  {result.percentage}%
                </text>

                {/* Winner checkmark */}
                {isWinner && (
                  <g>
                    <circle
                      cx={leftMargin + barWidth - 12} // Reduced from -15 to -12
                      cy={y + barHeight / 2}
                      r="8" // Reduced from 10 to 8
                      fill="white"
                      stroke={color}
                      strokeWidth="2"
                    />
                    <path
                      d={`M ${leftMargin + barWidth - 15} ${y + barHeight / 2} 
                         L ${leftMargin + barWidth - 12} ${y + barHeight / 2 + 3} 
                         L ${leftMargin + barWidth - 9} ${y + barHeight / 2 - 3}`} // Adjusted for smaller checkmark
                      stroke={color}
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

                {/* Disqualified indicator */}
                {result.disqualified && (
                  <text
                    x={leftMargin + availableWidth + 5}
                    y={y + barHeight / 2 + 2}
                    fontSize="10"
                    fill="#f44336"
                    fontWeight="bold"
                  >
                    DQ
                  </text>
                )}
              </g>
            );
          })}

          {/* Chart title area */}
          <text
            x={leftMargin + availableWidth / 2}
            y={chartHeight - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            Total Ballots: {formatNumber(contestResult.totalVotes)}
          </text>
        </svg>
      </Box>
      
    </Paper>
  );
};

export default HorizontalBarChart;
