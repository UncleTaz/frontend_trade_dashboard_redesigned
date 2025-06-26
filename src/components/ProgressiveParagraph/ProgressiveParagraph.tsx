import React, { useState, useEffect } from 'react';
import { Typography, Fade } from '@mui/material';

interface ProgressiveParagraphProps {
  text: string;
  delay: number;
  index: number;
}

export const ProgressiveParagraph: React.FC<ProgressiveParagraphProps> = ({ text, delay, index }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay * index);

    return () => clearTimeout(timer);
  }, [delay, index]);

  return (
    <Fade in={visible} timeout={500}>
      <Typography variant="body1" paragraph>
        {text}
      </Typography>
    </Fade>
  );
};
