'use strict';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { formatDateToDDMMYYYY } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TaskTableProps {
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

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="hidden md:block w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full border-collapse text-left text-sm">

        {/* Table Headers */}
        <thead className="bg-secondary/70 border-b border-border/80 text-muted-foreground font-mono uppercase tracking-wider text-xs">
          <tr>
            <th className="p-4 font-bold">Task Information</th>
            <th className="p-4 font-bold w-[180px]">Status</th>
            <th className="p-4 font-bold w-[150px]">Due Date</th>
            <th className="p-4 font-bold w-[120px] text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-border/60">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <tr
                key={task.id}
                className="hover:bg-accent/40 transition-colors duration-150 animate-fade-in"
              >

                {/* Task Title & Description */}
                <td className="p-4 max-w-[320px]">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-foreground leading-snug">
                      {task.title}
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {task.description || 'No description provided.'}
                    </span>
                  </div>
                </td>

                {/* Single styled status select — display + editor in one */}
                <td className="p-4">
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
                </td>

                {/* Due Date */}
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-foreground/80">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs font-semibold">{formatDateToDDMMYYYY(task.dueDate)}</span>
                    </div>
                    {overdue && (
                      <span className="text-[10px] font-bold text-destructive uppercase tracking-wider font-mono animate-pulse">
                        OVERDUE
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions Cell */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
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
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};
