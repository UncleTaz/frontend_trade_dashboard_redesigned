import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
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
    <Box sx={{ p: 2, mx: 'auto', maxWidth: '1200px' }}>
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

export const InformationSelector: React.FC = () => {
  const { sections, isLoading } = useInformationSections();
  const [selectedSection, setSelectedSection] = useState<string>('about');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSectionChange = (event: SelectChangeEvent<string>) => {
    setSelectedSection(event.target.value);
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  const currentSection = sections.find(section => section.id === selectedSection);

  return (
    <Box sx={{ mb: 2 }}>
      {/* Compact selector line */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Typography variant="subtitle1" component="span" sx={{ mr: 1 }}>
          About:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200, mr: 1 }}>
          <Select
            value={selectedSection}
            onChange={handleSectionChange}
            displayEmpty
            sx={{
              '& .MuiSelect-select': {
                py: 0.5,
                fontSize: '0.875rem',
              },
            }}
          >
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton
          onClick={handleToggleExpanded}
          aria-expanded={isExpanded}
          aria-label="show more"
          size="small"
        >
          <ExpandMoreIcon 
            sx={{ 
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }} 
          />
        </IconButton>
      </Box>

      {/* Expandable content area */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        {currentSection && (
          <Box sx={{
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            mb: 2,
          }}>
            <ContentRenderer content={currentSection.content} />
          </Box>
        )}
      </Collapse>
    </Box>
  );
};
