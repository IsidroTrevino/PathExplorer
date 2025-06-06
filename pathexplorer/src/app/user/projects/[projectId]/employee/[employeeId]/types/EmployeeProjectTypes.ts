export interface RoleSkill {
    skill_name: string;
    type: string;
    level: number;
}

export interface EmployeeSkill {
    skill_id: number;
    skill_name: string;
    level: number;
    type: string;
}

export interface ProjectRole {
    role_id: number;
    name?: string;
    role_name?: string;
    description?: string;
    role_description?: string;
    skills?: RoleSkill[];
}

export interface Employee {
    name: string;
    last_name_1: string;
    last_name_2?: string;
    email: string;
    role: string;
    location: string;
    capability: string;
    seniority: string;
    skills: EmployeeSkill[];
}

export interface Project {
    id: string;
    project_name: string;
    client: string;
    start_date: string;
    end_date: string;
    manager: string;
    description: string;
}

export interface RoleMatch {
    role_id: number;
    name: string;
    description: string;
    skills: RoleSkill[];
    matchPercentage: number;
    matchedSkills: EmployeeSkill[];
}
