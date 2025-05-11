import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import authService from '../services/authService';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);

      // Save token to localStorage
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      await authService.register(username, email, password);

      // Switch to login mode after successful registration
      setMode('login');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <Container maxWidth="sm">
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