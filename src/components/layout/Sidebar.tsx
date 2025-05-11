import React from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  LibraryMusic as LibraryIcon,
  QueueMusic as PlaylistIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SpytLogo from '../common/SpytLogo';

interface SidebarProps {
  width: number; // 新增宽度属性
}

const Sidebar: React.FC<SidebarProps> = ({ width }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项
  const menuItems = [
    { text: t('nav.home'), icon: <HomeIcon />, path: '/' },
    { text: t('nav.search'), icon: <SearchIcon />, path: '/search' },
    { text: t('nav.library'), icon: <LibraryIcon />, path: '/library' },
    { text: t('nav.playlists'), icon: <PlaylistIcon />, path: '/playlists' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <SpytLogo width={120} height={120} />
      </Box>
      <Typography variant="h6" align="center" sx={{ mb: 2 }}>
        Spyt Music
      </Typography>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;