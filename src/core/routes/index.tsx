import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from '../../App';

// 路由配置
const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      // 子路由会在后续添加
    ],
  },
];

// 创建路由器
export const router = createBrowserRouter(routes);