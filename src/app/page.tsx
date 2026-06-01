'use strict';

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background grid-bg">
      <div className="relative flex flex-col items-center gap-4">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-blue-600 blur opacity-40 animate-pulse"></div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-card border border-border shadow-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground animate-pulse tracking-wide font-mono uppercase">
          Initializing Dashboard...
        </span>
      </div>
    </div>
  );
}
