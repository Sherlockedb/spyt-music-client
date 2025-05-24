import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TaskType } from '../../types/download';
import {
  createTrackDownloadTask,
  createAlbumDownloadTask,
  createArtistDownloadTask
} from '../../services/downloadService';
import { useNotification } from '../../contexts/NotificationContext';

interface CreateDownloadDialogProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateDownloadDialog: React.FC<CreateDownloadDialogProps> = ({
  open,
  onClose,
  onTaskCreated
}) => {
  const { t } = useTranslation();
  const [taskType, setTaskType] = useState<TaskType>('track');
  const [entityId, setEntityId] = useState('');
  const [priority, setPriority] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 艺术家下载选项
  const [includeSingles, setIncludeSingles] = useState(true);
  const [includeAppearsOn, setIncludeAppearsOn] = useState(false);
  const [minTracks, setMinTracks] = useState(0);

  // 专辑下载选项
  const [filterArtistId, setFilterArtistId] = useState('');
  const { showNotification } = useNotification();

  // 重置表单
  const resetForm = () => {
    setTaskType('track');
    setEntityId('');
    setPriority(5);
    setError(null);
    setSuccess(false);
    setIncludeSingles(true);
    setIncludeAppearsOn(false);
    setMinTracks(0);
    setFilterArtistId('');
  };

  // 处理对话框关闭
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 处理表单提交
  const handleSubmit = async () => {
    // 验证输入
    if (!entityId.trim()) {
      setError(t('downloads.errors.emptyEntityId'));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 根据任务类型创建不同的下载任务
      let taskId: string;

      switch (taskType) {
        case 'track':
          taskId = await createTrackDownloadTask(entityId, priority);
          break;
        case 'album':
          taskId = await createAlbumDownloadTask(
            entityId,
            filterArtistId || undefined,
            priority
          );
          break;
        case 'artist':
          taskId = await createArtistDownloadTask(
            entityId,
            {
              includeSingles,
              includeAppearsOn,
              minTracks,
              priority
            }
          );
          break;
        default:
          throw new Error(t('downloads.errors.invalidTaskType'));
      }

      // 成功创建任务
      setSuccess(true);
      showNotification(t('downloads.notifications.taskCreated'), 'success');
      onTaskCreated();

      // 2秒后自动关闭对话框
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Failed to create download task:', err);
      setError(t('downloads.errors.failedToCreateTask'));
      showNotification(t('downloads.errors.failedToCreateTask'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('downloads.createTask')}</DialogTitle>
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {t('downloads.taskCreatedSuccessfully')}
          </Alert>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('downloads.taskType')}</InputLabel>
            <Select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as TaskType)}
              label={t('downloads.taskType')}
              disabled={loading}
            >
              <MenuItem value="track">{t('downloads.types.track')}</MenuItem>
              <MenuItem value="album">{t('downloads.types.album')}</MenuItem>
              <MenuItem value="artist">{t('downloads.types.artist')}</MenuItem>
            </Select>
            <FormHelperText>
              {t(`downloads.taskTypeHelp.${taskType}`)}
            </FormHelperText>
          </FormControl>

          <TextField
            label={t(`downloads.entityIdLabel.${taskType}`)}
            fullWidth
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            helperText={t(`downloads.entityIdHelp.${taskType}`)}
            margin="normal"
            disabled={loading}
          />

          <Box sx={{ my: 3 }}>
            <Typography id="priority-slider" gutterBottom>
              {t('downloads.priority')}: {priority}
            </Typography>
            <Slider
              value={priority}
              onChange={(_, value) => setPriority(value as number)}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              aria-labelledby="priority-slider"
              disabled={loading}
            />
            <Typography variant="caption" color="text.secondary">
              {t('downloads.priorityHelp')}
            </Typography>
          </Box>

          {/* 根据任务类型显示不同的选项 */}
          {taskType === 'album' && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                {t('downloads.albumOptions')}
              </Typography>
              <TextField
                label={t('downloads.filterArtistId')}
                fullWidth
                value={filterArtistId}
                onChange={(e) => setFilterArtistId(e.target.value)}
                helperText={t('downloads.filterArtistIdHelp')}
                margin="normal"
                disabled={loading}
              />
            </Box>
          )}

          {taskType === 'artist' && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                {t('downloads.artistOptions')}
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={includeSingles}
                    onChange={(e) => setIncludeSingles(e.target.checked)}
                    disabled={loading}
                  />
                }
                label={t('downloads.includeSingles')}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={includeAppearsOn}
                    onChange={(e) => setIncludeAppearsOn(e.target.checked)}
                    disabled={loading}
                  />
                }
                label={t('downloads.includeAppearsOn')}
              />

              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>
                  {t('downloads.minTracks')}: {minTracks}
                </Typography>
                <Slider
                  value={minTracks}
                  onChange={(_, value) => setMinTracks(value as number)}
                  min={0}
                  max={20}
                  step={1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                    { value: 15, label: '15' },
                    { value: 20, label: '20' }
                  ]}
                  valueLabelDisplay="auto"
                  disabled={loading}
                />
                <Typography variant="caption" color="text.secondary">
                  {t('downloads.minTracksHelp')}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading || !entityId.trim()}
        >
          {loading ? <CircularProgress size={24} /> : t('downloads.createTaskButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDownloadDialog;