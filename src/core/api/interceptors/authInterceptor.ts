import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import apiClient from '../client';
import authService from '../../../features/auth/services/authService';

// 刷新token的标志，防止多个请求同时刷新
let isRefreshing = false;
// 等待token刷新的请求队列
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

// 处理队列中等待的请求
const processQueue = (error: any = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(undefined);
    }
  });

  failedQueue = [];
};

// 初始化认证拦截器的函数
export const setupAuthInterceptors = () => {
  // 请求拦截器 - 添加Token
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器 - 处理Token过期
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 如果响应是401且有refresh token，并且请求还没有重试过
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        localStorage.getItem('refreshToken') &&
        !originalRequest.url?.includes('auth/refresh') // 避免refresh请求本身也进入循环
      ) {
        if (isRefreshing) {
          // 如果正在刷新token，将请求加入队列
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return apiClient(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // 使用refresh token获取新的access token
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token available');

          const response = await authService.refreshToken(refreshToken);

          // 保存新token
          localStorage.setItem('accessToken', response.access_token);
          localStorage.setItem('refreshToken', response.refresh_token);

          // 更新请求头
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${response.access_token}`;
          }

          // 处理队列中的请求
          processQueue();

          // 重试原始请求
          return apiClient(originalRequest);
        } catch (refreshError) {
          // 刷新token失败，清除所有token
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          // 拒绝所有队列中的请求
          processQueue(refreshError);

          // 重定向到登录页
          window.location.href = '/auth';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  console.log('Auth interceptors have been set up');
  return apiClient;
};

export default setupAuthInterceptors;