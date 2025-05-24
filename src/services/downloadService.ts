import apiClient from '../core/api/client';
import { DownloadTask, DownloadTaskStatus, TaskType } from '../types/download';

/**
 * 创建下载任务
 */
export const createDownloadTask = async (
  entityId: string,
  entityType: TaskType,
  options: {
    priority?: number;
    [key: string]: any;
  } = {}
): Promise<string> => {
  const { priority = 5, ...otherOptions } = options;

  const response = await apiClient.post('/downloads/', {
    entity_id: entityId,
    entity_type: entityType,
    priority,
    options: otherOptions
  });

  return response.data.task_id;
};

/**
 * 创建曲目下载任务
 */
export const createTrackDownloadTask = async (trackId: string, priority: number = 5): Promise<string> => {
  return createDownloadTask(trackId, 'track', { priority });
};

/**
 * 创建专辑下载任务
 */
export const createAlbumDownloadTask = async (
  albumId: string,
  filterArtistId?: string,
  priority: number = 5
): Promise<string> => {
  return createDownloadTask(albumId, 'album', {
    filter_artist_id: filterArtistId,
    priority
  });
};

/**
 * 创建艺术家下载任务
 */
export const createArtistDownloadTask = async (
  artistId: string,
  options: {
    includeSingles?: boolean;
    includeAppearsOn?: boolean;
    minTracks?: number;
    priority?: number;
  } = {}
): Promise<string> => {
  const { includeSingles = true, includeAppearsOn = false, minTracks = 0, priority = 5 } = options;

  return createDownloadTask(artistId, 'artist', {
    include_singles: includeSingles,
    include_appears_on: includeAppearsOn,
    min_tracks: minTracks,
    priority
  });
};

/**
 * 获取所有下载任务
 */
export const getAllTasks = async (
  status?: DownloadTaskStatus,
  skip: number = 0,
  limit: number = 50
): Promise<DownloadTask[]> => {
  const params = { status, skip, limit };
  const response = await apiClient.get('/downloads/', { params });
  return response.data;
};

/**
 * 获取任务详情
 */
export const getTaskDetails = async (taskId: string): Promise<DownloadTask> => {
  const response = await apiClient.get(`/downloads/${taskId}`);
  return response.data;
};

/**
 * 取消任务
 */
export const cancelTask = async (taskId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/downloads/${taskId}`);
    return true;
  } catch (error) {
    console.error('Failed to cancel task:', error);
    return false;
  }
};

/**
 * 重试失败的任务
 */
export const retryTask = async (taskId: string): Promise<boolean> => {
  try {
    await apiClient.post(`/downloads/${taskId}/retry`);
    return true;
  } catch (error) {
    console.error('Failed to retry task:', error);
    return false;
  }
};

/**
 * 获取下载统计信息
 */
export const getDownloadStats = async (): Promise<{
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  failed: number;
}> => {
  const response = await apiClient.get('/downloads/statistics');
  return response.data;
};