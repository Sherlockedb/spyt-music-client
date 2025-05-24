/**
 * 将毫秒转换为分钟:秒格式
 */
export const formatDuration = (ms: number): string => {
  if (!ms) return '0:00';
  
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 格式化艺术家名称列表
 */
export const formatArtistNames = (artists: Array<{ name: string }>): string => {
  if (!artists || !artists.length) return '';
  return artists.map(artist => artist.name).join(', ');
};