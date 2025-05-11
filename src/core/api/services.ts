import { apiClient } from './client';
import { Album, Artist, DownloadTask, Track, PaginatedResponse } from '../types/models';

// 搜索服务
export const searchService = {
  // 统一搜索API
  search: async (query: string, type: string = 'track,album,artist', limit: number = 20) => {
    const response = await apiClient.get('/search/', { 
      params: { q: query, type, limit } 
    });
    return response.data;
  },
  
  // 获取单个曲目详情
  getTrackDetail: async (trackId: string) => {
    const response = await apiClient.get(`/search/tracks/${trackId}`);
    return response.data;
  },
  
  // 获取专辑详情
  getAlbumDetail: async (albumId: string) => {
    const response = await apiClient.get(`/search/albums/${albumId}`);
    return response.data;
  },
  
  // 获取艺术家详情
  getArtistDetail: async (artistId: string) => {
    const response = await apiClient.get(`/search/artists/${artistId}`);
    return response.data;
  }
};

// 下载服务
export const downloadService = {
  // 创建下载任务
  createDownloadTask: async (entityId: string, entityType: 'track' | 'album' | 'artist', priority: number = 5, options = {}) => {
    const response = await apiClient.post('/downloads/', { 
      entity_id: entityId,
      entity_type: entityType,
      priority,
      options
    });
    return response.data;
  },
  
  // 获取任务列表
  getTasks: async (status?: string, entityId?: string, skip: number = 0, limit: number = 100) => {
    const response = await apiClient.get('/downloads/', {
      params: { status, entity_id: entityId, skip, limit }
    });
    return response.data as DownloadTask[];
  },
  
  // 获取任务状态
  getTaskStatus: async (taskId: string) => {
    const response = await apiClient.get(`/downloads/${taskId}`);
    return response.data as DownloadTask;
  },
  
  // 取消任务
  cancelTask: async (taskId: string) => {
    await apiClient.delete(`/downloads/${taskId}`);
    return true;
  },
  
  // 重试任务
  retryTask: async (taskId: string) => {
    const response = await apiClient.post(`/downloads/${taskId}/retry`);
    return response.data as DownloadTask;
  },
  
  // 获取下载统计
  getStatistics: async () => {
    const response = await apiClient.get('/downloads/statistics');
    return response.data;
  }
};

// 音乐库服务
export const libraryService = {
  // 获取曲目文件信息
  getTrackFileInfo: async (trackId: string) => {
    const response = await apiClient.get(`/library/tracks/${trackId}`);
    return response.data;
  },
  
  // 列出库中文件
  listFiles: async (skip: number = 0, limit: number = 100) => {
    const response = await apiClient.get('/library/files', {
      params: { skip, limit }
    });
    return response.data;
  }
};

// 流媒体服务
export const streamService = {
  // 获取音频流URL
  getStreamUrl: (trackId: string) => {
    return `${apiClient.defaults.baseURL}/stream/${trackId}`;
  },
  
  // 检查曲目是否可用
  checkTrackAvailable: async (trackId: string) => {
    try {
      await apiClient.head(`/stream/${trackId}`);
      return true;
    } catch (error) {
      return false;
    }
  }
};