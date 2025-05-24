import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Pagination,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import { useTranslation } from 'react-i18next';
import { DownloadTask, DownloadTaskStatus } from '../../types/download';
import { cancelTask, retryTask } from '../../services/downloadService';
import { formatDistanceToNow } from 'date-fns';

interface DownloadTaskListProps {
  tasks: DownloadTask[];
  onPageChange: (page: number) => void;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onRefresh: () => void;
  onViewDetails: (taskId: string) => void;
}

const DownloadTaskList: React.FC<DownloadTaskListProps> = ({
  tasks,
  onPageChange,
  currentPage,
  totalItems,
  itemsPerPage,
  onRefresh,
  onViewDetails
}) => {
  const { t } = useTranslation();

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

  // 处理取消任务
  const handleCancelTask = async (taskId: string) => {
    try {
      await cancelTask(taskId);
      onRefresh(); // 刷新列表
    } catch (error) {
      console.error('Failed to cancel task:', error);
    }
  };

  // 处理重试任务
  const handleRetryTask = async (taskId: string) => {
    try {
      await retryTask(taskId);
      onRefresh(); // 刷新列表
    } catch (error) {
      console.error('Failed to retry task:', error);
    }
  };

  // 格式化创建时间
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // 计算任务进度百分比
  const calculateProgress = (task: DownloadTask) => {
    if (task.status === 'success') { return 100; }
    const { progress } = task;
    if (progress.total === 0) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          color="primary"
        >
          {t('common.refresh')}
        </Button>
      </Box>

      {tasks?.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('downloads.noTasks')}
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('downloads.taskName')}</TableCell>
                <TableCell>{t('downloads.type')}</TableCell>
                <TableCell>{t('downloads.status')}</TableCell>
                <TableCell>{t('downloads.progress')}</TableCell>
                <TableCell>{t('downloads.createdAt')}</TableCell>
                <TableCell>{t('downloads.action')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.map((task) => (
                <TableRow key={task.task_id}
                onClick={() => onViewDetails(task.task_id)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell>
                    <Typography variant="body2">{task.entity_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.task_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`downloads.types.${task.task_type}`)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`downloads.statuses.${task.status}`)}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant={task.status === 'in_progress' ? 'determinate' : 'determinate'}
                          value={calculateProgress(task)}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {calculateProgress(task)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption">
                      {task.progress.completed}/{task.progress.total}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatTime(task.created_at)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      {task.status === 'success' && (
                        <Tooltip title={t('downloads.actions.play')}>
                          <IconButton size="small" color="primary">
                            <PlayArrowIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {(task.status === 'pending' || task.status === 'in_progress') && (
                        <Tooltip title={t('downloads.actions.cancel')}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancelTask(task.task_id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {task.status === 'failed' && (
                        <Tooltip title={t('downloads.actions.retry')}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleRetryTask(task.task_id)}
                          >
                            <ReplayIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tasks?.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
          <Pagination
            count={Math.ceil(totalItems / itemsPerPage)}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default DownloadTaskList;