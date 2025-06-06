'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/features/context/userContext';
import type { AICertificationRecommendation, UseGetAICertificationRecommendationsResponse } from '../types/CertificationTypes';

export function useGetAICertificationRecommendations(): UseGetAICertificationRecommendationsResponse {
  const { userAuth } = useUser();
  const token = userAuth?.accessToken;

  const [data, setData] = useState<AICertificationRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inCooldown = useRef(false);

  const resetState = useCallback(() => {
    if (isMounted.current) {
      setData(null);
      setLoading(false);
      setError(null);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (e) {
        console.error('Error aborting:', e);
      } finally {
        abortControllerRef.current = null;
      }
    }

    inCooldown.current = false;
  }, []);

  const fetchRecommendations = useCallback(async () => {
    if (inCooldown.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (isMounted.current) {
        setLoading(true);
        timeoutRef.current = setTimeout(() => {
          inCooldown.current = false;
          fetchRecommendations();
        }, 1000);
      }
      return;
    }

    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (e) {
        console.error('Error during abort:', e);
      } finally {
        abortControllerRef.current = null;
      }
    }

    abortControllerRef.current = new AbortController();

    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const res = await fetch('/api/ai/certifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: abortControllerRef.current.signal,
      });

      if (!isMounted.current) return;

      const payload = await res.json().catch(() => null);

      if (!isMounted.current) return;

      if (!res.ok) {
        const msg = (payload && (payload.message || payload.error)) || res.statusText;
        throw new Error(`Error ${res.status}: ${msg}`);
      }

      if (isMounted.current) {
        setData(payload as AICertificationRecommendation);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        inCooldown.current = true;
        return;
      }

      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error fetching recommendations');
        console.error('[useGetAICertificationRecommendations] error:', err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    isMounted.current = true;
    resetState();

    return () => {
      isMounted.current = false;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
          console.error('Error during unmount abort:', e);
        }
        abortControllerRef.current = null;
      }
    };
  }, [resetState]);

  return {
    data,
    loading,
    error,
    refetch: fetchRecommendations,
    reset: resetState,
  };
}
