'use client';

import { useState } from 'react';
import { useUser } from '@/features/context/userContext';
import { Skill } from '../types/curriculum';

interface UsePostSkillResponse {
  addSkill: (skill: Omit<Skill, 'id'>) => Promise<Skill>;
  loading: boolean;
  error: string | null;
}

export function usePostSkill(): UsePostSkillResponse {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const addSkill = async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/skills/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
        body: JSON.stringify(skill),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err) {
      setError(err.message || 'An unknown error occurred');
      console.error('Error adding skill:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addSkill, loading, error };
}
