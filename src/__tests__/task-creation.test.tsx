'use strict';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskDialog } from '../components/tasks/task-dialog';
import '@testing-library/jest-dom';

// Mock scrollIntoView for JSDOM
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}

describe('Task Dialog (Task Creation)', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form input fields when open', () => {
    render(
      <TaskDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    // Verify form labels are present
    expect(screen.getByText('Task Title *')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Status *')).toBeInTheDocument();
    // Due Date label contains an icon, so use a flexible matcher
    expect(screen.getByText(/Due Date/)).toBeInTheDocument();

    // Verify the submit button exists
    expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
  });

  it('calls onSubmit with entered values when form is validly submitted', async () => {
    render(
      <TaskDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText(/Implement user login/i);
    const descTextarea = screen.getByPlaceholderText(/Describe what needs/i);
    const statusSelect = screen.getByRole('combobox') || screen.getByLabelText(/Status/i);
    const dateInput = screen.getByLabelText(/Due Date/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    // Populate the form fields
    fireEvent.change(titleInput, { target: { value: 'Learn Next.js 15 Testing' } });
    fireEvent.change(descTextarea, { target: { value: 'Write unit tests for task validation' } });
    fireEvent.change(statusSelect, { target: { value: 'In Progress' } });
    fireEvent.change(dateInput, { target: { value: '15-06-2026' } });

    // Submit the form
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Learn Next.js 15 Testing',
        description: 'Write unit tests for task validation',
        status: 'In Progress',
        dueDate: '2026-06-15',
      });
    });
  });

  it('does not trigger onSubmit when required fields are empty', async () => {
    render(
      <TaskDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        onSubmit={mockOnSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText(/Implement user login/i);
    const submitButton = screen.getByRole('button', { name: /Create Task/i });

    // Clear out Title input (which is required)
    fireEvent.change(titleInput, { target: { value: '' } });

    // Submit form
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
