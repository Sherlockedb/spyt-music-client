import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme
} from '@mui/material';

interface DownloadStatsCardProps {
  title: string;
  count: number;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

const DownloadStatsCard: React.FC<DownloadStatsCardProps> = ({ title, count, color }) => {
  const theme = useTheme();

  // 根据color属性获取颜色
  const getColor = () => {
    return theme.palette[color].main;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: `4px solid ${getColor()}`
      }}
    >
      <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
        {count}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );
};

export default DownloadStatsCard;