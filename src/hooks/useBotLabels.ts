import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface UseBotLabelsResult {
  botLabels: string[];
  loading: boolean;
  error: Error | null;
}

export const useBotLabels = (): UseBotLabelsResult => {
  const [botLabels, setBotLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBotLabels = async () => {
      try {
        setLoading(true);
        setError(null);
        const labels = await api.getBotLabels();
        setBotLabels(labels);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch bot labels'));
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchBotLabels();

    // Set up polling to update bot labels every 5 seconds
    const interval = setInterval(fetchBotLabels, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return {
    botLabels,
    loading,
    error,
  };
};
