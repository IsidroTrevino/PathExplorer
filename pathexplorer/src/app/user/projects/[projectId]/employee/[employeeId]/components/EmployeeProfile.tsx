import { Employee } from '../types/EmployeeProjectTypes';

export function EmployeeProfile({ employee }: { employee: Employee }) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Employee Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p>{employee.name} {employee.last_name_1} {employee.last_name_2}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p>{employee.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Role</p>
          <p>{employee.role}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Location</p>
          <p>{employee.location}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Capability</p>
          <p>{employee.capability}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Seniority</p>
          <p>{employee.seniority}</p>
        </div>
      </div>
    </div>
  );
}
