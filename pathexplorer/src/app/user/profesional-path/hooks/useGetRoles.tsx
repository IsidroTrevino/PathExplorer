// src/hooks/useGetRoles.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import type { RoleLog, UseGetRolesResponse } from '../types/profesionalPath';

export function useGetRoles(): UseGetRolesResponse {
  const { userAuth } = useUser();
  const token = userAuth?.accessToken;

  const [data, setData] = useState<RoleLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        return
      }

      const res = await fetch('/api/project-roles/roles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('[useGetRoles] status:', res.status);

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (payload && (payload.message || payload.error)) ||
          res.statusText;
        throw new Error(`Error ${res.status}: ${msg}`);
      }

      setData(payload as RoleLog[]);
    } catch (err: any) {
      console.error('[useGetRoles] fetch error:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { data, loading, error, refetch: fetchRoles };
}