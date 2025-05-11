import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next'; // 导入翻译hook

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
  onNavigateToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(); // 使用翻译hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证密码匹配
    if (password !== confirmPassword) {
      setError(t('auth.passwordsNotMatch'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onRegister(username, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {t('auth.registerTitle')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label={t('auth.username')}
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />

        <TextField
          label={t('auth.email')}
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <TextField
          label={t('auth.password')}
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <TextField
          label={t('auth.confirmPassword')}
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          error={password !== confirmPassword && confirmPassword !== ''}
          helperText={password !== confirmPassword && confirmPassword !== '' ? t('auth.passwordsNotMatch') : ''}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : t('auth.register')}
        </Button>

        <Button
          variant="text"
          color="primary"
          fullWidth
          onClick={onNavigateToLogin}
          disabled={loading}
        >
          {t('auth.hasAccount')}
        </Button>
      </Box>
    </Paper>
  );
};

export default RegisterForm;