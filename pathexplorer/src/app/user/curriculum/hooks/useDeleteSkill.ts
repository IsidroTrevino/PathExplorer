'use client';

import { useState } from 'react';
import { useUser } from '@/features/context/userContext';

export function useDeleteSkill() {
  const [loading, setLoading] = useState(false);
  const { userAuth } = useUser();

  const deleteSkill = async (id: number): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/skills/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userAuth?.accessToken}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { deleteSkill, loading };
}
