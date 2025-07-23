import { formatDate } from '@/utils';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ReactNode } from 'react';

interface ElectionResultCardProps {
  electionName?: string;
  electionDate?: string;
  additionalInfo?: string;
  title: string;
  subtitle: string;
  showInfoToggle?: boolean;
  onInfoToggle?: () => void;
  infoExpanded?: boolean;
  infoContent?: ReactNode;
  children: ReactNode;
}

export const ElectionResultCard: React.FC<ElectionResultCardProps> = ({
  electionName,
  electionDate,
  additionalInfo,
  title,
  subtitle,
  showInfoToggle = false,
  onInfoToggle,
  infoExpanded = false,
  infoContent,
  children,
}) => {
  return (
    <Grid size={{ xs: 12, md: 6, xl: 4 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Election info above title */}
          {(electionName || electionDate || additionalInfo) && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: 'block' }}
            >
              {electionName && electionName}
              {electionDate && (
                <>
                  {electionName && ' • '}
                  {formatDate(electionDate)}
                </>
              )}
              {additionalInfo && (
                <>
                  {(electionName || electionDate) && ' • '}
                  {additionalInfo}
                </>
              )}
            </Typography>
          )}

          {/* Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="h6" component="h4" sx={{ flex: 1 }}>
              {title}
            </Typography>

            {showInfoToggle && onInfoToggle && (
              <IconButton
                size="small"
                onClick={onInfoToggle}
                sx={{
                  color: 'primary.main',
                  p: 0.5,
                }}
              >
                <InfoIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Info content with toggle */}
          {infoExpanded && infoContent && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
              }}
            >
              {infoContent}
            </Box>
          )}

          {/* Subtitle */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>

          {/*children main content */}
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ElectionResultCard;
