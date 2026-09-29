import React from 'react';
import { Competition, getCompetitionById } from '../data/competitions';

interface CompetitionBadgeProps {
  competition?: Competition;
  competitionId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  title?: string;
}

const SIZE_MAP = {
  sm: 'w-12 h-10',
  md: 'w-20 h-14',
  lg: 'w-28 h-20',
  xl: 'w-36 h-24'
};

export const CompetitionBadge: React.FC<CompetitionBadgeProps> = ({
  competition,
  competitionId,
  size = 'md',
  className = '',
  onClick,
  title
}) => {
  const currentComp = competition || (competitionId ? getCompetitionById(competitionId) : getCompetitionById('copa-pacena'));
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      onClick={onClick}
      title={title || currentComp.name}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${SIZE_MAP[size]} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      } ${className}`}
    >
      {currentComp.badgeUrl && !imgError ? (
        <img
          src={
            currentComp.badgeUrl.startsWith('https://upload.wikimedia.org')
              ? `/api/proxy-image?url=${encodeURIComponent(currentComp.badgeUrl)}`
              : currentComp.badgeUrl
          }
          alt={currentComp.name}
          crossOrigin="anonymous"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center drop-shadow-md"
          dangerouslySetInnerHTML={{ __html: currentComp.badgeSvg }}
        />
      )}
    </div>
  );
};
