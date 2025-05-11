import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './features/auth/context/AuthContext';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { isLoading } = useAuth();
  const { t } = useTranslation();

  // 全局加载状态
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Box sx={{ ml: 2 }}>{t('common.loading')}</Box>
      </Box>
    );
  }

  // 使用Outlet渲染子路由内容
  return <Outlet />;
};

export default App;