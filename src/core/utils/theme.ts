import { createTheme } from '@mui/material/styles';

// 创建应用主题
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Spotify绿色
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#0a1929', // 深蓝色背景，替换原来的黑色
      paper: '#0f2942',   // 稍浅一点的蓝色，用于卡片和面板
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#0f2942', // 卡片背景色
        },
      },
    },
    // 新增 AppBar 样式
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#061523', // 更深的蓝色用于顶栏
          backgroundImage: 'linear-gradient(90deg, rgba(29, 185, 84, 0.05) 0%, transparent 50%)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    // 新增 Drawer 样式
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#061523', // 侧边栏与顶栏保持一致
          backgroundImage: 'linear-gradient(180deg, rgba(29, 185, 84, 0.05) 0%, transparent 30%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    // 增强 Paper 样式
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 41, 66, 0.95)', // 改为蓝色调
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        },
        elevation2: {
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    // 为表格增加样式
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(6, 21, 35, 0.8)', // 深蓝色表头
        },
      },
    },
    // 为列表项增加样式
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(29, 185, 84, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(29, 185, 84, 0.25)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    // 基础UI元素样式
    MuiCssBaseline: {
      styleOverrides: `
        body {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }

        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        &::-webkit-scrollbar-track {
          background: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `,
    },
  },
});