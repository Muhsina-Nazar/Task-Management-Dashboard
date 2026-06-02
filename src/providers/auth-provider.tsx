'use strict';

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read from localStorage on client side mount
    const storedUser = localStorage.getItem('task_manager_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setTimeout(() => {
          setUser(parsedUser);
          setIsLoading(false);
        }, 0);
        return;
      } catch {
        localStorage.removeItem('task_manager_user');
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  const login = async (email: string, name: string) => {
    const userData: User = { email, name };
    localStorage.setItem('task_manager_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('task_manager_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
