// 用户类型
export interface User {
  id: string;
  username: string;
  email?: string;
}

// 认证响应类型
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// 通用分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 音乐相关类型
export interface Track {
  id: string;
  name: string;
  artist_id: string;
  artist_name: string;
  album_id: string;
  album_name: string;
  duration_ms: number;
  path?: string;
  status?: 'pending' | 'in_progress' | 'success' | 'failed';
}

export interface Album {
  id: string;
  name: string;
  artist_id: string;
  artist_name: string;
  release_date: string;
  total_tracks: number;
  cover_url?: string;
}

export interface Artist {
  id: string;
  name: string;
  genres?: string[];
  image_url?: string;
}

// 下载任务类型
export interface DownloadTask {
  task_id: string;
  task_type: 'track' | 'album' | 'artist';
  entity_id: string;
  entity_name: string;
  status: 'pending' | 'in_progress' | 'success' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  created_at: string;
  updated_at: string;
}