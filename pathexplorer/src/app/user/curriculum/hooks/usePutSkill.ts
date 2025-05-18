'use client';

import { useState } from 'react';
import { useUser } from '@/features/context/userContext';
import { Skill } from '../types/curriculum';

export function usePutSkill() {
  const [loading, setLoading] = useState(false);
  const { userAuth } = useUser();

  const updateSkill = async (
    id: number,
    data: Partial<Skill>,
  ): Promise<Skill> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/skills/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `${res.status} ${res.statusText}`);
      }
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  return { updateSkill, loading };
}
