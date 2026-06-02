'use strict';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { formatDateToDDMMYYYY } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

const STATUS_STYLES: Record<TaskStatus, string> = {
  'Todo': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
};

const isOverdue = (dueDateStr: string, status: TaskStatus): boolean => {
  if (status === 'Completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dueDateStr);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

export const TaskCard: React.FC<TaskCardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate, task.status);
        return (
          <div
            key={task.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden animate-fade-in"
          >
            {/* Overdue border accent */}
            {overdue && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive"></div>
            )}

            {/* Header: Status select & Actions */}
            <div className="flex items-center justify-between gap-2">
              {/* Single styled status select */}
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                className={cn(
                  'h-8 rounded-full border px-3 py-0.5 text-xs font-semibold cursor-pointer',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                  'transition-colors duration-150 appearance-none pr-6',
                  'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%236b7280\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.5rem_center]',
                  STATUS_STYLES[task.status]
                )}
                aria-label="Change task status"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                  aria-label="Edit Task"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  aria-label="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Body: Title & Description */}
            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold text-base text-foreground leading-snug">
                {task.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* Footer: Due Date */}
            <div className="flex items-center gap-1.5 text-xs text-foreground/80 font-mono border-t border-border/40 pt-3 mt-1">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className={overdue ? 'text-destructive font-bold' : ''}>
                {formatDateToDDMMYYYY(task.dueDate)}
              </span>
              {overdue && (
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-destructive bg-destructive/10 px-1 py-0.5 rounded uppercase animate-pulse shrink-0">
                  <AlertCircle className="h-2.5 w-2.5" />
                  Overdue
                </span>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
