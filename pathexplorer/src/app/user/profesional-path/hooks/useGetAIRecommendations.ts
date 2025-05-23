'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/features/context/userContext';
import type { AIRecommendation, UseGetAIRecommendationsResponse } from '../types/profesionalPath';

export function useGetAIRecommendations(): UseGetAIRecommendationsResponse {
  const { userAuth } = useUser();
  const token = userAuth?.accessToken;

  const [data, setData] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      if (!token) {
        return;
      }

      const res = await fetch('/api/ai/feedback', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: abortControllerRef.current.signal,
      });

      console.log('[useGetAIRecommendations] status:', res.status);

      if (!isMounted.current) return;

      const payload = await res.json().catch(() => null);

      if (!isMounted.current) return;

      if (!res.ok) {
        const msg =
            (payload && (payload.message || payload.error)) ||
            res.statusText;
        throw new Error(`Error ${res.status}: ${msg}`);
      }

      if (isMounted.current) {
        setData(payload as AIRecommendation);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('[useGetAIRecommendations] Request aborted');
        return;
      }

      if (isMounted.current) {
        setError('Unknown error occurred while fetching AI recommendations');
        console.error('[useGetAIRecommendations] error:', err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    isMounted.current = true;

    fetchRecommendations();

    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRecommendations]);

  return { data, loading, error, refetch: fetchRecommendations };
}
