'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, ChevronDown, ChevronUp, Search, Filter, X, EyeIcon, Trash2Icon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Employee {
  id: number;
  name: string;
  last_name_1: string;
  position: string;
  role: string;
  assigned_project: string;
  status: 'Assigned' | 'Staff';
  assignment_percentage: number;
}

interface EmployeeTableProps {
  data: Employee[];
  onDelete?: (id: number) => void;
}

export function EmployeeTable({ data, onDelete }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const rowsPerPage = 10;

  useEffect(() => {
    setEmployees(data);
  }, [data]);

  const uniqueProjects = Array.from(new Set(employees.map(e => e.assigned_project))).sort();
  const uniquePositions = Array.from(new Set(employees.map(e => e.position))).sort();

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.name} ${employee.last_name_1}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.assigned_project.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : employee.status === statusFilter;
    const matchesProject = projectFilter === 'all' ? true : employee.assigned_project === projectFilter;
    const matchesPosition = positionFilter === 'all' ? true : employee.position === positionFilter;

    return matchesSearch && matchesStatus && matchesProject && matchesPosition;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortField === 'name') {
      const aFullName = `${a.name} ${a.last_name_1}`;
      const bFullName = `${b.name} ${b.last_name_1}`;
      if (aFullName < bFullName) return sortDirection === 'asc' ? -1 : 1;
      if (aFullName > bFullName) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    } else {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, projectFilter, positionFilter, searchTerm]);

  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const pageCount = Math.ceil(sortedEmployees.length / rowsPerPage);

  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof Employee }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />;
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setProjectFilter('all');
    setPositionFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Filters:</span>
            {(statusFilter !== 'all' || projectFilter !== 'all' || positionFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={resetFilters}
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map(project => (
                <SelectItem key={project} value={project}>{project}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {uniquePositions.map(position => (
                <SelectItem key={position} value={position}>{position}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                    Name <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('position')}
              >
                <div className="flex items-center">
                    Position <SortIcon field="position" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">
                    Role <SortIcon field="role" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('assigned_project')}
              >
                <div className="flex items-center">
                    Assigned Project <SortIcon field="assigned_project" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                    Status <SortIcon field="status" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('assignment_percentage')}
              >
                <div className="flex items-center">
                    Assignment % <SortIcon field="assignment_percentage" />
                </div>
              </TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                      No employees found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{`${employee.name} ${employee.last_name_1}`}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.assigned_project}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(employee.status === 'Assigned' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800')}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.assignment_percentage}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          console.log('View employee:', employee);
                        }}>
                          <EyeIcon/>
                          View Employee
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            if (onDelete) {
                              onDelete(employee.id);
                            } else {
                              console.log('Delete employee:', employee);
                              if (confirm(`Are you sure you want to delete ${employee.name} ${employee.last_name_1}?`)) {
                                setEmployees(prev => prev.filter(e => e.id !== employee.id));
                              }
                            }
                          }}
                        >
                          <Trash2Icon/>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage > 1 ? (
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                />
              ) : (
                <PaginationPrevious
                  className="pointer-events-none opacity-50"
                  onClick={() => {}}
                />
              )}
            </PaginationItem>
            <PaginationItem className="flex items-center">
              <span className="text-sm">
          Page {currentPage} of {pageCount}
              </span>
            </PaginationItem>
            <PaginationItem>
              {currentPage < pageCount ? (
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                />
              ) : (
                <PaginationNext
                  className="pointer-events-none opacity-50"
                  onClick={() => {}}
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
