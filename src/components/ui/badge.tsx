'use strict';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'todo' | 'progress' | 'completed';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none uppercase tracking-wider font-mono scale-95',
        {
          'border-transparent bg-primary text-primary-foreground shadow':
            variant === 'default',
          'border-transparent bg-secondary text-secondary-foreground':
            variant === 'secondary',
          'text-foreground border-border':
            variant === 'outline',
          // Custom beautiful status badges
          'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/30 dark:bg-blue-950/40 dark:text-blue-400':
            variant === 'todo',
          'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/40 dark:text-amber-400':
            variant === 'progress',
          'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400':
            variant === 'completed',
        },
        className
      )}
      {...props}
    />
  );
}
