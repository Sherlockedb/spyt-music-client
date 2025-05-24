import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Divider,
  Grid,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAllTasks, getDownloadStats, cancelTask, retryTask } from '../services/downloadService';
import DownloadTaskList from '../components/downloads/DownloadTaskList';
import DownloadStatsCard from '../components/downloads/DownloadStatsCard';
import { DownloadTask, DownloadTaskStatus } from '../types/download';
import { Add as AddIcon } from '@mui/icons-material';
import CreateDownloadDialog from '../components/downloads/CreateDownloadDialog';
import DownloadTaskDetail from '../components/downloads/DownloadTaskDetail';
import { useNotification } from '../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const DownloadManagerPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<DownloadTaskStatus | 'all'>('all');
  const [tasks, setTasks] = useState<DownloadTask[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    success: 0,
    failed: 0
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [itemsPerPage] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { showNotification } = useNotification();

  // 获取任务列表
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const status = activeTab !== 'all' ? activeTab : undefined;
      const response = await getAllTasks(status, (page-1)*itemsPerPage, limit);
      setTasks(response);
      setTotalTasks(response.length);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取下载统计信息
  const fetchStats = async () => {
    try {
      const stats = await getDownloadStats();
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // 初始加载和状态变化时刷新数据
  useEffect(() => {
    fetchTasks();
    fetchStats();

    // 设置定时刷新
    const intervalId = setInterval(() => {
      fetchTasks();
      fetchStats();
    }, 60000); // 每60秒刷新一次

    return () => clearInterval(intervalId);
  }, [activeTab, page, limit]);

  // 处理标签切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: DownloadTaskStatus | 'all') => {
    setActiveTab(newValue);
    setPage(1); // 切换标签时重置到第一页
  };

  // 处理页面变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 处理任务详情查看
  const handleViewTaskDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDetailDialogOpen(true);
  };

  // 使用通知
  const handleTaskAction = async (action: 'cancel' | 'retry', taskId: string) => {
    try {
      if (action === 'cancel') {
        await cancelTask(taskId);
        showNotification(t('downloads.notifications.taskCancelled'), 'success');
      } else {
        await retryTask(taskId);
        showNotification(t('downloads.notifications.taskRetried'), 'success');
      }
      fetchTasks(); // 刷新任务列表
    } catch (error) {
      console.error(`Failed to ${action} task:`, error);
      showNotification(t(`downloads.errors.failedTo${action === 'cancel' ? 'Cancel' : 'Retry'}`), 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            {t('downloads.manager')}
          </Typography>
          <Button
            component={Link}
            to="/downloads/history"
            sx={{ mt: 1 }}
          >
            {t('downloads.viewHistory')} <ArrowForwardIcon fontSize="small" />
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          {t('downloads.newTask')}
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <DownloadStatsCard
              title={t('downloads.stats.total')}
              count={stats.total}
              color="primary"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <DownloadStatsCard
              title={t('downloads.stats.pending')}
              count={stats.pending}
              color="info"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <DownloadStatsCard
              title={t('downloads.stats.inProgress')}
              count={stats.in_progress}
              color="warning"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <DownloadStatsCard
              title={t('downloads.stats.completed')}
              count={stats.success}
              color="success"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <DownloadStatsCard
              title={t('downloads.stats.failed')}
              count={stats.failed}
              color="success"
            />
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={t('downloads.tabs.all')} value="all" />
          <Tab label={t('downloads.tabs.pending')} value="pending" />
          <Tab label={t('downloads.tabs.inProgress')} value="in_progress" />
          <Tab label={t('downloads.tabs.completed')} value="success" />
          <Tab label={t('downloads.tabs.failed')} value="failed" />
        </Tabs>
        <Divider />

        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <DownloadTaskList
              tasks={tasks}
              onPageChange={handlePageChange}
              currentPage={page}
              totalItems={totalTasks}
              itemsPerPage={itemsPerPage}
              onRefresh={fetchTasks}
              onViewDetails={handleViewTaskDetails}
            />
          )}
        </Box>
      </Paper>

      <CreateDownloadDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTaskCreated={fetchTasks}
      />

      <DownloadTaskDetail
        taskId={selectedTaskId || ''}
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
      />

      {/* 添加悬浮动作按钮 */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: '50%', width: 56, height: 56 }}
          onClick={() => setCreateDialogOpen(true)}
        >
          <AddIcon />
        </Button>
      </Box>
    </Container>
  );
};

export default DownloadManagerPage;