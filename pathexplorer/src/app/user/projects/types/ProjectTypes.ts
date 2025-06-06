export interface Project {
    id: string;
    project_name: string;
    client: string;
    description: string;
    start_date: string;
    end_date: string;
    employees_req: number;
    manager_id?: number;
    project_id?: number;
    manager?: string;
    roles?: Role[];
}

export interface Role {
    role_id: number;
    role_name: string;
    role_description: string;
    role_feedback: string;
    assignment_id: number | null;
    assignment_status: string | null;
    developer_id: number | null;
    developer_short_name: string | null;
}

export interface ProjectRole {
    name: string;
    description: string;
    feedback: string;
    project_id: number;
    role_id: number;
    assigned: boolean | null;
    developer_id: number | null;
    developer_name: string | null;
    skills: RoleSkill[];
}

export interface RoleSkill {
    skill_name: string;
    type: string;
    level: number;
}

export interface APIProject {
    project_id: number;
    project_name: string;
    client: string;
    description: string;
    start_date: string;
    end_date: string;
    employees_req: number;
    manager_id: number;
    manager: string;
    roles?: APIProjectRole[];
}

export interface APIProjectRole {
    role_id: number;
    role_name: string;
    role_description: string;
}

export interface GetProjectsParams {
    page?: number;
    size?: number;
    search?: string | null;
    alphabetical?: boolean | null;
    start_date?: string | null;
    end_date?: string | null;
}

export interface CreateProjectParams {
    projectName: string;
    client: string;
    startDate: Date;
    endDate: Date;
    employees_req: number;
    description: string;
}

export interface CreateProjectResponse {
    id: string;
    projectName: string;
    client: string;
    description: string;
    startDate: string;
    endDate: string;
    employees_req: number;
}

export interface EditProjectParams {
    id: string;
    projectName: string;
    client: string;
    startDate: Date;
    endDate: Date;
    employees_req: number;
    description: string;
}

export interface CreateRoleParams {
    name: string;
    description: string;
    project_id: number;
}

export interface CreateRoleSkillParams {
    roleId: number;
    skillName: string;
    level: number;
    type: 'hard' | 'soft';
}

// Recommendation Types
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

export interface RequestEmployeeParams {
    developer_id: number;
    project_role_id: number;
    project_id: number;
    comments?: string;
}
