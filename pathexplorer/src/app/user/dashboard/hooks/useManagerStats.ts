'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';

export interface ProjectCount {
    project_id: number;
    project_name: string;
    employee_count: number;
}

export interface SkillCount {
    skill_name: string;
    count: number;
}

export interface SeniorityCount {
    seniority: number;
    count: number;
}

export interface ManagerStats {
    employees: {
        total: number;
        assigned: number;
        not_assigned: number;
        by_role: Record<string, number>;
        by_seniority: SeniorityCount[];
    };
    assignment: {
        average_assignment_percentage: number;
    };
    projects: {
        active: number;
        top_5_by_employees: ProjectCount[];
    };
    skills: {
        top_7_project_skills: SkillCount[];
    };
}

export function useManagerStats() {
  const { userAuth } = useUser();
  const token = userAuth?.accessToken;

  const [data, setData] = useState<ManagerStats | null>(null);
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
      const res = await fetch('/api/stats/manager/summary', {
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

      setData(payload as ManagerStats);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Error fetching manager stats');
        console.error('[useManagerStats] error:', err);
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
