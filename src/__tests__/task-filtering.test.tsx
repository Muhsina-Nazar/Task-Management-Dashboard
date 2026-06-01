'use strict';

import { Task, TaskStatus } from '@/types';

// Pure utility test to confirm strict, case-insensitive, state-based task matching logic
describe('Task Filtering & Search Logic', () => {
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Design Logo assets',
      description: 'Create premium graphics',
      status: 'Completed',
      dueDate: '2026-06-02',
      createdAt: '2026-06-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Write Zod schemas',
      description: 'Add client validation',
      status: 'In Progress',
      dueDate: '2026-06-05',
      createdAt: '2026-06-01T01:00:00Z',
    },
    {
      id: '3',
      title: 'Setup next-themes',
      description: 'Configure light/dark toggles',
      status: 'Todo',
      dueDate: '2026-06-10',
      createdAt: '2026-06-01T02:00:00Z',
    },
    {
      id: '4',
      title: 'Refactor auth hooks',
      description: 'Check local storage session',
      status: 'Todo',
      dueDate: '2026-06-04',
      createdAt: '2026-06-01T03:00:00Z',
    },
  ];

  const filterTasks = (
    list: Task[],
    searchQuery: string,
    statusFilter: 'All' | TaskStatus
  ): Task[] => {
    return list.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  it('filters tasks by case-insensitive title search query', () => {
    // Search for "zod" should match "Write Zod schemas"
    const results = filterTasks(sampleTasks, 'zod', 'All');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('2');

    // Search for "DESIGN" (uppercase) should match "Design Logo assets"
    const resultsCaps = filterTasks(sampleTasks, 'DESIGN', 'All');
    expect(resultsCaps).toHaveLength(1);
    expect(resultsCaps[0].id).toBe('1');

    // Search for "auth" should match "Refactor auth hooks"
    const resultsAuth = filterTasks(sampleTasks, 'auth', 'All');
    expect(resultsAuth).toHaveLength(1);
    expect(resultsAuth[0].id).toBe('4');
  });

  it('filters tasks by individual task status', () => {
    // Filter "Todo" tasks
    const todoResults = filterTasks(sampleTasks, '', 'Todo');
    expect(todoResults).toHaveLength(2);
    expect(todoResults.map((t) => t.id)).toContain('3');
    expect(todoResults.map((t) => t.id)).toContain('4');

    // Filter "Completed" tasks
    const completedResults = filterTasks(sampleTasks, '', 'Completed');
    expect(completedResults).toHaveLength(1);
    expect(completedResults[0].id).toBe('1');
  });

  it('combines title search query and status filtering simultaneously', () => {
    // Search "setup" and status "Todo" should match
    const matchResults = filterTasks(sampleTasks, 'setup', 'Todo');
    expect(matchResults).toHaveLength(1);
    expect(matchResults[0].id).toBe('3');

    // Search "setup" but status "Completed" should match nothing
    const emptyResults = filterTasks(sampleTasks, 'setup', 'Completed');
    expect(emptyResults).toHaveLength(0);
  });
});
