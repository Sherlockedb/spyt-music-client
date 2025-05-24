import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getTaskDetails, retryTask, cancelTask } from '../../services/downloadService';
import { DownloadTask, DownloadTaskStatus } from '../../types/download';
import { formatDistanceToNow, format } from 'date-fns';

interface DownloadTaskDetailProps {
  taskId: string;
  open: boolean;
  onClose: () => void;
}

const DownloadTaskDetail: React.FC<DownloadTaskDetailProps> = ({ taskId, open, onClose }) => {
  const { t } = useTranslation();
  const [task, setTask] = useState<DownloadTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  // 加载任务详情
  useEffect(() => {
    if (open && taskId) {
      fetchTaskDetails();
    }
  }, [open, taskId]);

  // 获取任务详情
  const fetchTaskDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const taskDetails = await getTaskDetails(taskId);
      setTask(taskDetails);
    } catch (err) {
      console.error('Failed to fetch task details:', err);
      setError(t('downloads.errors.failedToLoadDetails'));
    } finally {
      setLoading(false);
    }
  };

  // 根据状态返回对应的Chip颜色
  const getStatusColor = (status: DownloadTaskStatus) => {
    switch (status) {
      case 'pending': return 'info';
      case 'in_progress': return 'warning';
      case 'success': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  // 计算任务进度百分比
  const calculateProgress = (task: DownloadTask) => {
    console.log(`===== calculateProgress ${task.status}`);
    if (task.status === 'success') { return 100; }
    const { progress } = task;
    if (progress.total === 0) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  };

  // 格式化日期时间
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  };

  // 处理取消任务
  const handleCancel = async () => {
    setActionInProgress(true);
    try {
      await cancelTask(taskId);
      fetchTaskDetails(); // 刷新任务详情
    } catch (err) {
      console.error('Failed to cancel task:', err);
      setError(t('downloads.errors.failedToCancel'));
    } finally {
      setActionInProgress(false);
    }
  };

  // 处理重试任务
  const handleRetry = async () => {
    setActionInProgress(true);
    try {
      await retryTask(taskId);
      fetchTaskDetails(); // 刷新任务详情
    } catch (err) {
      console.error('Failed to retry task:', err);
      setError(t('downloads.errors.failedToRetry'));
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('downloads.taskDetails')}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : task ? (
          <Box>
            {/* 任务标题和状态 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {task.entity_name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={t(`downloads.types.${task.task_type}`)}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={t(`downloads.statuses.${task.status}`)}
                  color={getStatusColor(task.status)}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {t('downloads.priority')}: {task.priority}
                </Typography>
              </Box>
            </Box>

            {/* 进度条 */}
            {task.status !== 'pending' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" gutterBottom>
                  {t('downloads.progress')}: {task.progress.completed}/{task.progress.total}
                  {task.status === 'in_progress' && ' (下载中...)'}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={calculateProgress(task)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  {calculateProgress(task)}%
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* 任务详细信息 */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('downloads.basicInfo')}
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary={t('downloads.taskId')}
                      secondary={task.task_id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={t('downloads.entityId')}
                      secondary={task.entity_id}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={t('downloads.retries')}
                      secondary={`${task.retries}/${task.max_retries}`}
                    />
                  </ListItem>
                  {task.worker_id && (
                    <ListItem>
                      <ListItemText
                        primary={t('downloads.workerId')}
                        secondary={task.worker_id}
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('downloads.timing')}
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary={t('downloads.createdAt')}
                      secondary={formatDateTime(task.created_at)}
                    />
                  </ListItem>
                  {task.started_at && (
                    <ListItem>
                      <ListItemText
                        primary={t('downloads.startedAt')}
                        secondary={formatDateTime(task.started_at)}
                      />
                    </ListItem>
                  )}
                  {task.completed_at && (
                    <ListItem>
                      <ListItemText
                        primary={t('downloads.completedAt')}
                        secondary={formatDateTime(task.completed_at)}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText
                      primary={t('downloads.updatedAt')}
                      secondary={formatDateTime(task.updated_at)}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>

            {/* 错误信息显示 */}
            {task.error && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  {t('downloads.errorDetails')}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}
                >
                  <Typography variant="body2">
                    {task.error}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        ) : (
          <Typography>{t('downloads.noTaskSelected')}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {task && (
          <>
            {task.status === 'pending' || task.status === 'in_progress' ? (
              <Button
                onClick={handleCancel}
                color="error"
                disabled={actionInProgress}
              >
                {actionInProgress ? <CircularProgress size={24} /> : t('downloads.actions.cancel')}
              </Button>
            ) : task.status === 'failed' ? (
              <Button
                onClick={handleRetry}
                color="primary"
                disabled={actionInProgress}
              >
                {actionInProgress ? <CircularProgress size={24} /> : t('downloads.actions.retry')}
              </Button>
            ) : null}
          </>
        )}
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadTaskDetail;