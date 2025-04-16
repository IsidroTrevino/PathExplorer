'use client';

import React, { useState, useMemo } from 'react';

export interface Employee {
    id: number;
    name: string;
    last_name_1: string;
    position: string;
    role: string;
    assigned_project: string;
    status: 'Available' | 'Assigned' | 'On Leave' | 'Training';
    assignment_percentage: number;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: 'John', last_name_1: 'Doe', position: 'Senior Developer', role: 'Developer', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 100 },
  { id: 2, name: 'Jane', last_name_1: 'Smith', position: 'UX Designer', role: 'Designer', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 75 },
  { id: 3, name: 'Mike', last_name_1: 'Johnson', position: 'Project Manager', role: 'Manager', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 50 },
  { id: 4, name: 'Sarah', last_name_1: 'Williams', position: 'QA Engineer', role: 'QA', assigned_project: 'None', status: 'Available', assignment_percentage: 0 },
  { id: 5, name: 'David', last_name_1: 'Brown', position: 'Junior Developer', role: 'Developer', assigned_project: 'Internal Tools', status: 'Assigned', assignment_percentage: 100 },
  { id: 6, name: 'Emily', last_name_1: 'Davis', position: 'Business Analyst', role: 'Analyst', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 60 },
  { id: 7, name: 'Carlos', last_name_1: 'Rodriguez', position: 'DevOps Engineer', role: 'DevOps', assigned_project: 'None', status: 'Training', assignment_percentage: 0 },
  { id: 8, name: 'Michelle', last_name_1: 'Garcia', position: 'Product Owner', role: 'Product', assigned_project: 'PathExplorer', status: 'Assigned', assignment_percentage: 90 },
  { id: 9, name: 'Robert', last_name_1: 'Wilson', position: 'Full Stack Developer', role: 'Developer', assigned_project: 'Internal Tools', status: 'On Leave', assignment_percentage: 0 },
  { id: 10, name: 'Lisa', last_name_1: 'Taylor', position: 'UI Designer', role: 'Designer', assigned_project: 'Client Portal', status: 'Assigned', assignment_percentage: 80 },
];

interface EmployeeTableProps {
    employees?: Employee[];
}

export const EmployeeTable = ({ employees = MOCK_EMPLOYEES }: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const uniqueRoles = useMemo(() => {
    const roles = new Set(employees.map(emp => emp.role));
    return Array.from(roles);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const fullName = `${emp.name} ${emp.last_name_1}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) &&
                    (roleFilter === '' || emp.role === roleFilter);
      })
      .sort((a, b) => {
        const nameA = `${a.name} ${a.last_name_1}`.toLowerCase();
        const nameB = `${b.name} ${b.last_name_1}`.toLowerCase();
        return sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
  }, [employees, searchTerm, roleFilter, sortOrder]);

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
    case 'Available': return 'bg-green-100 text-green-800';
    case 'Assigned': return 'bg-blue-100 text-blue-800';
    case 'On Leave': return 'bg-yellow-100 text-yellow-800';
    case 'Training': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <button
            className="flex items-center gap-1 p-2 border border-gray-300 rounded-md"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <span>Sort</span>
            {sortOrder === 'asc' ?
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5z"/>
                <path d="M7 14V2h2v12H7zm3-12h4a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
              </svg>
            }
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{employee.name} {employee.last_name_1}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{employee.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{employee.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {employee.assigned_project === 'None' ?
                    <span className="text-gray-400">Unassigned</span> :
                    employee.assigned_project
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${employee.assignment_percentage}%` }}>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {employee.assignment_percentage}%
                  </span>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                No employees found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
