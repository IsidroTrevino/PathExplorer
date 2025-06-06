import { Project } from '../types/EmployeeProjectTypes';

export function ProjectInfo({ project }: { project: Project }) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Project Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Project Name</p>
          <p>{project.project_name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Client</p>
          <p>{project.client}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Start Date</p>
          <p>{project.start_date}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">End Date</p>
          <p>{project.end_date}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Manager</p>
          <p>{project.manager}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Description</p>
          <p>{project.description}</p>
        </div>
      </div>
    </div>
  );
}
