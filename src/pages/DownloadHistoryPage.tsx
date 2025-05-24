import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAllTasks } from '../services/downloadService';
import { DownloadTask } from '../types/download';
import { formatDistance, format } from 'date-fns';

const DownloadHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<DownloadTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    fetchCompletedTasks();
  }, [page]);

  const fetchCompletedTasks = async () => {
    setLoading(true);
    try {
      const response = await getAllTasks('success', page, 50);
      setTasks(response.tasks);
      setTotalTasks(response.total);
    } catch (error) {
      console.error('Failed to fetch completed tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算下载时长
  const calculateDuration = (task: DownloadTask) => {
    if (!task.started_at || !task.completed_at) return '-';

    const startTime = new Date(task.started_at);
    const endTime = new Date(task.completed_at);

    const durationMs = endTime.getTime() - startTime.getTime();

    // 格式化为时:分:秒
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor(durationMs / (1000 * 60 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('downloads.history')}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks?.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('downloads.noCompletedTasks')}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tasks?.map(task => (
            <Grid item xs={12} md={6} lg={4} key={task.task_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" noWrap title={task.entity_name}>
                    {task.entity_name}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                    <Chip
                      label={t(`downloads.types.${task.task_type}`)}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={t(`downloads.statuses.${task.status}`)}
                      color="success"
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('downloads.completedAt')}:
                    </Typography>
                    <Typography variant="body2">
                      {task.completed_at ? format(new Date(task.completed_at), 'yyyy-MM-dd HH:mm') : '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('downloads.duration')}:
                    </Typography>
                    <Typography variant="body2">
                      {calculateDuration(task)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('downloads.downloaded')}:
                    </Typography>
                    <Typography variant="body2">
                      {task.progress.completed}/{task.progress.total}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DownloadHistoryPage;