import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar,
  ListItemText, 
  Avatar, 
  IconButton,
  Typography,
  Divider
} from '@mui/material';
import { PlayArrow, AddCircleOutline, MoreVert } from '@mui/icons-material';
import { Track } from '../../types/track';
import { formatDuration } from '../../utils/formatters';
import { usePlayer } from '../../features/player/context/PlayerContext';

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  showNumber?: boolean;
  dense?: boolean;
  onTrackClick?: (track: Track) => void;
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  showAlbum = true, 
  showNumber = true,
  dense = false,
  onTrackClick
}) => {
  const { setCurrentTrack, isPlaying, currentTrack, togglePlay } = usePlayer();

  const handlePlayTrack = (track: Track, event?: React.MouseEvent) => {
    event?.stopPropagation();
    
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
    }
  };

  const handleTrackClick = (track: Track) => {
    if (onTrackClick) {
      onTrackClick(track);
    } else {
      handlePlayTrack(track);
    }
  };

  if (!tracks.length) {
    return null;
  }

  return (
    <List disablePadding>
      {tracks.map((track, index) => {
        const isActive = currentTrack?.id === track.id;
        
        return (
          <React.Fragment key={track.id}>
            <ListItem
              alignItems="center"
              sx={{
                px: 2,
                py: dense ? 0.5 : 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& .play-button': {
                    opacity: 1,
                  },
                },
                ...(isActive && {
                  backgroundColor: 'rgba(29, 185, 84, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(29, 185, 84, 0.25)',
                  },
                }),
              }}
              onClick={() => handleTrackClick(track)}
              secondaryAction={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {formatDuration(track.duration_ms)}
                  </Typography>
                  <IconButton 
                    edge="end" 
                    aria-label="add to playlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 添加到播放列表功能后续实现
                    }}
                  >
                    <AddCircleOutline fontSize="small" />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="options"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 更多选项功能后续实现
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
              }
            >
              {showNumber && (
                <Box 
                  sx={{ 
                    width: 24, 
                    textAlign: 'center',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box 
                    className="play-button"
                    sx={{ 
                      opacity: isActive ? 1 : 0, 
                      transition: 'opacity 0.2s',
                      display: 'flex'
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => handlePlayTrack(track, e)}
                      sx={{ padding: 0 }}
                    >
                      <PlayArrow fontSize="small" />
                    </IconButton>
                  </Box>
                  {!isActive && (
                    <Typography 
                      variant="body2" 
                      color={isActive ? 'primary' : 'text.secondary'}
                    >
                      {index + 1}
                    </Typography>
                  )}
                </Box>
              )}
              
              <ListItemAvatar sx={{ minWidth: dense ? 40 : 56 }}>
                <Avatar 
                  variant="rounded" 
                  src={track.album?.images?.[0]?.url} 
                  alt={track.name}
                />
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Typography 
                    variant="body1" 
                    color={isActive ? 'primary' : 'text.primary'}
                    noWrap
                  >
                    {track.name}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    noWrap
                  >
                    {track.artists.map(a => a.name).join(', ')}
                    {showAlbum && track.album && ` • ${track.album.name}`}
                  </Typography>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default TrackList;