'use client';

import React, { useState, useRef } from 'react';
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
import { MoreHorizontal, Search, EyeIcon, Trash2Icon } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Employee } from '@/features/user/useGetEmployees';

interface EmployeeTableProps {
  data: Employee[];
  onDelete?: (id: number) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  onRoleFilter?: (role: string | null) => void;
  onSort?: (isAlphabetical: boolean | null) => void;
  onSearch?: (search: string | null) => void;
  isExternalPagination?: boolean;
  loading?: boolean;
  currentSearch?: string | null;
  currentRole?: string | null;
  currentAlphabetical?: boolean | null;
}

export function EmployeeTable({
  data,
  loading,
  totalPages,
  currentPage,
  onPageChange,
  onSearch,
  onRoleFilter,
  onSort,
  onDelete,
}: EmployeeTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAlphabetical, setIsAlphabetical] = useState(false);
  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current);
    }

    debouncedSearchRef.current = setTimeout(() => {
      onSearch && onSearch(value);
    }, 300);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    onRoleFilter && onRoleFilter(value === 'all' ? null : value);
  };

  const handleAlphabeticalToggle = (value: boolean) => {
    setIsAlphabetical(value);
    onSort && onSort(value);
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
    case 'Assigned': return 'bg-blue-100 text-blue-800';
    case 'Staff': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
    }
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
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Select
            value={roleFilter}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="TFS">TFS</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Switch
              id="alphabetical-sort"
              checked={isAlphabetical}
              onCheckedChange={handleAlphabeticalToggle}
              className="data-[state=checked]:bg-[#7500C0] data-[state=checked]:text-white"
            />
            <label htmlFor="alphabetical-sort" className="text-sm font-medium">
                Sort alphabetically
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="h-[calc(100vh-380px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center">Name</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Position</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Role</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Project</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Status</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Assignment</div>
                </TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(7).fill(0).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="animate-pulse">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-5 w-[120px] bg-gray-200" />
                        <Skeleton className="h-3 w-[80px] bg-gray-100" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className={`h-5 w-[${80 + (i % 3) * 10}px] bg-gray-200`} />
                    </TableCell>
                    <TableCell>
                      <Skeleton className={`h-5 w-[${70 + (i % 4) * 8}px] bg-gray-200`} />
                    </TableCell>
                    <TableCell>
                      <Skeleton className={`h-5 w-[${100 + (i % 3) * 15}px] bg-gray-200`} />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full bg-blue-100" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-2.5 w-full rounded-full bg-gray-200" />
                        <div className="flex justify-end">
                          <Skeleton className="h-4 w-8 rounded-sm bg-gray-200" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Skeleton className="h-8 w-8 rounded-md bg-gray-200" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                        No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.name} {employee.last_name_1}
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.assigned_project}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-[#7500C0] h-2.5 rounded-full"
                          style={{ width: `${employee.assignment_percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {employee.assignment_percentage}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <EyeIcon className="mr-2 h-4 w-4" /> View details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => onDelete && onDelete(employee.id)}
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" /> Delete
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
      </div>

      {!loading && (totalPages ?? 1) > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {(currentPage ?? 1) > 1 ? (
                <PaginationPrevious
                  onClick={() => onPageChange && onPageChange((currentPage ?? 1) - 1)}
                />
              ) : (
                <PaginationPrevious className="pointer-events-none opacity-50" />
              )}
            </PaginationItem>
            <PaginationItem className="flex items-center">
              <span className="text-sm">
    Page {currentPage ?? 1} of {totalPages ?? 1}
              </span>
            </PaginationItem>
            <PaginationItem>
              {(currentPage ?? 1) < (totalPages ?? 1) ? (
                <PaginationNext
                  onClick={() => onPageChange && onPageChange((currentPage ?? 1) + 1)}
                />
              ) : (
                <PaginationNext className="pointer-events-none opacity-50" />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
