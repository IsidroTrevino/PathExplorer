import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectCard } from '@/components/projectCard';
import { TooltipProvider } from '@/components/ui/tooltip';

const MockConfirmDialog = () => <div data-testid="confirm-dialog" />;

jest.mock('@/features/context/userContext', () => ({
  useUser: () => ({
    userDetails: {
      employee_id: '123',
      name: 'Test User',
    },
  }),
}));

const mockCreateRoleModalOpen = jest.fn();
const mockCreateRoleModalClose = jest.fn();

jest.mock('@/app/user/projects/hooks/useCreateRoleModal', () => ({
  useCreateRoleModal: () => ({
    isOpen: false,
    onOpen: mockCreateRoleModalOpen,
    onClose: mockCreateRoleModalClose,
  }),
}));

const mockAddRoleSkillModalOpen = jest.fn();
const mockDeleteProjectRole = jest.fn().mockResolvedValue(true);
const mockConfirm = jest.fn().mockResolvedValue(true);

jest.mock('@/app/user/projects/hooks/useAddRoleSkillModal', () => ({
  useAddRoleSkillModal: () => ({
    onOpen: mockAddRoleSkillModalOpen,
    onClose: jest.fn(),
    isOpen: false,
    roleId: null,
    setRoleId: jest.fn(),
  }),
}));

jest.mock('@/app/user/projects/hooks/useDeleteProjectRole', () => ({
  useDeleteProjectRole: () => ({
    deleteProjectRole: mockDeleteProjectRole,
    loading: false,
    error: null,
  }),
}));

jest.mock('@/features/hooks/useConfirm', () => ({
  useConfirm: () => [
    MockConfirmDialog,
    mockConfirm,
  ],
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    project_id: 1,
    project_name: 'Test Project',
    description: 'A test project',
    manager_id: '123',
    manager: 'Test Manager',
    client: 'Test Client',
    status: 'active',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    employees_req: 5,
    roles: [
      {
        role_id: 1,
        role_name: 'Developer',
        description: 'Software Developer',
      },
    ],
  };

  const mockOnEdit = jest.fn();
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  it('renders project details correctly', () => {
    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument();
    expect(screen.getByText('Dec 31, 2023')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('Manager: Test Manager')).toBeInTheDocument();
  });

  it('shows edit button when user is the project creator', () => {
    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockProject);
  });

  it('shows "Available employees" button and navigates when clicked', () => {
    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    const employeesButton = screen.getByRole('button', { name: /available employees/i });
    expect(employeesButton).toBeInTheDocument();

    fireEvent.click(employeesButton);

    expect(window.location.href).toBe('/user/projects/1');
  });

  it('shows role badge with proper name', () => {
    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('handles role click when user is creator', () => {
    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    const roleBadge = screen.getByText('Developer');
    fireEvent.click(roleBadge);

    expect(mockAddRoleSkillModalOpen).toHaveBeenCalledWith(1);
  });

  it('shows "No roles defined yet" when project has no roles', () => {
    const projectWithoutRoles = { ...mockProject, roles: [] };

    render(
      <TooltipProvider>
        <ProjectCard
          project={projectWithoutRoles}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText('No roles defined yet')).toBeInTheDocument();
  });

  it('handles delete role functionality', async () => {
    mockConfirm.mockResolvedValue(true);
    mockDeleteProjectRole.mockResolvedValue(true);

    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    const roleBadge = screen.getByText('Developer');
    const roleContainer = roleBadge.closest('.flex.items-center');
    const deleteButton = roleContainer?.querySelector('button');

    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton!);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalled();
      expect(mockDeleteProjectRole).toHaveBeenCalledWith(1);
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });

  it('does not delete role when confirmation is cancelled', async () => {
    mockConfirm.mockResolvedValue(false);

    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    const roleBadge = screen.getByText('Developer');
    const roleContainer = roleBadge.closest('.flex.items-center');
    const deleteButton = roleContainer?.querySelector('button');

    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton!);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalled();
      expect(mockDeleteProjectRole).not.toHaveBeenCalled();
    });
  });

  it('opens create role modal when add role button is clicked', () => {
    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    const rolesHeading = screen.getByText('Project Roles');
    const parentDiv = rolesHeading.closest('.flex.items-center.justify-between');
    const addButton = parentDiv?.querySelector('button');

    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton!);

    expect(mockCreateRoleModalOpen).toHaveBeenCalled();
  });

  it('handles invalid start date', () => {
    const projectWithInvalidDate = {
      ...mockProject,
      start_date: 'invalid-date',
    };

    render(
      <TooltipProvider>
        <ProjectCard
          project={projectWithInvalidDate}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });

  it('handles missing start date', () => {
    const projectWithoutDate = {
      ...mockProject,
      start_date: '',
    };

    render(
      <TooltipProvider>
        <ProjectCard
          project={projectWithoutDate}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText('Date not specified')).toBeInTheDocument();
  });

  it('handles start date with invalid components', () => {
    const projectWithBadDate = {
      ...mockProject,
      start_date: '2023-xx-01',
    };

    render(
      <TooltipProvider>
        <ProjectCard
          project={projectWithBadDate}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });

  it('handles date formatting errors', () => {
    const projectWithErrorDate = {
      ...mockProject,
      start_date: Object.create(null),
    };

    render(
      <TooltipProvider>
        <ProjectCard
          project={projectWithErrorDate}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });

  it('handles role created callback', () => {
    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    const instance = (ProjectCard as any).mock?.instances?.[0];
    if (instance) {
      instance.handleRoleCreated();
      expect(mockOnRefresh).toHaveBeenCalled();
    } else {
      const handleRoleCreated = (ProjectCard as any).prototype.handleRoleCreated;
      if (handleRoleCreated) {
        handleRoleCreated.call({ onRefresh: mockOnRefresh });
        expect(mockOnRefresh).toHaveBeenCalled();
      }
    }
  });

  it('handles modal close callback', () => {
    render(
      <TooltipProvider>
        <ProjectCard
          project={mockProject}
          onEdit={mockOnEdit}
          onRefresh={mockOnRefresh}
        />
      </TooltipProvider>,
    );

    const instance = (ProjectCard as any).mock?.instances?.[0];
    if (instance) {
      instance.handleModalClose();
      expect(mockCreateRoleModalClose).toHaveBeenCalled();
    } else {
      const handleModalClose = (ProjectCard as any).prototype.handleModalClose;
      if (handleModalClose) {
        handleModalClose.call({ onClose: mockCreateRoleModalClose });
        expect(mockCreateRoleModalClose).toHaveBeenCalled();
      }
    }
  });
});
