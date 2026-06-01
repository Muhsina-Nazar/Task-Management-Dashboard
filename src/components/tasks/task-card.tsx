'use strict';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  
  const getBadgeVariant = (status: TaskStatus) => {
    switch (status) {
      case 'Todo':
        return 'todo';
      case 'In Progress':
        return 'progress';
      case 'Completed':
        return 'completed';
    }
  };

  const isOverdue = (dueDateStr: string, status: TaskStatus) => {
    if (status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

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

            {/* Header: Status & Actions */}
            <div className="flex items-center justify-between gap-2">
              <Badge variant={getBadgeVariant(task.status)}>{task.status}</Badge>
              
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

            {/* Footer: Date & Quick Status Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border/40 pt-3 mt-1">
              
              {/* Due Date Indicator */}
              <div className="flex items-center gap-1.5 text-xs text-foreground/80 font-mono">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className={overdue ? 'text-destructive font-bold' : ''}>
                  {task.dueDate}
                </span>
                {overdue && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-destructive bg-destructive/10 px-1 py-0.2 rounded uppercase animate-pulse shrink-0">
                    <AlertCircle className="h-2.5 w-2.5" />
                    Overdue
                  </span>
                )}
              </div>

              {/* Status Select Box */}
              <div className="w-full sm:w-auto shrink-0">
                <Select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                  className="h-8 py-0.5 text-xs w-full sm:w-[130px]"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};
