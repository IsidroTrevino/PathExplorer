import { useState, useEffect } from 'react';
import { useUser } from '@/features/context/userContext';

export interface Skill {
    skill_name: string;
    level: number;
    type: string;
}

export interface Candidate {
    developer_id: number;
    name: string;
    last_name_1: string;
    last_name_2: string;
    match_percentage: number;
}

export interface RoleRecommendation {
    role_id: number;
    name: string;
    description: string;
    feedback: string;
    project_id: number;
    skills: Skill[];
    top_candidates: Candidate[];
}

export const useGetRecommendations = (projectId: string, roleId?: string) => {
  const [recommendations, setRecommendations] = useState<RoleRecommendation[]>([]);
  const [allRoles, setAllRoles] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userAuth } = useUser();

  useEffect(() => {
    const fetchAllRoles = async () => {
      if (!projectId || !userAuth?.accessToken) return;

      try {
        const response = await fetch(`/api/projects/recommendations/${projectId}`, {
          headers: {
            Authorization: `Bearer ${userAuth.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        const roles = Array.isArray(data) ? data : [data];
        const uniqueRoles = roles.map(role => ({
          id: role.role_id,
          name: role.name,
        }));

        setAllRoles(uniqueRoles);
      } catch (err) {
        console.error('Error fetching all roles:', err);
      }
    };

    fetchAllRoles();
  }, [projectId, userAuth?.accessToken]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!projectId || !userAuth?.accessToken) return;

      setLoading(true);
      setError(null);

      try {
        let url = `/api/projects/recommendations/${projectId}`;
        if (roleId && roleId !== 'all') {
          url += `?project_role_id=${roleId}`;
        }

        console.log('Fetching recommendations from URL:', url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${userAuth.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Received recommendations data:', data);

        let recommendationsArray;
        if (Array.isArray(data)) {
          recommendationsArray = data;
        } else if (data && typeof data === 'object') {
          recommendationsArray = [data];
        } else {
          recommendationsArray = [];
        }

        setRecommendations(recommendationsArray);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to fetch recommendations. Please try again later.');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [projectId, roleId, userAuth?.accessToken]);

  return { recommendations, allRoles, loading, error };
};
