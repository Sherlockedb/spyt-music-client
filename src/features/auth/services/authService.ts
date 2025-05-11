import apiClient from '../../../core/api/client';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  username: string;
  email: string;
  full_name: string | null;
  disabled: boolean;
  role: string;
  _id: string;
  preferences: any;
  created_at: string;
  updated_at: string | null;
}

const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // 登录接口使用表单格式数据，不是JSON
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<UserResponse> => {
    // 注册接口路径是/users/，不是/auth/register
    const response = await apiClient.post('/users/', {
      username,
      email,
      password
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/refresh', refreshToken, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  }
};

export default authService;