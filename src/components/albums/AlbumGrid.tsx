import React from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Album } from '../../types/album';
import { useNavigate } from 'react-router-dom';

interface AlbumGridProps {
  albums: Album[];
  cols?: 2 | 3 | 4 | 6;
}

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums, cols = 4 }) => {
  const navigate = useNavigate();

  if (!albums.length) {
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

  const handleAlbumClick = (album: Album) => {
    navigate(`/albums/${album.id}`);
  };

  return (
    <Grid container spacing={2}>
      {albums.map((album) => (
        <Grid item xs={12} sm={6} md={getGridSize()} key={album.id}>
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
            <CardActionArea onClick={() => handleAlbumClick(album)}>
              <CardMedia
                component="img"
                sx={{ 
                  aspectRatio: '1/1',
                  width: '100%',
                  borderRadius: 1
                }}
                image={album.images?.[0]?.url || '/placeholder-album.png'}
                alt={album.name}
              />
              <CardContent sx={{ px: 1, pt: 1, pb: '8px !important' }}>
                <Typography variant="body1" component="div" noWrap>
                  {album.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {album.release_date?.substring(0, 4)} • {album.artists.map(a => a.name).join(', ')}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AlbumGrid;