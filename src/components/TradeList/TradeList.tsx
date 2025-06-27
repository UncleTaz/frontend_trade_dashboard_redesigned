import React, { useRef } from 'react';
import {
  Typography,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FixedSizeList as List, ListOnScrollProps } from 'react-window';
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

  // Header reference for scroll synchronization
  const headerRef = useRef<HTMLDivElement>(null);

  // Calculate optimal column widths for mobile
  const getColumnWidths = () => {
    if (!useMobileLayout) {
      // Desktop: use flex values (converted to approximate widths)
      return {
        bot: 'flex: 2',
        side: 'flex: 1', 
        entryTime: 'flex: 1.5',
        exitTime: 'flex: 1.5',
        entryPrice: 'flex: 1',
        exitPrice: 'flex: 1',
        quantity: 'flex: 0.7',
        pnl: 'flex: 1'
      };
    }

    // Mobile: calculate based on content
    const maxBotLength = trades.reduce((max, trade) => 
      Math.max(max, trade.botLabel.length), 0);
    
    return {
      bot: Math.max(120, maxBotLength * 8) + 'px',
      side: '60px',
      entryTime: '140px', 
      exitTime: '140px',
      entryPrice: '90px',
      exitPrice: '90px', 
      quantity: '70px',
      pnl: '90px'
    };
  };

  const columnWidths = getColumnWidths();

  // Scroll synchronization handler
  const handleScroll = (props: ListOnScrollProps) => {
    if (headerRef.current && 'scrollLeft' in props && typeof props.scrollLeft === 'number') {
      headerRef.current.scrollLeft = props.scrollLeft;
    }
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const trade = trades[index];
    
    if (useMobileLayout) {
      // Mobile layout: Single scrollable container with auto-sized columns
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
              minWidth: 'max-content', // Allow container to expand
            }}
          >
            <Box sx={{ width: columnWidths.bot, pl: 2, pr: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.875rem' }}>
                {trade.botLabel}
              </Typography>
            </Box>
            <Box sx={{ width: columnWidths.side, px: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  color: trade.side === 'LONG' ? 'success.main' : 'error.main',
                  fontWeight: 'medium',
                  fontSize: '0.875rem'
                }}
              >
                {trade.side}
              </Typography>
            </Box>
            <Box sx={{ width: columnWidths.entryTime, px: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.875rem' }}>
                {formatTimestamp(trade.entryTime)}
              </Typography>
            </Box>
            <Box sx={{ width: columnWidths.exitTime, px: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.875rem' }}>
                {formatTimestamp(trade.exitTime)}
              </Typography>
            </Box>
            <Box sx={{ width: columnWidths.entryPrice, px: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.875rem' }}>
                ${trade.entryPrice.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ width: columnWidths.exitPrice, px: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.875rem' }}>
                ${trade.exitPrice.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ width: columnWidths.quantity, px: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.875rem' }}>
                {trade.quantity}
              </Typography>
            </Box>
            <Box sx={{ width: columnWidths.pnl, px: 1, pr: 2, minWidth: 0 }}>
              <Typography
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
        {useMobileLayout ? (
          // Mobile: Wrap everything in horizontal scroll container
          <Box sx={{ 
            overflowX: 'auto', 
            height: '100%',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
            },
          }}>
            {/* Header */}
            <Box
              ref={headerRef}
              sx={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                bgcolor: 'background.paper',
                height: HEADER_HEIGHT,
                position: 'sticky',
                top: 0,
                zIndex: 1,
                minWidth: 'max-content',
              }}
            >
              <Box sx={{ width: columnWidths.bot, pl: 2, pr: 1 }}>
                <StatTooltip title="Trading bot identifier">
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Bot</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ width: columnWidths.side, px: 1 }}>
                <StatTooltip title="Trade direction (LONG/SHORT)">
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Side</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ width: columnWidths.entryTime, px: 1 }}>
                <StatTooltip title="Time when the trade was entered">
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Entry Time</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ width: columnWidths.exitTime, px: 1 }}>
                <StatTooltip title="Time when the trade was exited">
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Exit Time</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ width: columnWidths.entryPrice, px: 1 }}>
                <StatTooltip title="Price at which the trade was entered">
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Entry Price</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ width: columnWidths.exitPrice, px: 1 }}>
                <StatTooltip title="Price at which the trade was exited">
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Exit Price</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ width: columnWidths.quantity, px: 1 }}>
                <StatTooltip title="Number of contracts traded">
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>Quantity</Typography>
                </StatTooltip>
              </Box>
              <Box sx={{ width: columnWidths.pnl, px: 1, pr: 2 }}>
                <StatTooltip title="Profit/Loss from the trade net of commissions">
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>P/L</Typography>
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
                    onScroll={handleScroll}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            </Box>
          </Box>
        ) : (
          // Desktop: Current layout
          <>
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
          </>
        )}
      </Paper>
    </>
  );
};
