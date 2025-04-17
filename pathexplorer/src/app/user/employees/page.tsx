import { PageHeader } from '@/components/GlobalComponents/pageHeader';
import { EmployeeTable } from '@/components/GlobalComponents/employeeTable';

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

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: 'John', last_name_1: 'Doe', position: 'Senior Developer', role: 'Developer', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 100 },
  { id: 2, name: 'Jane', last_name_1: 'Smith', position: 'UX Designer', role: 'Designer', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 75 },
  { id: 3, name: 'Mike', last_name_1: 'Johnson', position: 'Project Manager', role: 'Manager', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 50 },
  { id: 4, name: 'Sarah', last_name_1: 'Williams', position: 'QA Engineer', role: 'QA', assigned_project: 'None', status: 'Staff', assignment_percentage: 0 },
  { id: 5, name: 'David', last_name_1: 'Brown', position: 'Junior Developer', role: 'Developer', assigned_project: 'Internal Tools', status: 'Assigned', assignment_percentage: 100 },
  { id: 6, name: 'Emily', last_name_1: 'Davis', position: 'Business Analyst', role: 'Analyst', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 60 },
  { id: 7, name: 'Carlos', last_name_1: 'Rodriguez', position: 'DevOps Engineer', role: 'DevOps', assigned_project: 'None', status: 'Staff', assignment_percentage: 0 },
  { id: 8, name: 'Michelle', last_name_1: 'Garcia', position: 'Product Owner', role: 'Product', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 90 },
  { id: 9, name: 'Robert', last_name_1: 'Wilson', position: 'Full Stack Developer', role: 'Developer', assigned_project: 'Internal Tools', status: 'Staff', assignment_percentage: 0 },
  { id: 10, name: 'Lisa', last_name_1: 'Taylor', position: 'UI Designer', role: 'Designer', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 80 },
  { id: 11, name: 'John', last_name_1: 'Doe', position: 'Senior Developer', role: 'Developer', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 100 },
  { id: 12, name: 'Jane', last_name_1: 'Smith', position: 'UX Designer', role: 'Designer', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 75 },
  { id: 13, name: 'Mike', last_name_1: 'Johnson', position: 'Project Manager', role: 'Manager', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 50 },
  { id: 14, name: 'Sarah', last_name_1: 'Williams', position: 'QA Engineer', role: 'QA', assigned_project: 'None', status: 'Staff', assignment_percentage: 0 },
  { id: 15, name: 'David', last_name_1: 'Brown', position: 'Junior Developer', role: 'Developer', assigned_project: 'Internal Tools', status: 'Assigned', assignment_percentage: 100 },
  { id: 16, name: 'Emily', last_name_1: 'Davis', position: 'Business Analyst', role: 'Analyst', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 60 },
  { id: 17, name: 'Carlos', last_name_1: 'Rodriguez', position: 'DevOps Engineer', role: 'DevOps', assigned_project: 'None', status: 'Staff', assignment_percentage: 0 },
  { id: 18, name: 'Michelle', last_name_1: 'Garcia', position: 'Product Owner', role: 'Product', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 90 },
  { id: 19, name: 'Robert', last_name_1: 'Wilson', position: 'Full Stack Developer', role: 'Developer', assigned_project: 'Internal Tools', status: 'Staff', assignment_percentage: 0 },
  { id: 20, name: 'Lisa', last_name_1: 'Taylor', position: 'UI Designer', role: 'Designer', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 80 },
];

export default function EmployeesPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Employees"
          subtitle="Search through the employees currently registered and visualize their information."
        />

        <div className="mt-8">
          <EmployeeTable data={MOCK_EMPLOYEES} />
        </div>
      </div>
    </div>
  );
}
