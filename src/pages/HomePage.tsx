import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import { MusicNoteOutlined, SearchOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  // 实际应用中，这里应该从API获取数据
  const recentTracks: any[] = []; // 空数组，表示没有最近播放记录

  return (
    <Container maxWidth={isLargeScreen ? "lg" : "xl"} disableGutters={!isLargeScreen}>
      <Box sx={{ py: { xs: 2, sm: 4 } }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{ mb: 3 }}
        >
          {t('home.welcome')}, {user?.username || t('home.guest')}!
        </Typography>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ mt: { xs: 3, sm: 4 }, mb: 2 }}
        >
          {t('home.recentlyPlayed')}
        </Typography>

        {recentTracks.length > 0 ? (
          <Grid container spacing={2}>
            {recentTracks.map(track => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="body1" component="div">
                      {track.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {track.artist}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 4 },
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 3, sm: 4 },
              borderRadius: 2
            }}
          >
            <MusicNoteOutlined sx={{ fontSize: { xs: 40, sm: 60 }, color: 'text.secondary', mb: 2 }} />
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              {t('home.noRecentlyPlayed')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}
            >
              {t('home.startListening')}
            </Typography>
            <Button
              variant="contained"
              size={isMobile ? "small" : "medium"}
              startIcon={<SearchOutlined />}
              onClick={() => navigate('/search')}
            >
              {t('home.browseMusic')}
            </Button>
          </Paper>
        )}

        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{ mt: { xs: 3, sm: 4 }, mb: 2 }}
        >
          {t('home.recommendations')}
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 4 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <Typography
            variant="body2"
            sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}
          >
            {t('home.personalizedRecommendations')}
          </Typography>
          <Button
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate('/search')}
          >
            {t('home.exploreMusic')}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;