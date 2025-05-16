'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/features/context/userContext';
import { Skill } from '../types/curriculum';

interface UseGetSkillsParams {
  type?: 'hard' | 'soft' | null;
}

interface UseGetSkillsResponse {
  data: Skill[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetSkills({
  type = null,
}: UseGetSkillsParams = {}): UseGetSkillsResponse {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  const fetchSkills = useCallback (async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/skills/my-skills';
      if (type) url += `?type=${encodeURIComponent(type)}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userAuth?.accessToken}`,
        },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const skills: Skill[] = await res.json();
      setData(skills);
    } catch (err) {
      setError('An unknown error occurred');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  }, [type, userAuth]);

  useEffect(() => {
    if (!userAuth) return;
    fetchSkills();
  }, [type, userAuth]);

  return { data, loading, error, refetch: fetchSkills };
}
