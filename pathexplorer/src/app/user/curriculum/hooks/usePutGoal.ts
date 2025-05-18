'use client';

import { useState } from 'react';
import { useUser } from '@/features/context/userContext';
import { Goal } from '../types/curriculum';

export function usePutGoal() {
  const [loading, setLoading] = useState(false);
  const { userAuth } = useUser();

  const updateGoal = async (
    id: number,
    data: Partial<Goal>,
  ): Promise<Goal> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/goals/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
      }
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  return { updateGoal, loading };
}
