import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Trade } from '../Dashboard/Dashboard';
import { differenceInMilliseconds } from 'date-fns';
import { StatTooltip } from '../StatTooltip/StatTooltip';

interface StatisticsProps {
  trades: Trade[];
}

export const Statistics: React.FC<StatisticsProps> = ({ trades }) => {
  const calculateStats = () => {
    if (!trades.length) return {
      totalTrades: 0,
      winRate: 0,
      profitFactor: 0,
      maxConsecutiveWins: 0,
      maxConsecutiveLosses: 0,
      totalProfitLoss: 0,
      avgWinningTrade: 0,
      avgLosingTrade: 0,
      largestWinningTrade: 0,
      largestLosingTrade: 0,
      avgTradeDuration: 0,
      sortinoRatio: 0,
      totalGainPercent: 0,
      annualizedGainPercent: 0,
      timeInYears: 0,
    };

    let wins = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let consecutiveWins = 0;
    let consecutiveLosses = 0;
    let maxConsecutiveWins = 0;
    let maxConsecutiveLosses = 0;
    let totalProfitLoss = 0;
    let winningTradesCount = 0;
    let losingTradesCount = 0;
    let totalWinningAmount = 0;
    let totalLosingAmount = 0;
    let largestWinningTrade = 0;
    let largestLosingTrade = 0;
    let totalDuration = 0;

    // For Sortino Ratio calculation
    const RISK_FREE_RATE = 0.0438; // 4.38% annual
    const TRADING_DAYS = 252;
    const INITIAL_CAPITAL_PER_BOT = 5000;
    const uniqueBots = new Set(trades.map(trade => trade.botLabel)).size;
    const totalInitialCapital = INITIAL_CAPITAL_PER_BOT * uniqueBots;
    const dailyRFR = Math.pow(1 + RISK_FREE_RATE, 1/TRADING_DAYS) - 1;
    
    // Group trades by date for daily returns calculation
    const dailyReturns = trades.reduce((acc, trade) => {
      const date = trade.entryTime.split('T')[0];
      if (!acc[date]) acc[date] = 0;
      acc[date] += trade.profitLoss;
      return acc;
    }, {} as { [key: string]: number });

    // Calculate daily return percentages and downside deviation
    const dailyReturnRates = Object.values(dailyReturns).map(profit => profit / totalInitialCapital);
    const downsideReturns = dailyReturnRates
      .filter(return_rate => return_rate < dailyRFR)
      .map(return_rate => Math.pow(return_rate - dailyRFR, 2));
    
    const downsideDeviation = Math.sqrt(
      downsideReturns.reduce((sum, val) => sum + val, 0) / 
      (downsideReturns.length || 1)
    );

    const averageDailyReturn = dailyReturnRates.reduce((sum, val) => sum + val, 0) / 
      (dailyReturnRates.length || 1);

    // Annualized Sortino Ratio
    const sortinoRatio = downsideDeviation === 0 ? 0 : 
      ((averageDailyReturn - dailyRFR) / downsideDeviation) * Math.sqrt(TRADING_DAYS);

    // Calculate annualized gain
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
    );

    // Get first and last trade dates
    const firstTradeDate = new Date(sortedTrades[0].entryTime);
    const lastTradeDate = new Date(sortedTrades[sortedTrades.length - 1].exitTime);

    // Calculate time period in years (with minimum of 1 day to avoid division by zero)
    const timeDiffMs = Math.max(lastTradeDate.getTime() - firstTradeDate.getTime(), 86400000); // minimum 1 day
    const timeInYears = timeDiffMs / (365 * 24 * 60 * 60 * 1000);

    trades.forEach((trade) => {
      const profitLoss = trade.profitLoss;
      totalProfitLoss += profitLoss;

      // Calculate trade duration
      const duration = differenceInMilliseconds(
        new Date(trade.exitTime),
        new Date(trade.entryTime)
      );
      totalDuration += duration;

      if (profitLoss > 0) {
        wins++;
        winningTradesCount++;
        totalWinningAmount += profitLoss;
        largestWinningTrade = Math.max(largestWinningTrade, profitLoss);
        grossProfit += profitLoss;
        consecutiveWins++;
        consecutiveLosses = 0;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
      } else {
        losingTradesCount++;
        totalLosingAmount += profitLoss;
        largestLosingTrade = Math.min(largestLosingTrade, profitLoss);
        grossLoss += Math.abs(profitLoss);
        consecutiveLosses++;
        consecutiveWins = 0;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
      }
    });

    const avgTradeDuration = totalDuration / trades.length;
    
    // Calculate total gain and annualized gain using linear extrapolation
    const totalGainRate = totalProfitLoss / totalInitialCapital;
    // Linearly extrapolate the gain rate to annual (no compounding)
    const annualizedGainRate = timeInYears > 0 ? (totalProfitLoss / timeInYears) / totalInitialCapital : 0;

    return {
      totalTrades: trades.length,
      winRate: (wins / trades.length) * 100,
      profitFactor: grossLoss === 0 ? grossProfit : grossProfit / grossLoss,
      maxConsecutiveWins,
      maxConsecutiveLosses,
      totalProfitLoss,
      avgWinningTrade: winningTradesCount ? totalWinningAmount / winningTradesCount : 0,
      avgLosingTrade: losingTradesCount ? totalLosingAmount / losingTradesCount : 0,
      largestWinningTrade,
      largestLosingTrade,
      avgTradeDuration,
      sortinoRatio,
      totalGainPercent: totalGainRate * 100,
      annualizedGainPercent: annualizedGainRate * 100,
      timeInYears,
    };
  };

  const stats = calculateStats();

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 1, color: 'primary.main' }}>
        Statistics
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', fontStyle: 'italic' }}>
        Hover over each statistic for a brief explanation
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">Performance Metrics</Typography>
            <StatTooltip title="Total number of trades executed">
              <Typography>Total Trades: {stats.totalTrades}</Typography>
            </StatTooltip>
            <StatTooltip title="Percentage of trades that resulted in profit">
              <Typography>Win Rate: {stats.winRate.toFixed(2)}%</Typography>
            </StatTooltip>
            <StatTooltip title="Ratio of net profits to net losses. Values above 1 indicate overall profitability">
              <Typography>Profit Factor: {stats.profitFactor.toFixed(2)}</Typography>
            </StatTooltip>
            <StatTooltip title="Risk-adjusted return metric focusing on downside volatility">
              <Typography>Sortino Ratio: {stats.sortinoRatio.toFixed(3)}</Typography>
            </StatTooltip>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">Profit/Loss Analysis</Typography>
            <StatTooltip title="Total profit/loss across all trades">
              <Typography>Total P/L: ${stats.totalProfitLoss.toFixed(2)}</Typography>
            </StatTooltip>
            <StatTooltip title="Average profit on winning trades">
              <Typography>Avg Win: ${stats.avgWinningTrade.toFixed(2)}</Typography>
            </StatTooltip>
            <StatTooltip title="Average loss on losing trades">
              <Typography>Avg Loss: ${stats.avgLosingTrade.toFixed(2)}</Typography>
            </StatTooltip>
            <StatTooltip title="Total percentage gain on initial capital of $5000 for each bot">
              <Typography>Total Gain: {stats.totalGainPercent.toFixed(2)}%</Typography>
            </StatTooltip>
            <StatTooltip title="Annualized percentage gain (linear extrapolation)">
              <Typography>Annualized Gain: {stats.annualizedGainPercent.toFixed(2)}%</Typography>
            </StatTooltip>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">Trade Metrics</Typography>
            <StatTooltip title="Highest number of consecutive winning trades">
              <Typography>Max Consecutive Wins: {stats.maxConsecutiveWins}</Typography>
            </StatTooltip>
            <StatTooltip title="Highest number of consecutive losing trades">
              <Typography>Max Consecutive Losses: {stats.maxConsecutiveLosses}</Typography>
            </StatTooltip>
            <StatTooltip title="Largest profit from a single trade">
              <Typography>Largest Win: ${stats.largestWinningTrade.toFixed(2)}</Typography>
            </StatTooltip>
            <StatTooltip title="Largest loss from a single trade">
              <Typography>Largest Loss: ${stats.largestLosingTrade.toFixed(2)}</Typography>
            </StatTooltip>
            <StatTooltip title="Average duration of trades">
              <Typography>
                Avg Duration: {
                  stats.avgTradeDuration < 1000 ? 
                  `${Math.round(stats.avgTradeDuration)}ms` :
                  stats.avgTradeDuration < 60000 ?
                  `${Math.round(stats.avgTradeDuration / 1000)}s` :
                  `${Math.round(stats.avgTradeDuration / 60000)}m ${Math.round((stats.avgTradeDuration % 60000) / 1000)}s`
                }
              </Typography>
            </StatTooltip>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
