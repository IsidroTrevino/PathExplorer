export interface APIEmployeeResponse {
    items: APIEmployee[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface APIEmployee {
    employee_id: number;
    name: string;
    last_name_1: string;
    last_name_2: string;
    phone_number: string;
    location: string;
    capability: string;
    position: string;
    seniority: number;
    role: string;
    project: {
        project_id: number;
        project_name: string;
        project_start_date: string;
        project_end_date: string;
    } | null;
    assignment_status: string;
    days_since_last_project: number;
}

// Client-Side Types
export interface Employee {
    id: number;
    name: string;
    last_name_1: string;
    position: string;
    role: string;
    assigned_project: string;
    status: 'Assigned' | 'Staff';
    assignment_percentage: number;
}

export interface UseGetEmployeesParams {
    page?: number;
    size?: number;
    role?: string | null;
    alphabetical?: boolean | null;
    search?: string | null;
    assigned?: boolean | null;
}

export interface EmployeesResponse {
    data: Employee[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}
