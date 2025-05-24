import React from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Avatar, Box } from '@mui/material';
import { Artist } from '../../types/artist';
import { useNavigate } from 'react-router-dom';

interface ArtistGridProps {
  artists: Artist[];
  cols?: 2 | 3 | 4 | 6;
}

const ArtistGrid: React.FC<ArtistGridProps> = ({ artists, cols = 4 }) => {
  const navigate = useNavigate();

  if (!artists.length) {
    return null;
  }

  // 根据列数确定 Grid 项的大小
  const getGridSize = () => {
    switch (cols) {
      case 2: return 6;
      case 3: return 4;
      case 6: return 2;
      case 4:
      default: return 3;
    }
  };

  const handleArtistClick = (artist: Artist) => {
    navigate(`/artists/${artist.id}`);
  };

  return (
    <Grid container spacing={2}>
      {artists.map((artist) => (
        <Grid item xs={12} sm={6} md={getGridSize()} key={artist.id}>
          <Card 
            elevation={0}
            sx={{ 
              backgroundColor: 'background.paper',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <CardActionArea onClick={() => handleArtistClick(artist)}>
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 1 }}>
                <Avatar
                  sx={{ 
                    width: 120, 
                    height: 120,
                    borderRadius: '50%'
                  }}
                  src={artist.images?.[0]?.url || '/placeholder-artist.png'}
                  alt={artist.name}
                />
              </Box>
              <CardContent sx={{ textAlign: 'center', px: 1, pt: 1, pb: '8px !important' }}>
                <Typography variant="body1" component="div" noWrap>
                  {artist.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  艺术家
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ArtistGrid;