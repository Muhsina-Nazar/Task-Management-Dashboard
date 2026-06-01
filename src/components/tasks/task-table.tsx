'use strict';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Calendar } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
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
    <div className="hidden md:block w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        
        {/* Table Headers */}
        <thead className="bg-secondary/70 border-b border-border/80 text-muted-foreground font-mono uppercase tracking-wider text-xs">
          <tr>
            <th className="p-4 font-bold">Task Detail</th>
            <th className="p-4 font-bold w-[180px]">Status Badge / Quick Toggle</th>
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

                {/* Status Dropdown/Selector */}
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <Badge variant={getBadgeVariant(task.status)}>{task.status}</Badge>
                    </div>
                    <Select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                      className="h-8 py-0.5 text-xs w-[140px]"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Select>
                  </div>
                </td>

                {/* Due Date */}
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-foreground/80">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs font-semibold">{task.dueDate}</span>
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
