import { Contestant, ContestResult, Party, Ticket } from '@/types';
import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

// Horizontal Bar Chart Component for Election Results
interface HorizontalBarChartProps {
  contestResult: ContestResult;
  parties: Record<string, Party>;
  contestants: Record<string, Contestant>;
  tickets: Record<string, Ticket>;
  getColorForResult: (index: number, party?: Party) => string;
  formatNumber: (num: number) => string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  contestResult,
  parties,
  contestants,
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

  const chartHeight = sortedResults.length * 70 + 40; // 70px per bar + padding
  const chartWidth = 900; // Increased from 600 to utilize full width without sidebar
  const leftMargin = 160; // Space for candidate names
  const rightMargin = 40;
  const barHeight = 45;
  const barSpacing = 25;
  const availableWidth = chartWidth - leftMargin - rightMargin;

  return (
    <Paper sx={{ p: 3, mb: 2, backgroundColor: 'background.paper' }}>
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <svg
          width={chartWidth}
          height={chartHeight}
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Chart background */}
          <rect
            x={0}
            y={0}
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
          />

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const x = leftMargin + availableWidth * fraction;
            return (
              <g key={fraction}>
                <line
                  x1={x}
                  y1={20}
                  x2={x}
                  y2={chartHeight - 20}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                  strokeDasharray={
                    fraction === 0 || fraction === 1 ? 'none' : '2,2'
                  }
                />
                <text
                  x={x}
                  y={15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {formatNumber(Math.round(maxVotes * fraction))}
                </text>
              </g>
            );
          })}

          {/* Bars and labels */}
          {sortedResults.map((result, index) => {
            let displayName = '';
            let fullName = '';
            let party: Party | undefined;
            let partyAbbrev = '';

            if (result.ticketId && tickets[result.ticketId]) {
              const ticket = tickets[result.ticketId];
              displayName = ticket.contestants
                .map((c) => getLastName(c.name))
                .join(' & ');
              fullName = ticket.contestants.map((c) => c.name).join(' & ');
              party = ticket.partyId ? parties[ticket.partyId] : undefined;
              partyAbbrev = party ? ` (${party.name.charAt(0)})` : '';
            } else if (
              result.contestantId &&
              contestants[result.contestantId]
            ) {
              const contestant = contestants[result.contestantId];
              displayName = getLastName(contestant.name);
              fullName = contestant.name;
              party = contestant.partyId
                ? parties[contestant.partyId]
                : undefined;
              partyAbbrev = party ? ` (${party.name.charAt(0)})` : '';
            }

            const color = getColorForResult(index, party);
            const barWidth = (result.votes / maxVotes) * availableWidth;
            const y = 30 + index * (barHeight + barSpacing);
            const isWinner = result.winner;

            return (
              <g key={result.ticketId || result.contestantId}>
                {/* Candidate name */}
                <text
                  x={leftMargin - 10}
                  y={y + barHeight / 2 + 2}
                  textAnchor="end"
                  fontSize="14"
                  fontWeight={isWinner ? 'bold' : 'normal'}
                  fill="#333"
                >
                  <title>{fullName}</title>
                  {displayName.length > 20
                    ? `${displayName.substring(0, 20)}...`
                    : displayName}
                </text>

                {/* Party abbreviation */}
                {partyAbbrev && (
                  <text
                    x={leftMargin - 10}
                    y={y + barHeight / 2 + 16}
                    textAnchor="end"
                    fontSize="11"
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
                  x={leftMargin + Math.max(barWidth / 2, 30)}
                  y={y + barHeight / 2 + 2}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill={barWidth > 80 ? 'white' : '#333'}
                >
                  {formatNumber(result.votes)}
                </text>

                {/* Percentage text */}
                <text
                  x={leftMargin + Math.max(barWidth / 2, 30)}
                  y={y + barHeight / 2 + 16}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="500"
                  fill={barWidth > 80 ? 'rgba(255,255,255,0.9)' : '#666'}
                >
                  {result.percentage}%
                </text>

                {/* Winner checkmark */}
                {isWinner && (
                  <g>
                    <circle
                      cx={leftMargin + barWidth - 15}
                      cy={y + barHeight / 2}
                      r="10"
                      fill="white"
                      stroke={color}
                      strokeWidth="2"
                    />
                    <path
                      d={`M ${leftMargin + barWidth - 19} ${y + barHeight / 2} 
                         L ${leftMargin + barWidth - 15} ${y + barHeight / 2 + 4} 
                         L ${leftMargin + barWidth - 11} ${y + barHeight / 2 - 4}`}
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
            Total Votes: {formatNumber(contestResult.totalVotes)}
          </text>
        </svg>
      </Box>

      {/* Legend for disqualified candidates */}
      {sortedResults.some((r) => r.disqualified) && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>DQ</strong> = Disqualified
            {sortedResults
              .filter((r) => r.disqualified)
              .map((r) => {
                let displayName = '';
                let fullName = '';
                if (r.ticketId && tickets[r.ticketId]) {
                  displayName = tickets[r.ticketId].contestants
                    .map((c) => getLastName(c.name))
                    .join(' & ');
                  fullName = tickets[r.ticketId].contestants
                    .map((c) => c.name)
                    .join(' & ');
                } else if (r.contestantId && contestants[r.contestantId]) {
                  displayName = getLastName(contestants[r.contestantId].name);
                  fullName = contestants[r.contestantId].name;
                }
                return (
                  <span key={r.ticketId || r.contestantId} title={fullName}>
                    {' • '}
                    {displayName}: {r.disqualificationReason}
                  </span>
                );
              })}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default HorizontalBarChart;
