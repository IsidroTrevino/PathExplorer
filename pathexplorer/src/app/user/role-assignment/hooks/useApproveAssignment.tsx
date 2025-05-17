'use client';

import React, { useState, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';

interface UseApproveAssignmentResponse {
  approveAssignment: (assignmentId: number | string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useApproveAssignment(): UseApproveAssignmentResponse {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const approveAssignment = useCallback(
    async (assignmentId: number | string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/assignments/${assignmentId}/approve`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userAuth?.accessToken}`,
            },
          },
        );
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      } catch (err: any) {
        console.error('Error approving assignment:', err);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    },
    [userAuth],
  );

  return { approveAssignment, loading, error };
}
