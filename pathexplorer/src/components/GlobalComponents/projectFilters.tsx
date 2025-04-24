'use client';

import React, { useState, useRef } from 'react';
import { Search, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ProjectFiltersProps {
    onSearch: (search: string | null) => void;
    onSort: (isAlphabetical: boolean | null) => void;
    onStartDate: (date: string | null) => void;
    onEndDate: (date: string | null) => void;
    onClearFilters: () => void;
}

export function ProjectFilters({
  onSearch,
  onSort,
  onStartDate,
  onEndDate,
  onClearFilters,
}: ProjectFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAlphabetical, setIsAlphabetical] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current);
    }

    debouncedSearchRef.current = setTimeout(() => {
      onSearch(value || null);
    }, 300);
  };

  const handleAlphabeticalToggle = (value: boolean) => {
    setIsAlphabetical(value);
    onSort(value);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    setStartDateOpen(false);
    onStartDate(date ? format(date, 'yyyy-MM-dd') : null);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setEndDateOpen(false);
    onEndDate(date ? format(date, 'yyyy-MM-dd') : null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setIsAlphabetical(false);
    setStartDate(undefined);
    setEndDate(undefined);
    onClearFilters();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="alphabetical-sort"
              checked={isAlphabetical}
              onCheckedChange={handleAlphabeticalToggle}
              className="data-[state=checked]:bg-[#7500C0]"
            />
            <label htmlFor="alphabetical-sort" className="text-sm font-medium">
                            Sort alphabetically
            </label>
          </div>

          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'MMM d, yyyy') : 'Start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'MMM d, yyyy') : 'End date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                disabled={startDate ? (date) => date < startDate : undefined}
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" onClick={handleClearFilters} className="text-xs">
                        Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}
