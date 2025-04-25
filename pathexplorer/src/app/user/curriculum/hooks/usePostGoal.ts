'use client';

import { useState } from 'react';
import { useUser } from '@/features/context/userContext';
import { Goal } from '../types/curriculum';

interface UsePostGoalResponse {
  addGoal: (goal: Omit<Goal, 'goal_id'>) => Promise<Goal>;
  loading: boolean;
  error: string | null;
}

export function usePostGoal(): UsePostGoalResponse {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const addGoal = async (goal: Omit<Goal, 'goal_id'>): Promise<Goal> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/goals/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify(goal),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      console.error('Error adding goal:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addGoal, loading, error };
}
