'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';

export interface ProjectMissing {
    project_id: number;
    project_name: string;
    missing: number;
}

export interface SkillCount {
    skill_name: string;
    count: number;
}

export interface TfsStats {
    employees: {
        not_assigned: number;
    };
    requests: {
        pending_assignments: number;
    };
    projects: {
        top_5_missing_employees: ProjectMissing[];
    };
    skills: {
        top_7_project_skills: SkillCount[];
    };
}

export function useTfsStats() {
  const { userAuth } = useUser();
  const token = userAuth?.accessToken;

  const [data, setData] = useState<TfsStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStats = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stats/tfs/summary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: abortControllerRef.current.signal,
      });

      const payload = await res.json();

      if (!res.ok) {
        const msg = (payload && (payload.message || payload.error)) || res.statusText;
        throw new Error(`Error ${res.status}: ${msg}`);
      }

      setData(payload as TfsStats);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Error fetching TFS stats');
        console.error('[useTfsStats] error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchStats]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}
