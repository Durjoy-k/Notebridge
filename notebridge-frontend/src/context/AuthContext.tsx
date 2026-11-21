import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, loginApi, registerApi, AuthResponse } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, department?: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string, department?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'notebridge_user';
const TOKEN_STORAGE_KEY = 'notebridge_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const handleAuthSuccess = (data: AuthResponse, selectedDepartment?: string) => {
    const finalUser: User = {
      ...data.user,
      department: selectedDepartment || data.user.department || 'Computer Science & Engineering (CSE)',
    };
    setUser(finalUser);
    setToken(data.access_token);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(finalUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    } catch (e) {
      console.error('Failed to save auth to localStorage', e);
    }
  };

  const login = async (email: string, password: string, department?: string) => {
    const data = await loginApi(email, password, department);
    handleAuthSuccess(data, department);
  };

  const register = async (email: string, password: string, fullName?: string, department?: string) => {
    const data = await registerApi(email, password, fullName, department);
    handleAuthSuccess(data, department);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth storage', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
