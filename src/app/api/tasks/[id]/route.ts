'use strict';

import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockDb';
import { z } from 'zod';

// Zod validation schema for updating a task (all fields optional)
const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(100, 'Title is too long').optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  status: z.enum(['Todo', 'In Progress', 'Completed'] as const).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD').optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Critical Next.js 15 change: params must be awaited
    const { id } = await params;
    const body = await request.json();
    
    const result = updateTaskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const updatedTask = mockDb.updateTask(id, result.data);
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedTask);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Critical Next.js 15 change: params must be awaited
    const { id } = await params;
    const deletedTask = mockDb.deleteTask(id);
    
    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
