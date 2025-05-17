'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import type { AICertificationRecommendation, UseGetAICertificationRecommendationsResponse } from './types';

export function useGetAICertificationRecommendations(): UseGetAICertificationRecommendationsResponse {
  const { userAuth } = useUser();
  const token = userAuth?.accessToken;

  const [data, setData] = useState<AICertificationRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        return;
      }

      const res = await fetch('/api/ai/certifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('[useGetAIRecommendations] status:', res.status);

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
            (payload && (payload.message || payload.error)) ||
            res.statusText;
        throw new Error(`Error ${res.status}: ${msg}`);
      }

      setData(payload as AICertificationRecommendation);
    } catch (err) {
      setError('Unknown error occurred while fetching AI recommendations');
      console.error('[useGetAIRecommendations] error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { data, loading, error, refetch: fetchRecommendations };
}
