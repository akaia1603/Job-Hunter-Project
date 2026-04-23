// Auth Context — updated for Spring Boot backend
import { AuthState, User } from '@/types/index';
import authService from '@services/authService';
import { MOCK_CURRENT_USER } from '@services/mockData';
import { storage } from '@utils/storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Restore auth state on app startup
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = await storage.get('authToken');
        const user = await storage.get('user');

        if (token && user) {
          setState(prev => ({
            ...prev,
            token: token as string,
            user: user as User,
            isAuthenticated: true,
            isLoading: false,
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error restoring auth:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    restoreAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Spring expects "username" field
      const response = await authService.login({
        username: email,
        password,
      });

      const token = response.access_token;
      const loginUser = response.user;

      // Build full user object
      const fullUser: User = {
        id: loginUser.id,
        email: loginUser.email,
        name: loginUser.name,
        role: loginUser.role,
        // Add mock user details for demo mode
        ...(email === 'demo@topjob.vn' ? {
          phone: MOCK_CURRENT_USER.phone,
          age: MOCK_CURRENT_USER.age,
          gender: MOCK_CURRENT_USER.gender,
          address: MOCK_CURRENT_USER.address,
          skills: MOCK_CURRENT_USER.skills,
        } : {}),
        createdAt: new Date().toISOString(),
      };

      await storage.set('authToken', token);
      await storage.set('user', fullUser);

      setState(prev => ({
        ...prev,
        user: fullUser,
        token,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.message || 'Đăng nhập thất bại';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      await authService.register({ email, password, name });

      // Auto login after signup
      await login(email, password);
    } catch (error: any) {
      const errorMessage = error?.message || 'Đăng ký thất bại';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storage.remove('authToken');
      await storage.remove('user');

      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    }
  };

  const updateUser = (user: User) => {
    setState(prev => ({ ...prev, user }));
    storage.set('user', user);
  };

  const value: AuthContextType = {
    state,
    login,
    signup,
    logout,
    updateUser,
    isLoading: state.isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;