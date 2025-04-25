'use client';

import { useEffect, useState } from 'react';
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

  const fetchSkills = async () => {
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
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [type, userAuth]);

  return { data, loading, error, refetch: fetchSkills };
}
