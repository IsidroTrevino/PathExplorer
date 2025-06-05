import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { CreateRoleModal } from '@/app/user/projects/components/createRoleModal';
import { useCreateRole } from '@/app/user/projects/hooks/useCreateRole';
import { toast } from 'sonner';

jest.mock('@/app/user/projects/hooks/useCreateRole');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('CreateRoleModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockCreateRole = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useCreateRole as jest.Mock).mockReturnValue({
      createRole: mockCreateRole,
      isLoading: false,
      error: null,
    });
  });

  it('renders the modal when isOpen is true', () => {
    render(
      <CreateRoleModal
        isOpen={true}
        onClose={mockOnClose}
        projectId={1}
      />,
    );

    expect(screen.getByText('Create New Role')).toBeInTheDocument();
    expect(screen.getByText('Role Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <CreateRoleModal
        isOpen={false}
        onClose={mockOnClose}
        projectId={1}
      />,
    );

    expect(screen.queryByText('Create New Role')).not.toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <CreateRoleModal
        isOpen={true}
        onClose={mockOnClose}
        projectId={1}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Create Role'));
    });

    await waitFor(() => {
      expect(screen.getByText('Role name is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    expect(mockCreateRole).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    mockCreateRole.mockResolvedValue(true);

    render(
      <CreateRoleModal
        isOpen={true}
        onClose={mockOnClose}
        projectId={1}
        onSuccess={mockOnSuccess}
      />,
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter role name'), {
        target: { value: 'Developer' },
      });

      fireEvent.change(screen.getByPlaceholderText('Describe the role and responsibilities...'), {
        target: { value: 'Frontend development tasks' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Create Role'));
    });

    await waitFor(() => {
      expect(mockCreateRole).toHaveBeenCalledWith({
        name: 'Developer',
        description: 'Frontend development tasks',
        project_id: 1,
      });
    });

    expect(toast.success).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('shows error toast when createRole fails', async () => {
    mockCreateRole.mockResolvedValue(false);

    render(
      <CreateRoleModal
        isOpen={true}
        onClose={mockOnClose}
        projectId={1}
      />,
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter role name'), {
        target: { value: 'Developer' },
      });

      fireEvent.change(screen.getByPlaceholderText('Describe the role and responsibilities...'), {
        target: { value: 'Frontend development tasks' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Create Role'));
    });

    await waitFor(() => {
      expect(mockCreateRole).toHaveBeenCalled();
    });

    expect(toast.error).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    render(
      <CreateRoleModal
        isOpen={true}
        onClose={mockOnClose}
        projectId={1}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    let resolvePromise: (value: boolean) => void;
    const submissionPromise = new Promise<boolean>(resolve => {
      resolvePromise = resolve;
    });

    mockCreateRole.mockImplementation(() => {
      (useCreateRole as jest.Mock).mockReturnValue({
        createRole: mockCreateRole,
        isLoading: true,
        error: null,
      });
      return submissionPromise;
    });

    render(
      <CreateRoleModal
        isOpen={true}
        onClose={mockOnClose}
        projectId={1}
      />,
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Enter role name'), {
        target: { value: 'Developer' },
      });

      fireEvent.change(screen.getByPlaceholderText('Describe the role and responsibilities...'), {
        target: { value: 'Frontend development tasks' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Create Role'));
      await new Promise(r => setTimeout(r, 50));
    });

    expect(screen.getByText('Creating...')).toBeInTheDocument();

    const submitButton = screen.getByText('Creating...').closest('button');
    expect(submitButton).toBeDisabled();

    await act(async () => {
      resolvePromise(true);
    });

    await waitFor(() => {
      expect(mockCreateRole).toHaveBeenCalled();
    });
  });
});
