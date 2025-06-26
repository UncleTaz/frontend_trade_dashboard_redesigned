import React from 'react';
import { Paper, CircularProgress, Box } from '@mui/material';
import { ProgressiveParagraph } from '../ProgressiveParagraph/ProgressiveParagraph';
import { useAboutContent } from '../../hooks/useAboutContent';

const PARAGRAPH_DELAY = 150; // milliseconds between each paragraph appearing

export const AboutContent: React.FC = () => {
  const { paragraphs, isLoading } = useAboutContent();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2, mx: 'auto', maxWidth: '1200px' }}>
      {paragraphs.map((text, index) => (
        <ProgressiveParagraph
          key={index}
          text={text}
          delay={PARAGRAPH_DELAY}
          index={index}
        />
      ))}
    </Paper>
  );
};
