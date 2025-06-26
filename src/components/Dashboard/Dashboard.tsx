import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Alert, IconButton, Collapse, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { usePolling } from '../../hooks/usePolling';
import { TradeFilters } from '../../services/api';
import { TradeList } from '../TradeList/TradeList';
import { EquityCurve } from '../EquityCurve/EquityCurve';
import { Statistics } from '../Statistics/Statistics';
import { BotSettings } from '../BotSettings/BotSettings';

const AboutContent = React.lazy(() => import('../AboutContent/AboutContent').then(module => ({
  default: module.AboutContent
})));

export interface Trade {
  id: string;
  botLabel: string;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profitLoss: number;
  side: 'LONG' | 'SHORT';
}

export const Dashboard = () => {
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  const handleClearFilters = () => {
    setSelectedBot('');
    setDateRange([null, null]);
  };

  const filters: TradeFilters = {
    botLabel: selectedBot || undefined,
    startDate: dateRange[0] || undefined,
    endDate: dateRange[1] || undefined,
  };

  const { trades, error } = usePolling({
    filters,
    interval: 5000,
    enabled: true,
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          @3_lines_smooth's Live Trade Bot Testing Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Typography variant="subtitle1" component="span" sx={{ mr: 1 }}>
            About this Dashboard
          </Typography>
          <IconButton
            onClick={() => setIsAboutVisible(!isAboutVisible)}
            aria-expanded={isAboutVisible}
            aria-label="show more"
            size="small"
          >
            <ExpandMoreIcon 
              sx={{ 
                transform: isAboutVisible ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }} 
            />
          </IconButton>
        </Box>

        <Collapse in={isAboutVisible} timeout="auto" unmountOnExit>
          <React.Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          }>
            <AboutContent />
          </React.Suspense>
        </Collapse>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <BotSettings
                selectedBot={selectedBot}
                onBotChange={setSelectedBot}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onClearFilters={handleClearFilters}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, height: '500px' }}>
              <EquityCurve trades={trades} />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Statistics trades={trades} />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <TradeList trades={trades} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
