'use strict';

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
        <div className="relative flex flex-col items-center gap-4">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-blue-600 blur opacity-40 animate-pulse"></div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-card border border-border shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground animate-pulse tracking-wide font-mono uppercase">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
