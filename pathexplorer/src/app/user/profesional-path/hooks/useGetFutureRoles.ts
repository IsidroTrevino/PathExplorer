'use client';

import { useState, useCallback, useEffect } from 'react';
import { Recommendation } from '../types/profesionalPath';
import { useUser } from '@/features/context/userContext';

interface UseGetFutureRolesResponse {
  data: Recommendation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetFutureRoles(): UseGetFutureRolesResponse {
  const { userAuth } = useUser();
  const token = userAuth?.accessToken;

  const [data, setData] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No token');
      const res = await fetch('/api/ai/future-roles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || res.statusText);
      }
      const payload = (await res.json()) as { recommendations: Recommendation[] };
      setData(payload.recommendations);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchRecs(); }, [fetchRecs]);

  return { data, loading, error, refetch: fetchRecs };
}
