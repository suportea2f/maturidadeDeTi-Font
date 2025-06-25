import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  useTheme,
} from '@mui/material';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
}) => {
  const theme = useTheme();
  const progress = (current / total) * 100;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {label || 'Progresso'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {current} de {total}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: theme.palette.grey[200],
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            bgcolor: theme.palette.primary.main,
          },
        }}
      />
    </Box>
  );
}; 