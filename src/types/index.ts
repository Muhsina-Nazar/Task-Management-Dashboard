export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO date string
}

export interface User {
  email: string;
  name: string;
}

export interface TaskFilters {
  search: string;
  status: 'All' | TaskStatus;
  sortBy: 'Nearest Deadline' | 'Farthest Deadline';
  page: number;
}
