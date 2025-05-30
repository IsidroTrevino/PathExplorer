export interface RoleLog {
  role_log_id: number;
  developer_id: number;
  project_role_id: number;
  role_name: string;
  approval_date: string;
  role_description: string;
  role_feedback: string;
  project_id: number;
  project_name: string;
  project_description: string;
}

export interface UseGetRolesResponse {
  data: RoleLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface FeedbackItem {
  action: string;
  description: string;
}

export interface AIRecommendation {
  message: string;
  feedback: FeedbackItem[];
}

export interface UseGetAIRecommendationsResponse {
  data: AIRecommendation | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

export interface RoleSkill {
  skill_name: string;
  type: 'soft' | 'hard';
  level: number;
}

export interface Recommendation {
  role_name: string;
  role_description: string;
  role_skills: RoleSkill[];
}
