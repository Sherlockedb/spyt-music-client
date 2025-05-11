import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { UserResponse } from '../services/authService';

interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载初始用户状态
  useEffect(() => {
    const loadUserData = async () => {
      // 检查本地存储中是否有token
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // 获取用户数据
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to load user data', error);
        // 清除无效token
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // 登录
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(username, password);

      // 保存token
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);

      // 获取用户数据
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.register(username, email, password);
      // 注册成功后不自动登录，用户需要手动登录
    } finally {
      setIsLoading(false);
    }
  };

  // 退出登录
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};