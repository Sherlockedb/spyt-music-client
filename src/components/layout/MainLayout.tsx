import React from 'react';
import { Box, useMediaQuery, Theme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  const isExtraLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));

  // 根据屏幕大小调整侧边栏宽度
  const sidebarWidth = isExtraLargeScreen ? 280 : 240;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 侧边栏 */}
      <Sidebar width={sidebarWidth} />

      {/* 主内容区 */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 顶部导航栏 */}
        <Navbar />

        {/* 内容区域 - 占满所有可用空间 */}
        <Box component="main" sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          overflow: 'auto',
          width: '100%' // 占满整个宽度
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;