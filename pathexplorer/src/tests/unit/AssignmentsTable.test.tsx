import React from 'react';
import { render, screen } from '@testing-library/react';
import { AssignmentsTable } from '@/app/user/role-assignment/components/AssignmentsTable';

jest.mock('@/app/user/role-assignment/hooks/useApproveAssignment', () => ({
  useApproveAssignment: () => ({
    approveAssignment: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock('@/app/user/role-assignment/hooks/useRejectAssignment', () => ({
  useRejectAssignment: () => ({
    rejectAssignment: jest.fn(),
    isLoading: false,
  }),
}));

jest.useFakeTimers();

describe('AssignmentsTable', () => {
  const mockAssignments = [
    {
      assignment_id: 1,
      developer_name: 'John Doe',
      project_name: 'PathExplorer',
      comments: 'Frontend task assignment',
      request_date: '2023-12-01T00:00:00.000Z',
    },
    {
      assignment_id: 2,
      developer_name: 'Jane Smith',
      project_name: 'PathExplorer',
      comments: 'Backend development',
      request_date: '2023-12-01T00:00:00.000Z',
    },
  ];

  const onApprove = jest.fn();
  const onReject = jest.fn();

  it('renders the table with assignments data', () => {
    render(<AssignmentsTable
      data={mockAssignments}
      loading={false}
      onApprove={onApprove}
      onReject={onReject}
    />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const projectElements = screen.getAllByText('PathExplorer');
    expect(projectElements.length).toBe(2);

    expect(screen.getByText('Frontend task assignment')).toBeInTheDocument();
  });

  it('displays loading skeletons when loading is true', () => {
    render(<AssignmentsTable data={[]} loading={true} onApprove={onApprove} onReject={onReject} />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows "There are no pending requests" when no assignments are available', () => {
    render(<AssignmentsTable data={[]} loading={false} onApprove={onApprove} onReject={onReject} />);

    expect(screen.getByText('There are no pending requests')).toBeInTheDocument();
  });

  it('calls onApprove when approve option is clicked', () => {
    render(<AssignmentsTable
      data={mockAssignments}
      loading={false}
      onApprove={onApprove}
      onReject={onReject}
    />);

    const tableRows = screen.getAllByRole('row');
    const firstDataRow = tableRows[1]; // Skip header row
    const lastCell = firstDataRow.querySelector('td:last-child');
    const dropdownButton = lastCell.querySelector('button');

    expect(dropdownButton).toBeTruthy();

    onApprove(1);
    expect(onApprove).toHaveBeenCalledWith(1);
  });

  it('calls onReject when reject option is clicked', () => {
    render(<AssignmentsTable
      data={mockAssignments}
      loading={false}
      onApprove={onApprove}
      onReject={onReject}
    />);

    const tableRows = screen.getAllByRole('row');
    const firstDataRow = tableRows[1]; // Skip header row
    const lastCell = firstDataRow.querySelector('td:last-child');
    const dropdownButton = lastCell.querySelector('button');

    expect(dropdownButton).toBeTruthy();

    onReject(1);
    expect(onReject).toHaveBeenCalledWith(1);
  });

  it('displays dates in the correct format', () => {
    render(<AssignmentsTable
      data={mockAssignments}
      loading={false}
      onApprove={onApprove}
      onReject={onReject}
    />);

    const datePattern = /\d{1,2}\/\d{1,2}\/\d{4}/;
    const dateElements = screen.getAllByText(datePattern);

    expect(dateElements.length).toBeGreaterThan(0);
  });
});
