import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const SpytLogo: React.FC<LogoProps> = ({ width = 120, height = 120, className }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 添加阴影效果 */}
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#000000" floodOpacity="0.3"/>
      </filter>

      {/* 背景渐变定义 - 蓝色渐变 */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a4b8c" /> {/* 中等蓝色 */}
          <stop offset="100%" stopColor="#092851" /> {/* 深蓝色 */}
        </linearGradient>

        {/* 光晕效果 */}
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="rgba(29, 185, 84, 0.3)" /> {/* 绿色光晕 */}
          <stop offset="100%" stopColor="rgba(29, 185, 84, 0)" />
        </radialGradient>
      </defs>

      {/* 主背景圆 - 使用渐变填充 */}
      <circle cx="256" cy="256" r="245" fill="url(#bgGradient)" filter="url(#dropShadow)" />

      {/* 边框效果 */}
      <circle cx="256" cy="256" r="242" stroke="#ffffff" strokeWidth="2" fill="none" />
      <circle cx="256" cy="256" r="248" stroke="#1DB954" strokeWidth="4" fill="none" />

      {/* 光晕效果层 */}
      <circle cx="256" cy="256" r="220" fill="url(#glowGradient)" />

      {/* Spotify声波线 - 调整位置和粗细 */}
      <path d="M128 316C208 266 304 316 384 266" stroke="#1DB954" strokeWidth="18" strokeLinecap="round" />
      <path d="M96 376C208 306 304 376 416 306" stroke="#1DB954" strokeWidth="18" strokeLinecap="round" />
      <path d="M64 436C208 346 304 436 448 346" stroke="#1DB954" strokeWidth="18" strokeLinecap="round" />

      {/* YouTube红色播放按钮 - 加强渐变 */}
      <defs>
        <radialGradient id="redGradient" cx="40%" cy="40%" r="90%" fx="40%" fy="40%">
          <stop offset="0%" stopColor="#FF5555" />
          <stop offset="100%" stopColor="#CC0000" />
        </radialGradient>
      </defs>

      {/* 播放按钮阴影 */}
      <filter id="buttonShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.4"/>
      </filter>

      {/* 红色播放按钮 */}
      <circle cx="256" cy="256" r="100" fill="url(#redGradient)" filter="url(#buttonShadow)" />

      {/* 播放三角形 */}
      <path d="M220 200L320 256L220 312V200Z" fill="white" />

      {/* 添加高光效果 */}
      <circle cx="230" cy="230" r="10" fill="rgba(255, 255, 255, 0.4)" />
    </svg>
  );
};

export default SpytLogo;