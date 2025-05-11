import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义音乐曲目类型
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (position: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // 初始化音频元素
  useEffect(() => {
    const audioElement = new Audio();
    setAudio(audioElement);

    // 清理函数
    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, []);

  // 监听音频事件
  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // 可以在这里添加自动播放下一首的逻辑
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  // 播放特定曲目
  const playTrack = (track: Track) => {
    if (!audio) return;

    // 设置音频源
    audio.src = track.audioUrl;
    audio.load();
    setCurrentTrack(track);

    // 播放
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(error => {
        console.error('播放失败:', error);
        setIsPlaying(false);
      });
  };

  // 切换播放/暂停
  const togglePlay = () => {
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }

    setIsPlaying(!isPlaying);
  };

  // 设置音量
  const handleSetVolume = (newVolume: number) => {
    if (!audio) return;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audio.volume = clampedVolume;
    setVolume(clampedVolume);
  };

  // 跳转到指定位置
  const seek = (position: number) => {
    if (!audio) return;

    audio.currentTime = position;
    setProgress(position);
  };

  // 播放下一首（示例实现，实际应用中需要playlist状态）
  const nextTrack = () => {
    // 实现播放下一首的逻辑
    console.log('Next track');
  };

  // 播放上一首（示例实现，实际应用中需要playlist状态）
  const prevTrack = () => {
    // 实现播放上一首的逻辑
    console.log('Previous track');
  };

  const value = {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    playTrack,
    togglePlay,
    setVolume: handleSetVolume,
    seek,
    nextTrack,
    prevTrack
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};