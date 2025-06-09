// src/app/user/employees/employee/types/index.ts
export interface EmployeeSkill {
    skill_name: string;
    type: 'hard' | 'soft';
    level: number;
    skill_id: number;
}

export interface EmployeeProject {
    project_id: number;
    project_name: string;
    project_start_date: string;
    project_end_date: string;
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
    project: EmployeeProject;
    curriculum: string;
    assignment_status: string;
    certifications: EmployeeCertification[];
    skills: EmployeeSkill[];
}
