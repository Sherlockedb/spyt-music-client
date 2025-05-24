import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AlertColor } from '@mui/material';
import Notification from '../components/common/Notification';

interface NotificationContextType {
  showNotification: (message: string, severity: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// 在 NotificationProvider 组件中添加自动关闭超时功能
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  const showNotification = (
    message: string,
    severity: AlertColor = 'info',
    duration: number = 6000
  ) => {
    setMessage(message);
    setSeverity(severity);
    setAutoHideDuration(duration);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        open={open}
        message={message}
        severity={severity}
        onClose={handleClose}
        autoHideDuration={autoHideDuration}
      />
    </NotificationContext.Provider>
  );
};