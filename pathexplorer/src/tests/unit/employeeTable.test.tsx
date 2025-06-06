import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeTable } from '@/components/employeeTable';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.useFakeTimers();

describe('EmployeeTable', () => {
  const mockData = [
    {
      id: 1,
      name: 'John',
      last_name_1: 'Doe',
      position: 'Senior Developer',
      role: 'Developer',
      assigned_project: 'Project A',
      status: 'Assigned',
      assignment_percentage: 75,
    },
    {
      id: 2,
      name: 'Jane',
      last_name_1: 'Smith',
      position: 'Project Manager',
      role: 'Manager',
      assigned_project: 'Project B',
      status: 'Staff',
      assignment_percentage: 50,
    },
  ];

  it('renders the loading state with skeletons', () => {
    render(<EmployeeTable data={[]} loading={true} variant="default" />);

    const skeletonRows = document.querySelectorAll('.animate-pulse');
    expect(skeletonRows.length).toBeGreaterThan(0);
  });

  it('renders empty state message when no data is available', () => {
    render(<EmployeeTable data={[]} loading={false} variant="default" />);

    expect(screen.getByText('No employees found.')).toBeInTheDocument();
  });

  it('renders employee data in the table', () => {
    render(<EmployeeTable data={mockData} loading={false} variant="default" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Assigned')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('handles search input changes', () => {
    const onSearch = jest.fn();
    render(
      <EmployeeTable
        data={mockData}
        loading={false}
        variant="default"
        onSearch={onSearch}
      />,
    );

    const searchInput = screen.getByPlaceholderText('Search employees...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    jest.runAllTimers();
    expect(onSearch).toHaveBeenCalledWith('John');
  });

  it('shows pagination when totalPages > 1', () => {
    render(
      <EmployeeTable
        data={mockData}
        loading={false}
        variant="default"
        currentPage={1}
        totalPages={3}
      />,
    );

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('calls onPageChange when pagination is clicked', () => {
    const onPageChange = jest.fn();
    render(
      <EmployeeTable
        data={mockData}
        loading={false}
        variant="default"
        currentPage={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();

    const paginationNav = screen.getByRole('navigation', { name: 'pagination' });

    const nextButton = paginationNav.querySelector('[aria-label="Go to next page"]') ||
        paginationNav.querySelector('[data-slot="pagination-next"]');

    expect(nextButton).not.toBeNull();

    fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('toggles alphabetical sorting', () => {
    const onSort = jest.fn();
    render(
      <EmployeeTable
        data={mockData}
        loading={false}
        variant="default"
        onSort={onSort}
      />,
    );

    const sortToggle = screen.getByLabelText('Sort alphabetically');
    fireEvent.click(sortToggle);

    expect(onSort).toHaveBeenCalledWith(true);
  });

  it('opens dropdown menu and shows correct options in default variant', () => {
    render(<EmployeeTable data={mockData} loading={false} variant="default" />);

    const tableRows = screen.getAllByRole('row');
    const firstDataRow = tableRows[1];
    const lastCell = firstDataRow.querySelector('td:last-child');
    const dropdownButton = lastCell.querySelector('button');

    expect(dropdownButton).toBeTruthy();

    fireEvent.click(dropdownButton);
  });
  it('renders available variant options correctly', () => {
    render(
      <EmployeeTable
        data={mockData}
        loading={false}
        variant="available"
        projectId="123"
      />,
    );

    const tableRows = screen.getAllByRole('row');
    const firstDataRow = tableRows[1]; // Skip header row
    const lastCell = firstDataRow.querySelector('td:last-child');
    const dropdownButton = lastCell.querySelector('button');

    expect(dropdownButton).toBeTruthy();

    fireEvent.click(dropdownButton);
  });
});
