// src/hooks/useGetPendingAssignments.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import { Assignment } from '../types/assignment';

interface UseGetPendingAssignmentsResponse {
  data: Assignment[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetPendingAssignments(): UseGetPendingAssignmentsResponse {
  const [data, setData] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/assignments/pending-assignments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAuth?.accessToken}`,
        },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const payload = await res.json();
      let list: unknown;
      if (Array.isArray((payload as any).pending_assignments)) {
        list = (payload as any).pending_assignments;
      } else {
        list = [];
        console.warn(
          'useGetPendingAssignments: payload no contiene `pending_assignments`:',
          payload,
        );
      }
      setData(list as Assignment[]);
    } catch (err: any) {
      console.error('Error fetching pending assignments:', err);
      setError(err.message || 'An unknown error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [userAuth]);

  useEffect(() => {
    if (!userAuth) return;
    fetchPending();
  }, [userAuth, fetchPending]);

  return { data, loading, error, refetch: fetchPending };
}
