'use strict';

import React from 'react';
import { TaskStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Plus, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'All' | TaskStatus;
  onStatusFilterChange: (value: 'All' | TaskStatus) => void;
  sortBy: 'Newest First' | 'Oldest First';
  onSortByChange: (value: 'Newest First' | 'Oldest First') => void;
  onAddTaskClick: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  onAddTaskClick,
}) => {
  const statusTabs: ('All' | TaskStatus)[] = ['All', 'Todo', 'In Progress', 'Completed'];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      
      {/* Search Input and Add Action */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground pointer-events-none">
            <Search className="h-4.5 w-4.5" />
          </div>
        </div>
        <Button onClick={onAddTaskClick} className="w-full sm:w-auto shrink-0 flex items-center gap-1.5 cursor-pointer">
          <Plus className="h-4.5 w-4.5" />
          Add Task
        </Button>
      </div>

      {/* Status Filtering Tabs and Sort Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-border/60 pt-3">
        
        {/* Responsive Horizontal Tabs */}
        <div className="flex bg-secondary p-1 rounded-lg border border-border/80 self-start max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onStatusFilterChange(tab)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer uppercase font-mono tracking-wider',
                statusFilter === tab
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-stretch md:self-auto min-w-[200px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background shrink-0 text-muted-foreground">
            <CalendarDays className="h-4.5 w-4.5" />
          </div>
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'Newest First' | 'Oldest First')}
            className="flex-1"
          >
            <option value="Newest First">Due Date: Newest First</option>
            <option value="Oldest First">Due Date: Oldest First</option>
          </Select>
        </div>

      </div>

    </div>
  );
};
