import { useState, useEffect } from 'react';
import axios from 'axios';

// Smart API base URL selection:
// - Use same-origin for all requests (works in both dev and production)
// - The backend runs on the same port as frontend (5000) in Replit
const API_BASE = '';

interface Batch {
  id: string;
  batchName: string;
  batchType: string;
  description?: string;
  config: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  totalItems: number;
  completedItems: number;
  failedItems: number;
  successRate: number;
  startedAt?: string;
  completedAt?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface BatchItem {
  id: string;
  batchId: string;
  itemOrder: number;
  itemConfig: any;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: any;
  errorMessage?: string;
  executionTimeMs?: number;
  startedAt?: string;
  completedAt?: string;
  findings: any[];
}

interface BatchProgress {
  batchId: string;
  batchName: string;
  status: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  runningItems: number;
  startedAt?: string;
  completedAt?: string;
}

export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE}/api/batches`, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
        params: {
          _start: 0,
          _end: 100,
          _sort: 'created_at',
          _order: 'DESC',
        },
      });

      setBatches(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Fetch batches error:', err);
      setError(err.response?.data?.error || 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const createBatch = async (batchData: {
    batchName: string;
    batchType: string;
    description?: string;
    config?: any;
    items: any[];
  }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE}/api/batches`,
        batchData,
        {
          headers: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        }
      );

      await fetchBatches();
      return response.data;
    } catch (err: any) {
      console.error('Create batch error:', err);
      throw new Error(err.response?.data?.error || 'Failed to create batch');
    }
  };

  const runBatch = async (batchId: string, options?: { maxParallel?: number }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE}/api/batches/${batchId}/run`,
        options || {},
        {
          headers: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        }
      );

      await fetchBatches();
      return response.data;
    } catch (err: any) {
      console.error('Run batch error:', err);
      throw new Error(err.response?.data?.error || 'Failed to run batch');
    }
  };

  const getBatchProgress = async (batchId: string): Promise<BatchProgress> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_BASE}/api/batches/${batchId}/progress`,
        {
          headers: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        }
      );

      return response.data;
    } catch (err: any) {
      console.error('Get batch progress error:', err);
      throw new Error(err.response?.data?.error || 'Failed to get batch progress');
    }
  };

  const getBatchItems = async (batchId: string): Promise<BatchItem[]> => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_BASE}/api/batches/${batchId}/items`,
        {
          headers: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        }
      );

      return response.data;
    } catch (err: any) {
      console.error('Get batch items error:', err);
      throw new Error(err.response?.data?.error || 'Failed to get batch items');
    }
  };

  return {
    batches,
    loading,
    error,
    fetchBatches,
    createBatch,
    runBatch,
    getBatchProgress,
    getBatchItems,
  };
}
