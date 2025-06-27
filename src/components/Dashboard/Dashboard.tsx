import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { usePolling } from '../../hooks/usePolling';
import { TradeFilters } from '../../services/api';
import { TradeList } from '../TradeList/TradeList';
import { EquityCurve } from '../EquityCurve/EquityCurve';
import { Statistics } from '../Statistics/Statistics';
import { BotSettings } from '../BotSettings/BotSettings';

const InformationSelector = React.lazy(() => import('../InformationSelector/InformationSelector').then(module => ({
  default: module.InformationSelector
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

        <React.Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        }>
          <InformationSelector />
        </React.Suspense>

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
