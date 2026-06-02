'use strict';

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../components/auth/login-form';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

// Mock useAuth hook
const mockLogin = jest.fn();
jest.mock('@/hooks/use-auth', () => ({
  useAuth() {
    return {
      login: mockLogin,
      user: null,
      isLoading: false,
    };
  },
}));

// Mock useToast hook
const mockSuccess = jest.fn();
const mockError = jest.fn();
jest.mock('@/components/ui/toast', () => ({
  useToast() {
    return {
      success: mockSuccess,
      error: mockError,
    };
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password inputs and no name input', () => {
    render(<LoginForm />);

    // Verify Name field does not exist
    expect(screen.queryByLabelText(/Full Name/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Enter your full name/i)).not.toBeInTheDocument();

    // Verify Email and Password inputs exist
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
  });

  it('shows validation errors when fields are edited and invalid', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    // Initial state: no error messages
    expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Password must be at least 6 characters/i)).not.toBeInTheDocument();

    // Type invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Wait for the async validation message to appear
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    // Type short password
    fireEvent.change(passwordInput, { target: { value: '123' } });
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('clears validation errors automatically when inputs become valid', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    // Type invalid email to trigger error
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    // Correct the email to make it valid
    fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
    await waitFor(() => {
      expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
    });

    // Type invalid password to trigger error
    fireEvent.change(passwordInput, { target: { value: '123' } });
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });

    // Correct the password to make it valid
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    await waitFor(() => {
      expect(screen.queryByText(/Password must be at least 6 characters/i)).not.toBeInTheDocument();
    });
  });

  it('submits successfully with derived user display name', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    // Populate valid values
    fireEvent.change(emailInput, { target: { value: 'jane.doe-smith_admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(submitButton);

    // The component has an 800ms network simulation timeout
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('jane.doe-smith_admin@example.com', 'Jane Doe Smith Admin');
      expect(mockSuccess).toHaveBeenCalledWith('Login Successful', 'Welcome, Jane Doe Smith Admin!');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 1500 });
  });
});
