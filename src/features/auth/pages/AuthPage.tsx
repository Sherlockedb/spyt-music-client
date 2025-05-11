import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../../../components/common/LanguageSwitcher';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  // 如果用户已认证，重定向到首页
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    navigate('/');
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    await register(username, email, password);
    // 注册成功后切换到登录模式
    setMode('login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <LanguageSwitcher />
      </Box>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        {mode === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onNavigateToRegister={() => setMode('register')}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onNavigateToLogin={() => setMode('login')}
          />
        )}
      </Box>
    </Container>
  );
};

export default AuthPage;