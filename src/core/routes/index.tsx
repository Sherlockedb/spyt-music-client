import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from '../../App';
import AuthPage from '../../features/auth/pages/AuthPage';

// 路由配置
const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'auth',
        element: <AuthPage />
      }
    ],
  },
];

// 创建路由器
export const router = createBrowserRouter(routes);