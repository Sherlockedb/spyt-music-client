import axios from 'axios';
import config from '../config';

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加响应拦截器处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理API错误
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 如果启用了缓存，添加请求缓存功能
if (config.api.enableCache) {
  const cache = new Map();

  apiClient.interceptors.request.use(
    (config) => {
      // 只对GET请求启用缓存
      if (config.method?.toLowerCase() === 'get') {
        const key = `${config.url}${JSON.stringify(config.params || {})}`;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
          return {
            ...config,
            adapter: () => Promise.resolve(cachedResponse),
            cached: true,
          };
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => {
      // 存储GET请求响应到缓存
      if (response.config.method?.toLowerCase() === 'get' && !response.config.cached) {
        const key = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
        cache.set(key, response);
      }
      return response;
    }
  );
}

export default apiClient;