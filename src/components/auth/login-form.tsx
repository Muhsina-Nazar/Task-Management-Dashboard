'use strict';

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const { success, error } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      await login(data.email, data.name);
      success('Login Successful', `Welcome, ${data.name}!`);
      router.push('/dashboard');
    } catch {
      error('Authentication Failed', 'An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Full Name */}
      <div className="mb-5">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-muted-foreground">
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          error={!!errors.name}
          disabled={isSubmitting}
          className="w-full"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1 font-medium animate-fade-in">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-muted-foreground">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          error={!!errors.email}
          disabled={isSubmitting}
          className="w-full"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1 font-medium animate-fade-in">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-muted-foreground">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            error={!!errors.password}
            disabled={isSubmitting}
            className="w-full pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
            disabled={isSubmitting}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive mt-1 font-medium animate-fade-in">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full relative h-11 mt-2">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
};
