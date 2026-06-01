'use strict';

'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, TaskStatus } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { ClipboardList, Calendar } from 'lucide-react';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less'),
  status: z.enum(['Todo', 'In Progress', 'Completed'] as const),
  dueDate: z.string().min(1, 'Due date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
  }) => void;
  task?: Task; // If provided, we are in Edit mode
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  task,
}) => {
  const isEdit = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Todo',
      dueDate: '',
    },
  });

  // Reset form when task changes or modal opens/closes
  useEffect(() => {
    if (open) {
      if (task) {
        reset({
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate,
        });
      } else {
        // Today's date as default
        const today = new Date().toISOString().split('T')[0];
        reset({
          title: '',
          description: '',
          status: 'Todo',
          dueDate: today,
        });
      }
    }
  }, [open, task, reset]);

  const handleFormSubmit = (data: TaskFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
            <ClipboardList className="h-5 w-5" />
          </div>
          <DialogTitle>{isEdit ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the fields below to edit your task parameters.'
              : 'Add a new task record to your project dashboard.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          {/* Title Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/80" htmlFor="task-title">
              Task Title *
            </label>
            <Input
              id="task-title"
              placeholder="e.g. Implement user login form"
              error={!!errors.title}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-0.5 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/80" htmlFor="task-desc">
              Description
            </label>
            <Textarea
              id="task-desc"
              placeholder="Describe what needs to be accomplished in this task..."
              rows={3}
              error={!!errors.description}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-0.5 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Status and Due Date Split Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80" htmlFor="task-status">
                Status *
              </label>
              <Select id="task-status" error={!!errors.status} {...register('status')}>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
              {errors.status && (
                <p className="text-xs text-destructive mt-0.5 font-medium">{errors.status.message}</p>
              )}
            </div>

            {/* Due Date Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1" htmlFor="task-date">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Due Date *
              </label>
              <Input
                id="task-date"
                type="date"
                error={!!errors.dueDate}
                {...register('dueDate')}
              />
              {errors.dueDate && (
                <p className="text-xs text-destructive mt-0.5 font-medium">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer">
              {isEdit ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
