'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import { Goal } from '../types/curriculum';

interface UseGetGoalsResponse {
  data: Goal[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetGoals(): UseGetGoalsResponse {
  const [data, setData] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const fetchGoals = useCallback (async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/goals/my-goals', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const goals: Goal[] = await res.json();
      setData(goals);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [userAuth]);

  useEffect(() => {
    if (!userAuth) return;
    fetchGoals();
  }, [userAuth]);

  return { data, loading, error, refetch: fetchGoals };
}
