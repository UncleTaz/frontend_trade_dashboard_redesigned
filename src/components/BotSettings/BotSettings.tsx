import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useBotLabels } from '../../hooks/useBotLabels';

interface BotSettingsProps {
  selectedBot: string;
  onBotChange: (bot: string) => void;
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  onClearFilters: () => void;
}

export const BotSettings = ({
  selectedBot,
  onBotChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}: BotSettingsProps) => {
  const { botLabels } = useBotLabels();

  const handleBotChange = (event: SelectChangeEvent) => {
    onBotChange(event.target.value);
  };

  const handleStartDateChange = (value: unknown) => {
    const date = value as Date | null;
    onDateRangeChange([date, dateRange[1]]);
  };

  const handleEndDateChange = (value: unknown) => {
    const date = value as Date | null;
    onDateRangeChange([dateRange[0], date]);
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="bot-select-label">Trading Bot</InputLabel>
            <Select
              labelId="bot-select-label"
              id="bot-select"
              value={selectedBot}
              label="Trading Bot"
              onChange={handleBotChange}
            >
              <MenuItem value="">All Bots</MenuItem>
              {botLabels.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={dateRange[0]}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={dateRange[1]}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="outlined"
            onClick={onClearFilters}
            fullWidth
            sx={{ height: '56px' }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
