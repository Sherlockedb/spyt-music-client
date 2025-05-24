import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from '../../App';
import AuthPage from '../../features/auth/pages/AuthPage';
import MainLayout from '../../components/layout/MainLayout';
import HomePage from '../../pages/HomePage';
import SearchPage from '../../pages/SearchPage';
import DownloadManagerPage from '../../pages/DownloadManagerPage';
import DownloadHistoryPage from '../../pages/DownloadHistoryPage';
import { Navigate } from 'react-router-dom';
import { NotificationProvider } from '@/contexts/NotificationContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// 路由配置
const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <NotificationProvider>
        <App />
      </NotificationProvider>
    ),
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: <HomePage />
          },
          {
            path: 'search',
            element: <SearchPage />
          },
          {
            path: 'library',
            element: <div>Library Page</div>
          },
          {
            path: 'playlists',
            element: <div>Playlists Page</div>
          },
          {
            path: 'profile',
            element: <div>Profile Page</div>
          },
          {
            path: 'downloads',
            element: <DownloadManagerPage />
          },
          // 添加下载历史路由
          {
            path: 'downloads/history',
            element: <DownloadHistoryPage />
          }
        ]
      },
      {
        path: 'auth',
        element: <AuthPage />
      }
    ],
  }
];

// 创建路由器
export const router = createBrowserRouter(routes);