import { Task } from '@/types';
import { getSampleTasks } from '@/utils/sample-data';

// Initialize the persistent server-side task array
let tasksStore: Task[] = getSampleTasks();

export const mockDb = {
  getTasks: (): Task[] => {
    return tasksStore;
  },
  
  createTask: (task: Task): Task => {
    tasksStore.push(task);
    return task;
  },
  
  updateTask: (id: string, updatedFields: Partial<Task>): Task | null => {
    let updatedTask: Task | null = null;
    tasksStore = tasksStore.map((task) => {
      if (task.id === id) {
        updatedTask = { ...task, ...updatedFields };
        return updatedTask;
      }
      return task;
    });
    return updatedTask;
  },
  
  deleteTask: (id: string): Task | null => {
    const taskToDelete = tasksStore.find((t) => t.id === id) || null;
    if (taskToDelete) {
      tasksStore = tasksStore.filter((t) => t.id !== id);
    }
    return taskToDelete;
  },
};
