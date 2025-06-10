import { MapPin, Phone, Mail } from 'lucide-react';
import type { Employee } from '../types/EmployeeTypes';

interface EmployeePersonalInfoProps {
  employee: Employee;
}

export function EmployeePersonalInfo({ employee }: EmployeePersonalInfoProps) {
  return (
    <div className="bg-white rounded-lg border p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Personal Information</h2>

      <div className="space-y-3">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <span>{employee.location}</span>
        </div>

        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <span>{employee.phone_number}</span>
        </div>

        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
          <span className="break-all">{employee.email}</span>
        </div>
      </div>
    </div>
  );
}
