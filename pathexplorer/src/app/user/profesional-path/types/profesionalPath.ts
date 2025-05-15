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
