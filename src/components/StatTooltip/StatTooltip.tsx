import React from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';

interface StatTooltipProps {
  title: string;
  children: React.ReactElement;
}

export const StatTooltip: React.FC<StatTooltipProps> = ({ title, children }) => {
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="body2">{title}</Typography>
        </Box>
      }
      arrow
      placement="top"
    >
      {children}
    </Tooltip>
  );
};
