import {
  BallotQuestion,
  ContestResult,
  Election,
  Jurisdiction,
  QuestionType,
} from '@/types';
import { BALLOT_QUESTION_COLORS } from '@/utils';
import { Box, Typography } from '@mui/material';
import React from 'react';
import ElectionResultCard from './ElectionResultCard';
import HorizontalBarChart from './HorizontalBarChart';

interface BallotQuestionResultProps {
  question: BallotQuestion;
  election: Election;
  jurisdiction?: Jurisdiction;
  questionType?: QuestionType;
  ballotResult?: any;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  formatNumber: (num: number) => string;
}

export const BallotQuestionResult: React.FC<BallotQuestionResultProps> = ({
  question,
  election,
  jurisdiction,
  questionType,
  ballotResult,
  isExpanded,
  onToggleExpanded,
  formatNumber,
}) => {
  // extended text info
  const infoContent = (
    <Typography variant="body2" color="text.secondary">
      {question.extendedText}
    </Typography>
  );

  // only show truncated if info button not clicked to expand
  const truncatedText = !isExpanded && (
    <Typography
      variant="body2"
      color="text.secondary"
      gutterBottom
      sx={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        mb: 2,
      }}
    >
      {question.extendedText}
    </Typography>
  );

  // Ballot Questions are set up as if the questions are candidates
  const chartContent = ballotResult ? (
    (() => {
      const mockContestResult: ContestResult = {
        contestId: `ballot-${question.id}`,
        totalVotes: ballotResult.yesVotes + ballotResult.noVotes,
        results: [
          {
            candidateId: 'yes',
            votes: ballotResult.yesVotes,
            percentage: ballotResult.yesPercentage,
            winner: ballotResult.passed,
          },
          {
            candidateId: 'no',
            votes: ballotResult.noVotes,
            percentage: ballotResult.noPercentage,
            winner: !ballotResult.passed,
          },
        ],
      };

      const mockCandidatesForBallot = {
        yes: { id: 'yes', name: 'Yes' },
        no: { id: 'no', name: 'No' },
      };

      const getBallotQuestionColor = (index: number) => {
        return index === 0
          ? BALLOT_QUESTION_COLORS.YES
          : BALLOT_QUESTION_COLORS.NO;
      };

      return (
        <HorizontalBarChart
          contestResult={mockContestResult}
          parties={{}}
          candidates={mockCandidatesForBallot}
          tickets={{}}
          getColorForResult={getBallotQuestionColor}
          formatNumber={formatNumber}
        />
      );
    })()
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
        No results data available for this ballot question
      </Typography>
    </Box>
  );

  return (
    <ElectionResultCard
      electionName={election?.name}
      electionDate={election?.date}
      additionalInfo={questionType?.name}
      title={question.shortTitle}
      subtitle={`${jurisdiction?.name || 'Unknown'} — ${question.passed ? 'Passed' : 'Failed'}`}
      showInfoToggle={true}
      onInfoToggle={onToggleExpanded}
      infoExpanded={isExpanded}
      infoContent={infoContent}
    >
      {truncatedText}
      {chartContent}
    </ElectionResultCard>
  );
};

export default BallotQuestionResult;
