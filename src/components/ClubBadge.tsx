import React, { useState } from 'react';
import { Club, getClubById } from '../data/clubs';

interface ClubBadgeProps {
  club?: Club;
  clubId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  glow?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
  '3xl': 'w-40 h-40'
};

export const ClubBadge: React.FC<ClubBadgeProps> = ({
  club,
  clubId,
  size = 'md',
  glow = false,
  className = '',
  onClick,
  title
}) => {
  const currentClub = club || (clubId ? getClubById(clubId) : null);
  const [imgError, setImgError] = useState(false);

  if (!currentClub) {
    return (
      <div
        onClick={onClick}
        className={`${SIZE_MAP[size]} rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors ${className}`}
      >
        <span className="text-[10px] text-slate-400 font-bold">ESCUDO</span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      title={title || currentClub.name}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${SIZE_MAP[size]} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      } ${className}`}
    >
      {/* Optional ambient glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60 pointer-events-none"
          style={{ backgroundColor: currentClub.primaryColor }}
        />
      )}

      {currentClub.badgeUrl && !imgError ? (
        <img
          src={
            currentClub.badgeUrl.startsWith('https://upload.wikimedia.org')
              ? `/api/proxy-image?url=${encodeURIComponent(currentClub.badgeUrl)}`
              : currentClub.badgeUrl
          }
          alt={currentClub.name}
          crossOrigin="anonymous"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain relative z-10 drop-shadow-md select-none pointer-events-none"
          loading="eager"
        />
      ) : (
        <div
          className="w-full h-full relative z-10 flex items-center justify-center drop-shadow-md"
          dangerouslySetInnerHTML={{ __html: currentClub.badgeSvg }}
        />
      )}
    </div>
  );
};
