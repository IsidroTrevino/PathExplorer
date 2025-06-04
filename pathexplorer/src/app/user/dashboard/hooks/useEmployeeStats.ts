'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';

export interface SkillCount {
    name: string;
    count: number;
}

export interface EmployeeStats {
    general: {
        total_employees: number;
        top_technical_skills: SkillCount[];
        top_soft_skills: SkillCount[];
        top_certifications: SkillCount[];
    };
    personal: {
        certifications: {
            expired: number;
            active: number;
            expiring_soon: number;
            by_type: Record<string, number>;
        };
        skills: {
            by_type: {
                hard: number;
                soft: number;
            };
        };
    };
}

export function useEmployeeStats() {
  const { userAuth } = useUser();
  const token = userAuth?.accessToken;

  const [data, setData] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchStats = useCallback(async () => {
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

    setLoading(true);
    setError(null);

    try {

      const res = await fetch('/api/stats/employee/summary', {
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

      setData(payload as EmployeeStats);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Error fetching employee stats');
        console.error('[useEmployeeStats] error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();

    return () => {
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
          console.error('Error during unmount abort:', e);
        }
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
