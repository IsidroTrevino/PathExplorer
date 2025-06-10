export interface EmployeeSkill {
    skill_name: string;
    type: 'hard' | 'soft';
    level: number;
    skill_id: number;
}

export interface EmployeeProject {
    project_id: number;
    project_name: string;
    client: string;
    start_date: string;
    end_date: string;
    role_id: number;
    role_name: string;
    role_description: string;
    feedback: string;
}

export interface EmployeeCertification {
    name: string;
    type: string;
    description: string;
    certification_date: string;
    expiration_date: string;
    certification_id: number;
    status: 'active' | 'expired';
}

export interface EmployeeGoal {
    title: string;
    category: string;
    description: string;
    term: 'Short' | 'Medium' | 'Large';
    goal_id: number;
}

export interface Employee {
    employee_id: number;
    name: string;
    last_name_1: string;
    last_name_2: string;
    phone_number: string;
    location: string;
    capability: string;
    position: string;
    seniority: number;
    email: string;
    role: string;
    staff_days: number;
    speciality_area: string | null;
    current_project: EmployeeProject | null;
    project_history: EmployeeProject[];
    assignment_status: string;
    curriculum_url: string;
    certifications: EmployeeCertification[];
    skills: EmployeeSkill[];
    goals: EmployeeGoal[];
}
