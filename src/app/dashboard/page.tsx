'use strict';

'use client';

import React, { useState, useMemo } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsSummary } from '@/components/dashboard/stats-summary';
import { TaskFilters } from '@/components/dashboard/task-filters';
import { TaskTable } from '@/components/tasks/task-table';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskPagination } from '@/components/tasks/task-pagination';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { TaskDeleteDialog } from '@/components/tasks/task-delete-dialog';
import { useTasks } from '@/hooks/use-tasks';
import { Task, TaskStatus } from '@/types';
import { FolderOpen, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { tasks, isLoading, addTask, editTask, deleteTask, changeStatus } = useTasks();

  // Filter, Sort and Paginate local states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [sortBy, setSortBy] = useState<'Newest First' | 'Oldest First'>('Newest First');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Track previous filters to reset page on change during render, avoiding useEffect setState
  const [prevSearch, setPrevSearch] = useState(search);
  const [prevStatusFilter, setPrevStatusFilter] = useState(statusFilter);
  const [prevSortBy, setPrevSortBy] = useState(sortBy);

  if (search !== prevSearch || statusFilter !== prevStatusFilter || sortBy !== prevSortBy) {
    setPrevSearch(search);
    setPrevStatusFilter(statusFilter);
    setPrevSortBy(sortBy);
    setCurrentPage(1);
  }

  // Dialog modals states
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [activeEditTask, setActiveEditTask] = useState<Task | undefined>(undefined);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);

  // Compute filtered, sorted and paginated tasks lists
  const filteredAndSortedTasks = useMemo(() => {
    // 1. Filtering
    const list = tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // 2. Sorting (by Due Date)
    list.sort((a, b) => {
      const timeA = new Date(a.dueDate).getTime();
      const timeB = new Date(b.dueDate).getTime();
      
      if (sortBy === 'Newest First') {
        return timeB - timeA; // Descending
      } else {
        return timeA - timeB; // Ascending
      }
    });

    return list;
  }, [tasks, search, statusFilter, sortBy]);

  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredAndSortedTasks.length / itemsPerPage));
  }, [filteredAndSortedTasks.length]);

  // Paginated task slice
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTasks, currentPage]);

  // Modals operations handlers
  const handleOpenAddTask = () => {
    setActiveEditTask(undefined);
    setTaskDialogOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setActiveEditTask(task);
    setTaskDialogOpen(true);
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setActiveDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleTaskSubmit = (data: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
  }) => {
    if (activeEditTask) {
      editTask(activeEditTask.id, data);
    } else {
      addTask(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (activeDeleteId) {
      deleteTask(activeDeleteId);
      setActiveDeleteId(null);
    }
  };

  const activeDeleteTitle = useMemo(() => {
    if (!activeDeleteId) return '';
    return tasks.find((t) => t.id === activeDeleteId)?.title || '';
  }, [activeDeleteId, tasks]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setSortBy('Newest First');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <DashboardHeader />

        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-8">
          
          {/* Header Title Grid */}
          <div className="border-b border-border/40 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Task Management
            </h1>
          </div>

          {/* Page Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                Retrieving tasks records...
              </span>
            </div>
          ) : (
            <>
              {/* Dynamic Analytics Visual Summary */}
              <StatsSummary tasks={tasks} />

              {/* Filtering, Search & Create Task Trigger Row */}
              <TaskFilters
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                onAddTaskClick={handleOpenAddTask}
              />

              {/* Task Data View Panel */}
              {filteredAndSortedTasks.length === 0 ? (
                /* Feature 15: Empty State UI */
                <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-2xl bg-card/40 animate-scale-up">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">No tasks found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                    We couldn&apos;t find any task records matching your filter parameters or search queries.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleResetFilters} className="cursor-pointer">
                      Reset Filters
                    </Button>
                    <Button onClick={handleOpenAddTask} className="flex items-center gap-1 cursor-pointer">
                      <Plus className="h-4.5 w-4.5" />
                      Create Task
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Desktop View Table */}
                  <TaskTable
                    tasks={paginatedTasks}
                    onEdit={handleOpenEditTask}
                    onDelete={handleOpenDeleteConfirm}
                    onStatusChange={changeStatus}
                  />

                  {/* Mobile View Cards list */}
                  <TaskCard
                    tasks={paginatedTasks}
                    onEdit={handleOpenEditTask}
                    onDelete={handleOpenDeleteConfirm}
                    onStatusChange={changeStatus}
                  />

                  {/* Pagination control */}
                  <TaskPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredAndSortedTasks.length}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              )}
            </>
          )}

        </main>

        {/* Dialog and Modals triggers */}
        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          onSubmit={handleTaskSubmit}
          task={activeEditTask}
        />

        <TaskDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          taskTitle={activeDeleteTitle}
        />

      </div>
    </ProtectedRoute>
  );
}
