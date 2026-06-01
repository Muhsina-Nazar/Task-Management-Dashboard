'use strict';

import { Task, TaskStatus } from '@/types';

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks from server');
    }
    return response.json();
  },

  createTask: async (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
  }): Promise<Task> => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to create task');
    }
    return response.json();
  },

  updateTask: async (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to update task');
    }
    return response.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to delete task');
    }
  },
};
