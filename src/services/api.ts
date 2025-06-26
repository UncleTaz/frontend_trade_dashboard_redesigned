import axios from 'axios';
import { Trade } from '../components/Dashboard/Dashboard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface TradeFilters {
  botLabel?: string;
  startDate?: Date;
  endDate?: Date;
}

export const api = {
  async getTrades(filters: TradeFilters = {}): Promise<Trade[]> {
    const params: Record<string, string> = {};

    if (filters.botLabel) {
      params.botLabel = filters.botLabel;
    }

    if (filters.startDate) {
      params.startDate = filters.startDate.toISOString();
    }

    if (filters.endDate) {
      params.endDate = filters.endDate.toISOString();
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/trades`, { params });
      return response.data as Trade[];
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to fetch trades');
      }
      throw new Error('Failed to fetch trades');
    }
  },

  async getBotLabels(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/bots`);
      return response.data as string[];
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to fetch bot labels');
      }
      throw new Error('Failed to fetch bot labels');
    }
  },
};
