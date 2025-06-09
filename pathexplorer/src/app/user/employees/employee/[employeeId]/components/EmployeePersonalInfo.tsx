// src/app/user/employees/employee/[employeeId]/components/EmployeePersonalInfo.tsx
import { MapPin, Phone, Mail, Briefcase } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { Employee, EmployeeProject } from '../types/EmployeeTypes';

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

      {employee.project && (
        <div className="mt-5 pt-5 border-t">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Current Project</h2>
          </div>
          <ProjectTimeline project={employee.project} employeeRole={employee.role} />
        </div>
      )}
    </div>
  );
}

// The rest of the component remains the same

interface ProjectTimelineProps {
  project: EmployeeProject;
  employeeRole: string;
}

function ProjectTimeline({ project, employeeRole }: ProjectTimelineProps) {
  return (
    <div className="relative pl-4">
      <div className="absolute top-0 bottom-0 left-2 w-1 bg-gradient-to-b from-purple-400 to-purple-100 rounded-full z-0" />
      <ProjectTimelineItem project={project} employeeRole={employeeRole} />
    </div>
  );
}

interface ProjectTimelineItemProps {
  project: EmployeeProject;
  employeeRole: string;
}

function ProjectTimelineItem({ project, employeeRole }: ProjectTimelineItemProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Safe date formatting with error handling
  let dateRange = 'Date not specified';
  try {
    if (project.project_start_date) {
      const startDate = format(parseISO(project.project_start_date), 'MMM d, yyyy');
      const endDate = project.project_end_date
        ? format(parseISO(project.project_end_date), 'MMM d, yyyy')
        : 'Present';
      dateRange = `${startDate} - ${endDate}`;
    }
  } catch (error) {
    console.error('Error formatting date:', error);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="relative flex items-start gap-4 pl-6 pb-1"
    >
      {/* Point marker */}
      <motion.span
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="absolute left-0 top-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md z-10"
      />
      {/* Content */}
      <div className="bg-purple-50 rounded-lg p-3 w-full shadow-sm">
        <div className="text-xs font-bold text-purple-700">{dateRange}</div>
        <h3 className="text-base font-semibold text-gray-800 mt-1">{project.project_name}</h3>
        <div className="mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full inline-block">
          {employeeRole}
        </div>
      </div>
    </motion.div>
  );
}
