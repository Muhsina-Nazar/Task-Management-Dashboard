'use strict';

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from '@/components/auth/login-form';
import { CheckSquare } from 'lucide-react';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return null; // Let the loader handle initial checks
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background grid-bg overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>

      <div className="relative w-full max-w-md rounded-2xl glass border border-border shadow-2xl p-8 bg-card/65 animate-scale-up">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-600 shadow-lg text-primary-foreground transform rotate-3">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-4">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            Please enter your details to sign in and manage your tasks.
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center text-xs text-muted-foreground font-mono">
          SECURE MOCK AUTHENTICATION
        </div>
      </div>
    </div>
  );
}
