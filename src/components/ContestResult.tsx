import {
  Candidate,
  Contest,
  ContestResult as ContestResultType,
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

interface ContestResultProps {
  contest: Contest;
  election: Election;
  office?: Office;
  jurisdiction?: Jurisdiction;
  contestResult?: ContestResultType;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  parties: Record<string, Party>;
  candidates: Record<string, Candidate>;
  tickets: Record<string, Ticket>;
  getColorForResult: (index: number, party?: Party) => string;
  formatNumber: (num: number) => string;
}

export const ContestResult: React.FC<ContestResultProps> = ({
  contest,
  election,
  office,
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
  // extra info about the office
  const infoContent = office && (
    <>
      <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 1 }}>
        Office: {office.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {office.description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        <Chip
          label={office.isElected ? 'Elected Position' : 'Appointed Position'}
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
    </>
  );

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

  return (
    <ElectionResultCard
      electionName={election?.name}
      electionDate={election?.date}
      additionalInfo={office?.name}
      title={contest.name}
      subtitle={`${jurisdiction?.name || 'Unknown'} — ${contest.isPartisan ? 'Partisan' : 'Non-partisan'}`}
      showInfoToggle={!!office}
      onInfoToggle={onToggleExpanded}
      infoExpanded={isExpanded}
      infoContent={infoContent}
    >
      {chartContent}
    </ElectionResultCard>
  );
};

export default ContestResult;
