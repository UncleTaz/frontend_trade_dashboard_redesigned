import { useState, useEffect, useCallback } from 'react';
import { Trade } from '../components/Dashboard/Dashboard';
import { api, TradeFilters } from '../services/api';

interface UsePollingOptions {
  filters: TradeFilters;
  interval: number;
  enabled: boolean;
}

interface UsePollingResult {
  trades: Trade[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const usePolling = ({
  filters,
  interval,
  enabled = true,
}: UsePollingOptions): UsePollingResult => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTrades(filters);
      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch trades'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchTrades();

    // Set up polling interval
    const intervalId = setInterval(fetchTrades, interval);

    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, fetchTrades, interval]);

  return {
    trades,
    loading,
    error,
    refetch: fetchTrades,
  };
};
