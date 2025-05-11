import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleClick}
      >
        {i18n.language === 'zh' ? '中文' : 'English'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => changeLanguage('zh')}>中文</MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;