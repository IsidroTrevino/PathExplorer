// src/app/employees/employee/components/EmployeeHeader.tsx
import { Badge } from '@/components/ui/badge';

export function EmployeeHeader({ employee }) {
  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {employee.name} {employee.last_name_1} {employee.last_name_2}
          </h1>
          <p className="text-gray-500">{employee.position}</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-4">
          <Badge className={`${
            employee.assignment_status === 'Assigned'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {employee.assignment_status}
          </Badge>

          <div className="text-sm">
            <span className="font-medium">Role:</span> {employee.role}
          </div>

          <div className="text-sm">
            <span className="font-medium">Capability:</span> {employee.capability}
          </div>
        </div>
      </div>
    </div>
  );
}
