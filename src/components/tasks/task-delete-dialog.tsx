'use strict';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface TaskDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskTitle: string;
}

export const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  taskTitle,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader className="flex flex-col items-center sm:items-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center sm:text-left">Delete Task</DialogTitle>
          <DialogDescription className="text-center sm:text-left mt-2">
            Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{taskTitle}&quot;</span>? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="w-full sm:w-auto cursor-pointer"
          >
            Delete Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
