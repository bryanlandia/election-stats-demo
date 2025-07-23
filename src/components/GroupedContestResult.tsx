import {
  Candidate,
  Contest,
  ContestResult,
  Election,
  Jurisdiction,
  Office,
  Party,
  Ticket,
} from '@/types';
import { Box, Chip, Typography } from '@mui/material';
import React from 'react';
import ElectionResultCard from './ElectionResultCard';
import HorizontalBarChart from './HorizontalBarChart';

interface GroupedContestResultProps {
  contests: Contest[];
  elections: Election[];
  groupOffices: Office[];
  jurisdiction?: Jurisdiction;
  contestResult?: ContestResult;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  parties: Record<string, Party>;
  candidates: Record<string, Candidate>;
  tickets: Record<string, Ticket>;
  getColorForResult: (index: number, party?: Party) => string;
  formatNumber: (num: number) => string;
  groupKey?: string;
}

export const GroupedContestResult: React.FC<GroupedContestResultProps> = ({
  contests,
  elections,
  groupOffices,
  jurisdiction,
  contestResult,
  isExpanded,
  onToggleExpanded,
  parties,
  candidates,
  tickets,
  getColorForResult,
  formatNumber,
}) => {
  const primaryElection = elections[0]; // Use first election for shared data

  // Create info content for office details
  const infoContent = (
    <Box>
      {contests.map((contest, index) => {
        const office = groupOffices.find(
          (o) => o.id === elections[index]?.officeId
        );
        if (!office) return null;

        return (
          <Box
            key={contest.id}
            sx={{
              mb: index < contests.length - 1 ? 2 : 0,
            }}
          >
            <Typography
              variant="subtitle1"
              color="primary"
              gutterBottom
              sx={{ mb: 1 }}
            >
              {office.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {office.description}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                label={
                  office.isElected ? 'Elected Position' : 'Appointed Position'
                }
                color="primary"
                variant="outlined"
                size="small"
              />
              {office.termLength && (
                <Chip
                  label={`${office.termLength} year term`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              )}
              {office.maxTerms && (
                <Chip
                  label={`Max ${office.maxTerms} terms`}
                  color="default"
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );

  // Create chart content
  const chartContent = contestResult ? (
    <HorizontalBarChart
      contestResult={contestResult}
      parties={parties}
      candidates={candidates}
      tickets={tickets}
      getColorForResult={getColorForResult}
      formatNumber={formatNumber}
    />
  ) : (
    <Box
      sx={{
        p: 3,
        textAlign: 'center',
        bgcolor: '#f5f5f5',
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        No results data available for this contest
      </Typography>
    </Box>
  );

  {
    /* TODO: don't hard-code the god-emperor and chief sycophant as  election title */
  }
  return (
    <ElectionResultCard
      electionName={primaryElection?.name?.replace(
        / - (God-Emperor|Chief Sycophant)/,
        ''
      )}
      electionDate={primaryElection?.date}
      additionalInfo="Presidential Election"
      title="God-Emperor and Chief Sycophant"
      subtitle={`${jurisdiction?.name || 'Unknown'} — Partisan Ticket`}
      showInfoToggle={true}
      onInfoToggle={onToggleExpanded}
      infoExpanded={isExpanded}
      infoContent={infoContent}
    >
      {chartContent}
    </ElectionResultCard>
  );
};

export default GroupedContestResult;
