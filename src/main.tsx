import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { router } from './core/routes';
import { queryClient } from './core/api/queryClient';
import { theme } from './core/utils/theme';
import { AuthProvider } from './features/auth/context/AuthContext';
import { setupAuthInterceptors } from './core/api/interceptors/authInterceptor';
import './core/i18n/i18n';
import './index.css';

setupAuthInterceptors();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* 提供基础样式重置 */}
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);