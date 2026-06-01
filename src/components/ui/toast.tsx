'use strict';

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, description, duration = 3000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, description, duration };
      
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => {
    toast({ type: 'success', title, description });
  }, [toast]);

  const error = useCallback((title: string, description?: string) => {
    toast({ type: 'error', title, description });
  }, [toast]);

  const warning = useCallback((title: string, description?: string) => {
    toast({ type: 'warning', title, description });
  }, [toast]);

  const info = useCallback((title: string, description?: string) => {
    toast({ type: 'info', title, description });
  }, [toast]);

  const toastContainer = toasts.length > 0 && typeof window !== 'undefined' ? (
    createPortal(
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none p-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg pointer-events-auto transition-all duration-300 transform translate-y-0 scale-100 ease-out bg-card text-card-foreground border-border animate-slide-in',
              {
                'border-emerald-500/30 bg-emerald-50/90 text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-300':
                  t.type === 'success',
                'border-destructive/30 bg-destructive/5 text-destructive-950 dark:bg-destructive/10 dark:text-destructive-300':
                  t.type === 'error',
                'border-amber-500/30 bg-amber-50/90 text-amber-950 dark:bg-amber-950/20 dark:text-amber-300':
                  t.type === 'warning',
                'border-blue-500/30 bg-blue-50/90 text-blue-950 dark:bg-blue-950/20 dark:text-blue-300':
                  t.type === 'info',
              }
            )}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {t.type === 'error' && <XCircle className="h-5 w-5 text-destructive" />}
              {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-sm font-semibold">{t.title}</span>
              {t.description && <span className="text-xs opacity-90">{t.description}</span>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="mt-0.5 shrink-0 text-foreground/50 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 p-0.5 rounded cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>,
      document.body
    )
  ) : null;

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {toastContainer}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
