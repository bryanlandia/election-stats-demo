import { Candidate, ContestResult, Party, Ticket } from '@/types';
import { NON_PARTISAN_COLORS } from '@/utils';
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

  // Calculate the longest display name to determine left margin
  const getDisplayName = (result: any) => {
    if (result.ticketId && tickets[result.ticketId]) {
      const ticket = tickets[result.ticketId];
      return ticket.candidates.map((c) => getLastName(c.name)).join(' & ');
    } else if (result.candidateId && candidates[result.candidateId]) {
      const candidate = candidates[result.candidateId];
      return getLastName(candidate.name);
    }
    return '';
  };

  const longestName = sortedResults.reduce((longest, result) => {
    const displayName = getDisplayName(result);
    return displayName.length > longest.length ? displayName : longest;
  }, '');

  // get the left margin based on the longest name with a max
  const maxNameLength = Math.min(longestName.length, 15);
  const calculatedLeftMargin = Math.max(maxNameLength * 8 + 8, 0);

  //get max width needed for vote count text that appears outside bars
  const maxVoteCount = Math.max(...sortedResults.map((r) => r.votes));
  const maxVoteCountText = formatNumber(maxVoteCount);
  const maxVoteCountWidth = maxVoteCountText.length * 8;

  const chartHeight = sortedResults.length * 75 + 30;
  const leftMargin = calculatedLeftMargin;
  const rightMargin = Math.max(maxVoteCountWidth + 20, 80);
  const barHeight = 20;
  const barSpacing = 8;

  // Use a responsive width that fits the container
  const baseChartWidth = 400;
  const totalMargins = leftMargin + rightMargin;
  const chartWidth = Math.max(baseChartWidth, totalMargins + 150);
  const availableWidth = chartWidth - totalMargins;

  return (
    <Paper
      elevation={0}
      sx={{
        pr: 1,
        mb: 1,
        backgroundColor: 'background.paper',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <svg
          width={Math.min(chartWidth, 450)}
          height={chartHeight}
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          <rect
            x={0}
            y={0}
            width={chartWidth}
            height={chartHeight}
            fill="transparent"
          />

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

            const allPartiesInContest = sortedResults
              .map((r) => {
                if (r.ticketId && tickets[r.ticketId]) {
                  return tickets[r.ticketId].partyId;
                } else if (r.candidateId && candidates[r.candidateId]) {
                  return candidates[r.candidateId].partyId;
                }
                return null;
              })
              .filter(Boolean);

            const uniqueParties = Array.from(new Set(allPartiesInContest));
            const isPrimaryContest = uniqueParties.length === 1 && party;

            // is this a ballot question?
            const isBallotQuestion =
              contestResult.contestId.startsWith('ballot-');

            // is it non-partisan contest?
            const isNonPartisan =
              allPartiesInContest.length === 0 && !isBallotQuestion;

            let color: string;
            let isDarkColor = false;

            if (isNonPartisan) {
              color =
                NON_PARTISAN_COLORS[
                  Math.min(index, NON_PARTISAN_COLORS.length - 1)
                ];
              isDarkColor = index <= 1;
            } else if (isPrimaryContest) {
              const isWinner = result.winner;
              if (isWinner) {
                // undiluted party color for winner
                color = getColorForResult(0, party);
                isDarkColor = false;
              } else {
                // diluted party color for losers
                const baseColor = getColorForResult(0, party);
                // mix in black
                const tintLevel = Math.min(index * 20 + 20, 80);
                color = `color-mix(in srgb, ${baseColor} ${100 - tintLevel}%, black ${tintLevel}%)`;
                isDarkColor = tintLevel >= 40;
              }
            } else {
              color = getColorForResult(index, party);
              isDarkColor = false;
            }
            const barWidth = (result.votes / maxVotes) * availableWidth;
            const y = 25 + index * (barHeight + barSpacing);
            const isWinner = result.winner;

            return (
              <g key={result.ticketId || result.candidateId}>
                {/* Candidate name */}
                <text
                  x={leftMargin - 8}
                  y={y + barHeight / 2 + 1}
                  textAnchor="end"
                  fontSize="13"
                  fontWeight={isWinner ? 'bold' : 'normal'}
                  fill="#333"
                >
                  <title>{fullName}</title>
                  {/* Truncate with elliposis if it's longer than 15 chars */}
                  {displayName.length > 15
                    ? `${displayName.substring(0, 15)}...`
                    : displayName}
                </text>

                {partyAbbrev && (
                  <text
                    x={leftMargin - 8}
                    y={y + barHeight / 2 + 13}
                    textAnchor="end"
                    fontSize="10"
                    fill="#666"
                  >
                    <title>{party?.name}</title>
                    {partyAbbrev}
                  </text>
                )}

                <rect
                  x={leftMargin}
                  y={y}
                  width={availableWidth}
                  height={barHeight}
                  fill="transparent"
                />

                <line
                  x1={leftMargin}
                  y1={y}
                  x2={leftMargin}
                  y2={y + barHeight}
                  stroke="#666"
                  strokeWidth="1"
                />

                <rect
                  x={leftMargin}
                  y={y}
                  width={Math.max(barWidth, 2)} // Minimum width for visibility
                  height={barHeight}
                  fill={color}
                  opacity={isWinner ? '1' : '0.8'}
                />

                {/* Vote count tex is right-aligned, inside bar if enough width otherwise , outside if not */}
                <text
                  x={
                    barWidth > 80
                      ? leftMargin + barWidth - 9
                      : leftMargin + barWidth + 8
                  }
                  y={y + barHeight / 2 + 4}
                  textAnchor={barWidth > 80 ? 'end' : 'start'}
                  fontSize="13"
                  fontWeight={isWinner ? 'bold' : '600'}
                  fill={
                    barWidth > 80 ? (isDarkColor ? 'white' : 'white') : '#333'
                  }
                >
                  {formatNumber(result.votes)}
                </text>

                {/* winner checkmark */}
                {isWinner && (
                  <text
                    x={leftMargin + 12}
                    y={y + barHeight / 2 + 4}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#000"
                  >
                    ✓
                  </text>
                )}
              </g>
            );
          })}

          <text
            x={0}
            y={chartHeight - 10}
            fontSize="12"
            fontWeight="bold"
            fill="#333"
          >
            {formatNumber(contestResult.totalVotes)} Total Ballots
          </text>
        </svg>
      </Box>
    </Paper>
  );
};

export default HorizontalBarChart;
