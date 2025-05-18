import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '@/components/GlobalComponents/projectCard';
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

jest.mock('@/features/projects/useDeleteProjectRole', () => ({
  useDeleteProjectRole: () => ({
    deleteProjectRole: jest.fn().mockResolvedValue(true),
    loading: false,
    error: null,
  }),
}));

jest.mock('@/features/hooks/useConfirm', () => ({
  useConfirm: () => [
    MockConfirmDialog,
    jest.fn().mockResolvedValue(true),
  ],
}));

jest.mock('@/features/projects/useAddRoleSkillModal', () => ({
  useAddRoleSkillModal: () => ({
    onOpen: jest.fn(),
    onClose: jest.fn(),
    isOpen: false,
    roleId: null,
    setRoleId: jest.fn(),
  }),
}));

jest.mock('@/features/projects/useCreateRoleModal', () => ({
  useCreateRoleModal: () => ({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
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
});
