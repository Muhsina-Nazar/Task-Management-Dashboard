'use strict';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-98 cursor-pointer select-none',
          {
            // Variants
            'bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-md hover:shadow-primary/10':
              variant === 'primary',
            'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80':
              variant === 'secondary',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm':
              variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground':
              variant === 'ghost',
            'bg-destructive text-destructive-foreground shadow hover:bg-destructive/90':
              variant === 'destructive',
            'text-primary underline-offset-4 hover:underline bg-transparent':
              variant === 'link',

            // Sizes
            'h-9 px-3 text-xs rounded-md': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-6 rounded-lg text-base': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
