export type TaskType = 'track' | 'album' | 'artist';
export type DownloadTaskStatus = 'pending' | 'in_progress' | 'success' | 'failed';

export interface DownloadTask {
  task_id: string;
  task_type: TaskType;
  entity_id: string;
  entity_name: string;
  status: DownloadTaskStatus;
  priority: number;
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
  worker_id?: string;
  retries: number;
  max_retries: number;
  error?: string;
  options?: Record<string, any>;
}

export interface PaginatedDownloadTask {
    total: number;
    tasks: Array<DownloadTask>;
}

export interface CreateDownloadRequest {
  entity_id: string;
  priority?: number;
  options?: Record<string, any>;
}