import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useInformationSections, ContentItem } from '../../hooks/useInformationSections';
import { ProgressiveParagraph } from '../ProgressiveParagraph/ProgressiveParagraph';

const PARAGRAPH_DELAY = 150; // milliseconds between each paragraph appearing

interface ContentRendererProps {
  content: ContentItem[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  return (
    <Box>
      {content.map((item, index) => {
        switch (item.type) {
          case 'paragraph':
            return (
              <ProgressiveParagraph
                key={index}
                text={item.text || ''}
                delay={PARAGRAPH_DELAY}
                index={index}
              />
            );
          case 'code':
            // Future enhancement: Add syntax highlighting
            return (
              <Box
                key={index}
                component="pre"
                sx={{
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  my: 2,
                }}
              >
                {item.code}
              </Box>
            );
          case 'link':
            return (
              <Box key={index} sx={{ my: 1 }}>
                <Typography
                  component="a"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'underline',
                    '&:hover': {
                      textDecoration: 'none',
                    },
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            );
          case 'diagram':
            return (
              <Box key={index} sx={{ my: 2, textAlign: 'center' }}>
                <img
                  src={item.src}
                  alt={item.text || 'Diagram'}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '4px',
                  }}
                />
              </Box>
            );
          default:
            return null;
        }
      })}
    </Box>
  );
};

export const InformationHub: React.FC = () => {
  const { sections, isLoading } = useInformationSections();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2, mx: 'auto', maxWidth: '1200px' }}>
      {sections.map((section) => (
        <Accordion
          key={section.id}
          expanded={expanded === section.id}
          onChange={handleChange(section.id)}
          sx={{
            mb: 1,
            '&:before': {
              display: 'none',
            },
            boxShadow: 1,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${section.id}-content`}
            id={`${section.id}-header`}
            sx={{
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Typography variant="subtitle1" component="span">
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: 'background.paper',
              p: 2,
            }}
          >
            <ContentRenderer content={section.content} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
