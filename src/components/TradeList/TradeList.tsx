import React from 'react';
import {
  Typography,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Trade } from '../Dashboard/Dashboard';
import { StatTooltip } from '../StatTooltip/StatTooltip';

// Feature flag for mobile responsive layout
const USE_MOBILE_RESPONSIVE_LAYOUT = true;

const formatTimestamp = (isoString: string) => {
  const [date, timeWithOffset] = isoString.split('T');
  const time = timeWithOffset.slice(0, 8); // Get HH:MM:SS
  return `${date}, ${time}`;
};

interface TradeListProps {
  trades: Trade[];
}

export const TradeList: React.FC<TradeListProps> = ({ trades }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // <768px
  const useMobileLayout = USE_MOBILE_RESPONSIVE_LAYOUT && isMobile;
  
  const ROW_HEIGHT = 53; // Material-UI default row height
  const HEADER_HEIGHT = 56; // Material-UI default header height

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const trade = trades[index];
    
    if (useMobileLayout) {
      // Mobile layout: Fixed left + Scrollable right
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
              overflow: 'hidden',
            }}
          >
            {/* Fixed Left Section - Essential columns */}
            <Box sx={{ 
              display: 'flex', 
              minWidth: '60%', 
              borderRight: '1px solid rgba(224, 224, 224, 0.5)',
              pr: 1
            }}>
              <Box sx={{ flex: 3, pl: 2, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: '0.875rem' }}>
                  {trade.botLabel}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    color: trade.side === 'LONG' ? 'success.main' : 'error.main',
                    fontWeight: 'medium',
                    fontSize: '0.875rem'
                  }}
                >
                  {trade.side}
                </Typography>
              </Box>
              <Box sx={{ flex: 2, minWidth: 0, pr: 1 }}>
                <Typography
                  noWrap
                  sx={{
                    color: trade.profitLoss >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 'medium',
                    fontSize: '0.875rem'
                  }}
                >
                  ${trade.profitLoss.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            {/* Scrollable Right Section - Detail columns */}
            <Box sx={{ 
              display: 'flex', 
              overflowX: 'auto', 
              minWidth: '40%',
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
              '&::-webkit-scrollbar': {
                height: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.1)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '2px',
              },
            }}>
              <Box sx={{ minWidth: '140px', px: 1 }}>
                <Typography noWrap sx={{ fontSize: '0.75rem' }}>
                  {formatTimestamp(trade.entryTime)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: '140px', px: 1 }}>
                <Typography noWrap sx={{ fontSize: '0.75rem' }}>
                  {formatTimestamp(trade.exitTime)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: '100px', px: 1 }}>
                <Typography noWrap sx={{ fontSize: '0.75rem' }}>
                  ${trade.entryPrice.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: '100px', px: 1 }}>
                <Typography noWrap sx={{ fontSize: '0.75rem' }}>
                  ${trade.exitPrice.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ minWidth: '80px', px: 1 }}>
                <Typography noWrap sx={{ fontSize: '0.75rem' }}>
                  {trade.quantity}
                </Typography>
              </Box>
            </Box>
          </Box>
        </div>
      );
    }
    
    // Desktop layout: Current implementation
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
          <Box sx={{ flex: 2, pl: 2 }}>{trade.botLabel}</Box>
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
          <Box sx={{ flex: 1 }}>${trade.entryPrice.toFixed(2)}</Box>
          <Box sx={{ flex: 1 }}>${trade.exitPrice.toFixed(2)}</Box>
          <Box sx={{ flex: 0.7 }}>{trade.quantity}</Box>
          <Box sx={{ flex: 1, pr: 2 }}>
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
            overflow: 'hidden',
          }}
        >
          {useMobileLayout ? (
            // Mobile Header: Fixed left + Scrollable right
            <>
              {/* Fixed Left Header Section */}
              <Box sx={{ 
                display: 'flex', 
                minWidth: '60%', 
                borderRight: '1px solid rgba(224, 224, 224, 0.5)',
                pr: 1
              }}>
                <Box sx={{ flex: 3, pl: 2 }}>
                  <StatTooltip title="Trading bot identifier">
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Bot</Typography>
                  </StatTooltip>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <StatTooltip title="Trade direction (LONG/SHORT)">
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Side</Typography>
                  </StatTooltip>
                </Box>
                <Box sx={{ flex: 2, pr: 1 }}>
                  <StatTooltip title="Profit/Loss from the trade net of commissions">
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>P/L</Typography>
                  </StatTooltip>
                </Box>
              </Box>
              
              {/* Scrollable Right Header Section */}
              <Box sx={{ 
                display: 'flex', 
                overflowX: 'auto', 
                minWidth: '40%',
                WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0,0,0,0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '2px',
                },
              }}>
                <Box sx={{ minWidth: '140px', px: 1 }}>
                  <StatTooltip title="Time when the trade was entered">
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>Entry Time</Typography>
                  </StatTooltip>
                </Box>
                <Box sx={{ minWidth: '140px', px: 1 }}>
                  <StatTooltip title="Time when the trade was exited">
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>Exit Time</Typography>
                  </StatTooltip>
                </Box>
                <Box sx={{ minWidth: '100px', px: 1 }}>
                  <StatTooltip title="Price at which the trade was entered">
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>Entry Price</Typography>
                  </StatTooltip>
                </Box>
                <Box sx={{ minWidth: '100px', px: 1 }}>
                  <StatTooltip title="Price at which the trade was exited">
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>Exit Price</Typography>
                  </StatTooltip>
                </Box>
                <Box sx={{ minWidth: '80px', px: 1 }}>
                  <StatTooltip title="Number of contracts traded">
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>Quantity</Typography>
                  </StatTooltip>
                </Box>
              </Box>
            </>
          ) : (
            // Desktop Header: Current implementation
            <>
              <Box sx={{ flex: 2, pl: 2 }}>
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
              <Box sx={{ flex: 1 }}>
                <StatTooltip title="Price at which the trade was entered">
                  <Typography>Entry Price</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ flex: 1 }}>
                <StatTooltip title="Price at which the trade was exited">
                  <Typography>Exit Price</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ flex: 0.7 }}>
                <StatTooltip title="Number of contracts traded">
                  <Typography>Quantity</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ flex: 1, pr: 2 }}>
                <StatTooltip title="Profit/Loss from the trade net of commissions">
                  <Typography>P/L</Typography>
                </StatTooltip>
              </Box>
            </>
          )}
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
