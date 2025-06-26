import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Paper,
} from '@mui/material';
import { Trade } from '../Dashboard/Dashboard';
import { StatTooltip } from '../StatTooltip/StatTooltip';

interface EquityCurveProps {
  trades: Trade[];
}

interface DataPoint {
  tradeIndex: number;
  timestamp: number;
  equity: number;
  tradeId: string;
  dailyPnL?: number;
}

export const EquityCurve = ({ trades }: EquityCurveProps) => {
  const [viewMode, setViewMode] = useState<'daily' | 'trade'>('daily');

  const handleToggle = (_: any, newMode: 'daily' | 'trade' | null) => {
    if (newMode !== null) setViewMode(newMode);
  };

  const data: DataPoint[] = useMemo(() => {
    let cumulativeEquity = 0;

    const filteredTrades = [...trades]
      .filter(t => new Date(t.exitTime).getDay() !== 6) // exclude Saturdays
      .sort((a, b) => new Date(a.exitTime).getTime() - new Date(b.exitTime).getTime());

    if (viewMode === 'daily') {
      const byDate: { [date: string]: { equity: number; timestamp: number; dailyPnL: number } } = {};

      filteredTrades.forEach(trade => {
        const dateStr = trade.exitTime.slice(0, 10); // "YYYY-MM-DD"
        if (!byDate[dateStr]) {
          byDate[dateStr] = {
            equity: 0,
            timestamp: new Date(`${dateStr}T00:00:00`).getTime(),
            dailyPnL: 0,
          };
        }
        byDate[dateStr].dailyPnL += trade.profitLoss;
        byDate[dateStr].equity += trade.profitLoss;
      });

      return Object.entries(byDate).map(([date, { equity, timestamp, dailyPnL }]) => {
        cumulativeEquity += equity;
        return {
          tradeIndex: 0,
          timestamp,
          equity: cumulativeEquity,
          tradeId: date,
          dailyPnL,
        };
      });
    } else {
      return filteredTrades.map((trade, i) => {
        cumulativeEquity += trade.profitLoss;
        return {
          tradeIndex: i + 1,
          timestamp: new Date(trade.exitTime).getTime(),
          equity: cumulativeEquity,
          tradeId: trade.id,
        };
      });
    }
  }, [trades, viewMode]);

  const formatXAxis = (value: number | string) => {
    if (viewMode === 'trade') {
      return value.toString(); // Trade #
    } else {
      return new Date(value as number).toISOString().slice(0, 10); // YYYY-MM-DD
    }
  };

  const formatTooltipLabel = (label: number | string) => {
    if (viewMode === 'daily') {
      // In daily view, label is a timestamp, convert to date
      return new Date(label as number).toISOString().slice(0, 10); // YYYY-MM-DD
    } else {
      // In trade view, label is trade number
      return `Trade #${label}`;
    }
  };

  const formatTooltipValue = (value: number) =>
    `$${Math.round(value)}`;

  // ✅ Intelligent tick interval setup
  let tickInterval: number | undefined = undefined;
  let tradeTicks: number[] | undefined = undefined;

  if (viewMode === 'trade') {
    tickInterval = Math.ceil(data.length / 8) || 1;
    tradeTicks = data
      .filter((_, i) => i % tickInterval! === 0)
      .map((d) => d.tradeIndex);
  } else {
    // For daily view, calculate intelligent date intervals
    const dataLength = data.length;
    if (dataLength > 0) {
      // Aim for 6-8 ticks for optimal readability
      const targetTicks = Math.min(8, Math.max(4, dataLength));
      tickInterval = Math.ceil(dataLength / targetTicks);
      tradeTicks = data
        .filter((_, i) => i % tickInterval! === 0)
        .map((d) => d.timestamp);
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="subtitle2">
            {formatTooltipLabel(label)}
          </Typography>
          <Typography color="primary">
            Total Equity: {formatTooltipValue(payload[0].value)}
          </Typography>
          {viewMode === 'daily' && payload[0].payload.dailyPnL && (
            <Typography 
              color={payload[0].payload.dailyPnL >= 0 ? 'success.main' : 'error.main'}
            >
              Daily P/L: {formatTooltipValue(payload[0].payload.dailyPnL)}
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Equity Curve
        </Typography>
        <StatTooltip title="Switch between daily and per-trade view">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleToggle}
            size="small"
          >
            <ToggleButton value="daily">Daily View</ToggleButton>
            <ToggleButton value="trade">Per-Trade View</ToggleButton>
          </ToggleButtonGroup>
        </StatTooltip>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={viewMode === 'trade' ? 'tradeIndex' : 'timestamp'}
            type="number"
            tickFormatter={formatXAxis}
            domain={['dataMin', 'dataMax']}
            ticks={tradeTicks}
          />
          <YAxis 
            tickFormatter={formatTooltipValue}
            label={{ 
              value: 'Equity ($)', 
              angle: -90, 
              position: 'outside',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#8884d8"
            name="Equity"
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
