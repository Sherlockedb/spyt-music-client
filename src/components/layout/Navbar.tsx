import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  AccountCircle,
  Search as SearchIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(8px)',
        zIndex: theme.zIndex.drawer + 1,
        width: '100%' // 确保占满整个宽度
      }}
    >
      <Toolbar sx={{
        px: { xs: 1, sm: 2, md: 3 },
        width: '100%', // 确保工具栏占满宽度
        display: 'flex',
        justifyContent: 'space-between' // 两端对齐布局
      }}>
        {/* 左侧区域 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* 移动端显示标题 */}
          {isMobile && (
            <Typography
              variant="h6"
              component="div"
              sx={{ display: { xs: 'block', sm: 'none' } }}
            >
              Spyt Music
            </Typography>
          )}

          {/* 搜索按钮 - 移动端 */}
          <IconButton
            size="large"
            color="inherit"
            onClick={() => navigate('/search')}
            sx={{ display: { xs: 'flex', md: 'none' }, ml: isMobile ? 1 : 0 }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* 右侧工具栏 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* 通知图标 */}
          <IconButton
            size="large"
            color="inherit"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <NotificationsIcon />
          </IconButton>

          {/* 语言切换器 */}
          <LanguageSwitcher />

          {/* 用户菜单 */}
          <Box sx={{ ml: { xs: 1, sm: 2 } }}>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              {user?.username ? (
                <Avatar
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    bgcolor: 'primary.main'
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>{t('user.profile')}</MenuItem>
              <MenuItem onClick={handleLogout}>{t('user.logout')}</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;