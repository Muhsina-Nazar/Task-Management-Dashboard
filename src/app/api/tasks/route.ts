'use strict';

import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockDb';
import { z } from 'zod';
import { Task } from '@/types';

// Zod validation schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').default(''),
  status: z.enum(['Todo', 'In Progress', 'Completed'] as const).default('Todo'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD'),
});

export async function GET() {
  try {
    const tasks = mockDb.getTasks();
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json(
      { error: 'Failed to retrieve tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createTaskSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const newTask: Task = {
      id: `task-${Math.random().toString(36).substring(2, 9)}`,
      title: result.data.title,
      description: result.data.description,
      status: result.data.status,
      dueDate: result.data.dueDate,
      createdAt: new Date().toISOString(),
    };
    
    const createdTask = mockDb.createTask(newTask);
    return NextResponse.json(createdTask, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
