import React, { useState, useMemo } from 'react';
import {
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
  Button,
} from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Trade } from '../Dashboard/Dashboard';
import { StatTooltip } from '../StatTooltip/StatTooltip';

const formatTimestamp = (isoString: string) => {
  const [date, timeWithOffset] = isoString.split('T');
  const time = timeWithOffset.slice(0, 8); // Get HH:MM:SS
  return `${date}, ${time}`;
};

interface TradeListProps {
  trades: Trade[];
}

export const TradeList: React.FC<TradeListProps> = ({ trades }) => {
  const ROW_HEIGHT = 53; // Material-UI default row height
  const HEADER_HEIGHT = 56; // Material-UI default header height

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const trade = trades[index];
    return (
      <div style={style}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            '&:hover': {
              backgroundColor: 'action.hover',
              cursor: 'pointer'
            },
            height: ROW_HEIGHT,
          }}
        >
          <Box sx={{ flex: 1, pl: 2 }}>{trade.botLabel}</Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: trade.side === 'LONG' ? 'success.main' : 'error.main',
                fontWeight: 'medium'
              }}
            >
              {trade.side}
            </Typography>
          </Box>
          <Box sx={{ flex: 1.5 }}>{formatTimestamp(trade.entryTime)}</Box>
          <Box sx={{ flex: 1.5 }}>{formatTimestamp(trade.exitTime)}</Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>${trade.entryPrice.toFixed(2)}</Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>${trade.exitPrice.toFixed(2)}</Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>{trade.quantity}</Box>
          <Box sx={{ flex: 1, textAlign: 'right', pr: 2 }}>
            <Typography
              sx={{
                color: trade.profitLoss >= 0 ? 'success.main' : 'error.main',
                fontWeight: 'medium'
              }}
            >
              ${trade.profitLoss.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </div>
    );
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Trade List
      </Typography>
      <Paper sx={{ height: 600, width: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            bgcolor: 'background.paper',
            height: HEADER_HEIGHT,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Box sx={{ flex: 1, pl: 2 }}>
            <StatTooltip title="Trading bot identifier">
              <Typography>Bot</Typography>
            </StatTooltip>
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatTooltip title="Trade direction (LONG/SHORT)">
              <Typography>Side</Typography>
            </StatTooltip>
          </Box>
          <Box sx={{ flex: 1.5 }}>
            <StatTooltip title="Time when the trade was entered">
              <Typography>Entry Time</Typography>
            </StatTooltip>
          </Box>
          <Box sx={{ flex: 1.5 }}>
            <StatTooltip title="Time when the trade was exited">
              <Typography>Exit Time</Typography>
            </StatTooltip>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <StatTooltip title="Price at which the trade was entered">
              <Typography>Entry Price</Typography>
            </StatTooltip>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <StatTooltip title="Price at which the trade was exited">
              <Typography>Exit Price</Typography>
            </StatTooltip>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <StatTooltip title="Number of contracts traded">
              <Typography>Quantity</Typography>
            </StatTooltip>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'right', pr: 2 }}>
            <StatTooltip title="Profit/Loss from the trade">
              <Typography>P/L</Typography>
            </StatTooltip>
          </Box>
        </Box>

        {/* Virtualized List */}
        <Box sx={{ height: `calc(600px - ${HEADER_HEIGHT}px)` }}>
          <AutoSizer>
            {({ width, height }: { width: number; height: number }) => (
              <List
                height={height}
                itemCount={trades.length}
                itemSize={ROW_HEIGHT}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </Box>
      </Paper>
    </>
  );
};
