'use strict';

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '@/types';
import { tasksApi } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error, warning } = useToast();

  // Load initial tasks (Offline-first approach)
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = localStorage.getItem('task_manager_tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
          setIsLoading(false);
          
          // Optionally, sync server store in background
          try {
            const serverTasks = await tasksApi.getTasks();
            // If they differ, we could sync, but for this mock, keeping localStorage as local truth is clean
          } catch (e) {
            // Server offline, ignore in background
          }
        } else {
          // If no localStorage, fetch mock data from server handlers (satisfying Feature 14)
          const serverTasks = await tasksApi.getTasks();
          localStorage.setItem('task_manager_tasks', JSON.stringify(serverTasks));
          setTasks(serverTasks);
          setIsLoading(false);
          success('Sample Data Loaded', '10 sample tasks have been generated successfully.');
        }
      } catch (err) {
        error('Data Load Error', 'Failed to load task records.');
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [success, error]);

  // Helper to save and update state
  const updateLocalState = useCallback((newTasks: Task[]) => {
    localStorage.setItem('task_manager_tasks', JSON.stringify(newTasks));
    setTasks(newTasks);
  }, []);

  const addTask = useCallback(async (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
  }) => {
    // Generate temporary offline-first task for instant update
    const tempId = `task-${Math.random().toString(36).substring(2, 9)}`;
    const tempTask: Task = {
      id: tempId,
      ...taskData,
      createdAt: new Date().toISOString(),
    };

    // Optimistic Update
    const updatedTasks = [tempTask, ...tasks];
    updateLocalState(updatedTasks);
    success('Task Created', `"${taskData.title}" was added successfully.`);

    try {
      // Sync in background with API route
      const createdServerTask = await tasksApi.createTask(taskData);
      
      // Update the temporary ID with the server-generated ID if different
      setTasks((prev) =>
        prev.map((t) => (t.id === tempId ? createdServerTask : t))
      );
      
      // Persist confirmed server state
      const confirmedTasks = updatedTasks.map((t) => (t.id === tempId ? createdServerTask : t));
      localStorage.setItem('task_manager_tasks', JSON.stringify(confirmedTasks));
    } catch (e) {
      warning('Server Sync Warning', 'Task saved locally but failed to sync with background mock API.');
    }
  }, [tasks, updateLocalState, success, warning]);

  const editTask = useCallback(async (id: string, taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
  }) => {
    const oldTasks = [...tasks];
    
    // Optimistic Update
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, ...taskData } : t
    );
    updateLocalState(updatedTasks);
    success('Task Updated', 'Changes were saved successfully.');

    try {
      // Sync in background with API route
      await tasksApi.updateTask(id, taskData);
    } catch (e) {
      warning('Server Sync Warning', 'Updates saved locally, but mock API server could not be reached.');
    }
  }, [tasks, updateLocalState, success, warning]);

  const deleteTask = useCallback(async (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    // Optimistic Update
    const updatedTasks = tasks.filter((t) => t.id !== id);
    updateLocalState(updatedTasks);
    success('Task Deleted', `"${taskToDelete.title}" has been deleted.`);

    try {
      // Sync in background with API route
      await tasksApi.deleteTask(id);
    } catch (e) {
      warning('Server Sync Warning', 'Deleted locally, but mock API server sync failed.');
    }
  }, [tasks, updateLocalState, success, warning]);

  const changeStatus = useCallback(async (id: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (!taskToUpdate) return;

    // Optimistic Update
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, status: newStatus } : t
    );
    updateLocalState(updatedTasks);
    success('Status Changed', `"${taskToUpdate.title}" is now "${newStatus}".`);

    try {
      // Sync in background with API route
      await tasksApi.updateTask(id, { status: newStatus });
    } catch (e) {
      warning('Server Sync Warning', 'Status updated locally, but mock API server sync failed.');
    }
  }, [tasks, updateLocalState, success, warning]);

  return {
    tasks,
    isLoading,
    addTask,
    editTask,
    deleteTask,
    changeStatus,
  };
}
