// 定义应用配置类型
interface AppConfig {
  // 应用信息
  app: {
    name: string;
    version: string;
  };

  // API配置
  api: {
    baseUrl: string;
    timeout: number;
    enableCache: boolean;
  };

  // 界面配置
  ui: {
    defaultTheme: 'light' | 'dark';
  };

  // 环境信息
  env: {
    mode: string;
    isDevelopment: boolean;
    isProduction: boolean;
  };
}

// 创建配置对象
const config: AppConfig = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Spyt Music',
    version: import.meta.env.VITE_APP_VERSION || '0.1.0',
  },

  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
    enableCache: import.meta.env.VITE_ENABLE_API_CACHE === 'true',
  },

  ui: {
    defaultTheme: (import.meta.env.VITE_DEFAULT_THEME || 'light') as 'light' | 'dark',
  },

  env: {
    mode: import.meta.env.MODE,
    isDevelopment: import.meta.env.MODE === 'development',
    isProduction: import.meta.env.MODE === 'production',
  },
};

export default config;