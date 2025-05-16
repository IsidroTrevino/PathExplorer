'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useUser } from '@/features/context/userContext';
import { Goal } from '../types/curriculum';

export function useGetGoals() {
  const [data, setData] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();
  const fetchedRef = useRef(false);

  const fetchGoals = useCallback(async () => {
    if (!userAuth?.accessToken) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/goals/my-goals', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth.accessToken}`,
        },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const goals: Goal[] = await res.json();
      setData(goals);
    } catch (err) {
      setError('An unknown error occurred');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [userAuth]);

  useEffect(() => {
    if (!userAuth || fetchedRef.current) return;

    fetchGoals();
    fetchedRef.current = true;
  }, [userAuth]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      fetchedRef.current = false;
      return fetchGoals();
    },
  };
}
