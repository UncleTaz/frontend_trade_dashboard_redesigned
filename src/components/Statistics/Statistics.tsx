import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Trade } from '../Dashboard/Dashboard';
import { differenceInMilliseconds } from 'date-fns';
import { StatTooltip } from '../StatTooltip/StatTooltip';

interface StatisticsProps {
  trades: Trade[];
  selectedBot: string;
}

interface BotTWRStats {
  botLabel: string;
  gainPercent: number;
  annualizedPercent: number;
  sortinoRatio: number;
}

export const Statistics: React.FC<StatisticsProps> = ({ trades, selectedBot }) => {
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
      twrGainPercent: 0,
      linearAnnualizedPercent: 0,
      timeInYears: 0,
      perBotTWRs: [],
    };

    const INITIAL_CAPITAL_PER_BOT = 5000;
    const TRADING_DAYS = 252;
    const RISK_FREE_RATE = 0.0438;

    // Get all available trades (not just filtered ones) for calculating starting equity
    const allAvailableTrades = trades; // This represents all trades available to the component
    
    // Sort all trades by entry time to establish chronological order
    const allTradesSorted = [...allAvailableTrades].sort((a, b) => 
      new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
    );

    // Get unique bots and their first trade dates
    const botFirstTradeDates: { [bot: string]: Date } = {};
    allTradesSorted.forEach(trade => {
      if (!botFirstTradeDates[trade.botLabel]) {
        botFirstTradeDates[trade.botLabel] = new Date(trade.entryTime);
      }
    });

    // Calculate starting equity for each bot based on accumulated P&L from bot start to filter start
    const calculateStartingEquity = (botLabel: string, filterStartDate?: Date) => {
      const botStartDate = botFirstTradeDates[botLabel];
      if (!filterStartDate || filterStartDate <= botStartDate) {
        return INITIAL_CAPITAL_PER_BOT;
      }

      // Calculate accumulated P&L from bot start to filter start
      const priorTrades = allTradesSorted.filter(trade => 
        trade.botLabel === botLabel && 
        new Date(trade.exitTime) >= botStartDate && 
        new Date(trade.exitTime) < filterStartDate
      );

      const accumulatedPnL = priorTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
      return INITIAL_CAPITAL_PER_BOT + accumulatedPnL;
    };

    // Get filter start date (earliest trade in current filtered set)
    const filterStartDate = trades.length > 0 ? new Date(trades[0].entryTime) : undefined;

    // Basic trade statistics
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

    // Time period calculation
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
    );
    const firstTradeDate = new Date(sortedTrades[0].entryTime);
    const lastTradeDate = new Date(sortedTrades[sortedTrades.length - 1].exitTime);
    const timeDiffMs = Math.max(lastTradeDate.getTime() - firstTradeDate.getTime(), 86400000); // minimum 1 day
    const timeInYears = timeDiffMs / (365 * 24 * 60 * 60 * 1000);
    const timeInDays = timeDiffMs / (24 * 60 * 60 * 1000);

    // Group trades by day for TWR calculation
    function groupByDay(trades: Trade[]) {
      const dailyPnL: { [date: string]: number } = {};
      for (const trade of trades) {
        const date = trade.exitTime.slice(0, 10);
        if (!dailyPnL[date]) dailyPnL[date] = 0;
        dailyPnL[date] += trade.profitLoss;
      }
      return dailyPnL;
    }

    // Calculate TWR and Sortino
    function calculateTWRAndSortino(dailyPnL: { [date: string]: number }, startingEquity: number) {
      let equity = startingEquity;
      let totalReturn = 1;
      const sortedDates = Object.keys(dailyPnL).sort();
      const dailyReturns: number[] = [];

      for (const date of sortedDates) {
        const dayReturn = dailyPnL[date] / equity;
        dailyReturns.push(dayReturn);
        totalReturn *= (1 + dayReturn);
        equity += dailyPnL[date];
      }

      const TWR = totalReturn - 1;

      // Sortino calculation
      const dailyRFR = Math.pow(1 + RISK_FREE_RATE, 1 / TRADING_DAYS) - 1;
      const downside = dailyReturns.filter(r => r < dailyRFR).map(r => Math.pow(r - dailyRFR, 2));
      const downsideDev = Math.sqrt(downside.reduce((sum, x) => sum + x, 0) / (downside.length || 1));
      const avgReturn = dailyReturns.reduce((sum, x) => sum + x, 0) / (dailyReturns.length || 1);
      const sortino = downsideDev === 0 ? 0 : ((avgReturn - dailyRFR) / downsideDev) * Math.sqrt(TRADING_DAYS);

      return { TWR, sortino };
    }

    // Calculate per-bot TWR stats (only when showing all bots)
    const perBotTWRs: BotTWRStats[] = [];
    if (!selectedBot) { // Only calculate when "All" is selected
      const tradesByBot: { [bot: string]: Trade[] } = {};
      trades.forEach(trade => {
        if (!tradesByBot[trade.botLabel]) tradesByBot[trade.botLabel] = [];
        tradesByBot[trade.botLabel].push(trade);
      });

      Object.entries(tradesByBot).forEach(([botLabel, botTrades]) => {
        const startingEquity = calculateStartingEquity(botLabel, filterStartDate);
        const dailyPnL = groupByDay(botTrades);
        const { TWR, sortino } = calculateTWRAndSortino(dailyPnL, startingEquity);
        
        // Linear annualized calculation for this bot
        const botTotalPnL = botTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
        const linearAnnualized = timeInDays > 0 ? (botTotalPnL / timeInDays) * 365 / startingEquity * 100 : 0;

        perBotTWRs.push({
          botLabel,
          gainPercent: TWR * 100,
          annualizedPercent: linearAnnualized,
          sortinoRatio: sortino
        });
      });
    }

    // Calculate pooled/overall TWR and linear annualized // Improved from capital-aware only
    const allBots = new Set(trades.map(t => t.botLabel));
    const pooledStartingEquity = Array.from(allBots).reduce((sum, botLabel) => {
      return sum + calculateStartingEquity(botLabel, filterStartDate);
    }, 0);

    const combinedDailyPnL = groupByDay(trades);
    const { TWR: pooledTWR, sortino: sortinoRatio } = calculateTWRAndSortino(combinedDailyPnL, pooledStartingEquity);

    // Linear annualized calculation (as requested)
    const linearAnnualizedPercent = timeInDays > 0 ? (totalProfitLoss / timeInDays) * 365 / pooledStartingEquity * 100 : 0;

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
      avgTradeDuration: totalDuration / trades.length,
      sortinoRatio,
      twrGainPercent: pooledTWR * 100,
      linearAnnualizedPercent,
      timeInYears,
      perBotTWRs,
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
            <StatTooltip title="Time-weighted return percentage accounting for dynamic starting capital">
              <Typography>TWR Gain: {stats.twrGainPercent.toFixed(2)}%</Typography>
            </StatTooltip>
            <StatTooltip title="Linear annualized gain based on fixed contract size trading">
              <Typography>Annualized Gain: {stats.linearAnnualizedPercent.toFixed(2)}%</Typography>
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

        {/* Per-Bot Breakdown - Only show when "All" bots selected */}
        {!selectedBot && stats.perBotTWRs.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">Per-Bot Performance</Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                Individual bot performance with TWR-based calculations
              </Typography>
              {stats.perBotTWRs.map(bot => (
                <Typography key={bot.botLabel} sx={{ mb: 1 }}>
                  <strong>{bot.botLabel}:</strong> {bot.gainPercent.toFixed(2)}% TWR 
                  ({bot.annualizedPercent.toFixed(2)}% annualized), Sortino: {bot.sortinoRatio.toFixed(3)}
                </Typography>
              ))}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
