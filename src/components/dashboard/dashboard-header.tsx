'use strict';

'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { success } = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const handleLogout = () => {
    logout();
    success('Logged Out', 'You have been successfully signed out.');
    router.push('/login');
  };

  const toggleTheme = () => {
    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border shadow-sm bg-card/75 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* App Logo */}
        <div className="flex items-center">
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Task Dashboard
          </span>
        </div>

        {/* User Info & Controls */}
        <div className="flex items-center gap-3">
          {/* User profile identifier — shows name, not email */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-medium text-foreground/85 max-w-[140px] truncate sm:max-w-none">
                {user.name || user.email}
              </span>
            </div>
          )}

          {/* Theme Toggle Button */}
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full cursor-pointer h-9 w-9"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' || resolvedTheme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-amber-500 animate-scale-up" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-blue-600 animate-scale-up" />
              )}
            </Button>
          )}

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="rounded-full cursor-pointer text-muted-foreground hover:text-destructive h-9 w-9 hover:bg-destructive/10"
            aria-label="Log Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </Button>
        </div>

      </div>
    </header>
  );
};
