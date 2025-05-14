'use client';

import { useEffect, useState } from 'react';

interface Employee {
  id: string;
  name: string;
  role: string;
}

export const AvailableEmployees = ({ projectId }: { projectId: string }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`/api/users`);
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [projectId]);

  if (loading) return <p>Loading employees...</p>;

  return (
    <div className="mt-4 border p-4 rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Available Employees:</h3>
      {employees.length > 0 ? (
        employees.map((emp) => (
          <p key={emp.id}>{emp.name} - {emp.role}</p>
        ))
      ) : (
        <p>No available employees found.</p>
      )}
    </div>
  );
};
