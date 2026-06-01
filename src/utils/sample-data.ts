import { Task } from '@/types';

export const getSampleTasks = (): Task[] => {
  const now = new Date();
  
  const formatDate = (daysOffset: number): string => {
    const d = new Date();
    d.setDate(now.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  };

  const formatDateTime = (daysOffset: number): string => {
    const d = new Date();
    d.setDate(now.getDate() + daysOffset);
    return d.toISOString();
  };

  return [
    {
      id: 'task-1',
      title: 'Design Dashboard UI Mockups',
      description: 'Create high-fidelity Figma components and layouts for the project management dashboard, focusing on glassmorphism and modern colors.',
      status: 'Completed',
      dueDate: formatDate(-2),
      createdAt: formatDateTime(-5),
    },
    {
      id: 'task-2',
      title: 'Setup Next.js 15 Environment',
      description: 'Initialize a new repository using Next.js 15+ App Router, configure TypeScript, Tailwind CSS, and essential linting policies.',
      status: 'Completed',
      dueDate: formatDate(-1),
      createdAt: formatDateTime(-4),
    },
    {
      id: 'task-3',
      title: 'Implement Offline-First Synchronization',
      description: 'Architect a service layer that reads/writes to LocalStorage first while making async syncing calls to Route Handlers.',
      status: 'In Progress',
      dueDate: formatDate(0), // Today
      createdAt: formatDateTime(-3),
    },
    {
      id: 'task-4',
      title: 'Write Zod Validations for Forms',
      description: 'Define strong verification schemas for login inputs and task forms, including error messaging and field constraints.',
      status: 'In Progress',
      dueDate: formatDate(1),
      createdAt: formatDateTime(-3),
    },
    {
      id: 'task-5',
      title: 'Build Protected Routing Mechanism',
      description: 'Construct a client-side wrapper page guard to securely handle dashboard page access and login redirect scenarios.',
      status: 'Todo',
      dueDate: formatDate(2),
      createdAt: formatDateTime(-2),
    },
    {
      id: 'task-6',
      title: 'Create Animated Toast Notifications',
      description: 'Design and deploy custom visual feedback toasts for showing action successes, errors, and warnings with smooth slide transitions.',
      status: 'Todo',
      dueDate: formatDate(3),
      createdAt: formatDateTime(-2),
    },
    {
      id: 'task-7',
      title: 'Refactor Tailwind Design Variables',
      description: 'Map harmonized HSL color tokens to theme levels for light and dark modes, and integrate seamless system-level transitions.',
      status: 'Completed',
      dueDate: formatDate(-3),
      createdAt: formatDateTime(-6),
    },
    {
      id: 'task-8',
      title: 'Write Jest Unit Tests',
      description: 'Author unit test suites for confirming correct form creation behaviors and task status filtering in React Testing Library.',
      status: 'Todo',
      dueDate: formatDate(4),
      createdAt: formatDateTime(-1),
    },
    {
      id: 'task-9',
      title: 'Perform Cross-Browser Visual Checks',
      description: 'Audit the dashboard layouts on mobile breakpoints, tablet orientations, and wide monitors for complete visual parity.',
      status: 'In Progress',
      dueDate: formatDate(5),
      createdAt: formatDateTime(-1),
    },
    {
      id: 'task-10',
      title: 'Polish README and Deployment Configs',
      description: 'Draft standard installation guides, detailing features, architecture decisions, and steps to launch production configurations.',
      status: 'Todo',
      dueDate: formatDate(7),
      createdAt: formatDateTime(0),
    },
  ];
};
