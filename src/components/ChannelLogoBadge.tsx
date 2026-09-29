import React from 'react';
import { ChannelBranding } from '../data/branding';

interface ChannelLogoBadgeProps {
  branding: ChannelBranding;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-36 h-36'
};

export const ChannelLogoBadge: React.FC<ChannelLogoBadgeProps> = ({
  branding,
  size = 'md',
  className = ''
}) => {
  // If custom logo image URL is provided, display it directly
  if (branding.customLogoUrl) {
    return (
      <div className={`relative shrink-0 rounded-full overflow-hidden p-0.5 border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 ${SIZE_CLASSES[size]} ${className}`}>
        <img
          src={branding.customLogoUrl}
          alt={branding.channelName}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }

  // Authentic vector recreation of the JoseCPP98 Cyber Esports Soccer Crest
  return (
    <div className={`relative shrink-0 select-none ${SIZE_CLASSES[size]} ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="cyber_core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="70%" stopColor="#091b16" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>
          <linearGradient id="neon_edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="neon_glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Cyber Neon Ring */}
        <circle cx="100" cy="100" r="94" stroke="url(#neon_edge)" strokeWidth="5" fill="none" filter="url(#neon_glow)"/>
        
        {/* Dark Tech Base Circle */}
        <circle cx="100" cy="100" r="88" fill="url(#cyber_core)" stroke="#1e293b" strokeWidth="3"/>

        {/* Inner Tech Ring & Circuit lines */}
        <circle cx="100" cy="100" r="76" stroke="#22c55e" strokeWidth="2" strokeDasharray="16 6" fill="none" opacity="0.8"/>
        <circle cx="100" cy="100" r="62" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 8" fill="none" opacity="0.6"/>

        {/* Circuit Nodes */}
        <circle cx="28" cy="100" r="4" fill="#4ade80" />
        <circle cx="172" cy="100" r="4" fill="#4ade80" />
        <circle cx="100" cy="28" r="4" fill="#4ade80" />
        <circle cx="100" cy="172" r="4" fill="#4ade80" />

        {/* Soccer Player Silhouette Striking Ball */}
        <g transform="translate(10, 8)">
          {/* Energy Swoosh */}
          <path d="M50 115 C 65 130, 110 135, 140 105" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" filter="url(#neon_glow)" opacity="0.9"/>
          
          {/* Striker Body */}
          <path d="M85 58 C 82 58, 80 54, 83 50 C 86 46, 92 46, 93 51 C 94 56, 89 58, 85 58 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5"/>
          <path d="M78 62 L 95 62 L 98 84 L 84 86 L 76 74 Z" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5"/>
          {/* Left Arm Back */}
          <path d="M78 64 L 60 76 L 64 82 L 80 70 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1"/>
          {/* Right Arm Forward */}
          <path d="M95 64 L 110 74 L 108 78 L 94 70 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1"/>
          {/* Shorts */}
          <path d="M83 85 L 98 84 L 102 96 L 78 96 Z" fill="#0f172a" stroke="#22c55e" strokeWidth="1.5"/>
          {/* Kicking Leg */}
          <path d="M98 94 L 122 108 L 126 114 L 118 116 L 94 100 Z" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5"/>
          {/* Left Back Leg */}
          <path d="M80 96 L 68 110 L 72 116 L 84 102 Z" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5"/>

          {/* Glowing Energy Soccer Ball */}
          <g transform="translate(132, 92)">
            <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#22c55e" strokeWidth="2.5" filter="url(#neon_glow)"/>
            {/* Ball pentagons */}
            <polygon points="0,-4 4,-1 2,4 -2,4 -4,-1" fill="#09090b" />
            <line x1="0" y1="-4" x2="0" y2="-10" stroke="#09090b" strokeWidth="1.5"/>
            <line x1="4" y1="-1" x2="9" y2="-4" stroke="#09090b" strokeWidth="1.5"/>
            <line x1="2" y1="4" x2="7" y2="8" stroke="#09090b" strokeWidth="1.5"/>
            <line x1="-2" y1="4" x2="-7" y2="8" stroke="#09090b" strokeWidth="1.5"/>
            <line x1="-4" y1="-1" x2="-9" y2="-4" stroke="#09090b" strokeWidth="1.5"/>
            {/* Blazing Trail */}
            <path d="M-8 6 C -18 10, -26 0, -32 -6" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
            <path d="M-6 10 C -14 16, -22 12, -28 6" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          </g>
        </g>

        {/* Top Arc Channel Name Badge */}
        <g>
          <rect x="36" y="24" width="128" height="26" rx="6" fill="#090d16" stroke="#22c55e" strokeWidth="2" filter="url(#neon_glow)"/>
          <text x="100" y="42" textAnchor="middle" fill="#4ade80" fontFamily="sans-serif" fontWeight="900" fontSize="14" letterSpacing="1.5" className="font-orbitron">
            {branding.channelName || 'JOSECPP98'}
          </text>
        </g>

        {/* Bottom Banner Plaque: PES 2021 & GAMING */}
        <g transform="translate(0, 142)">
          <path d="M 40 0 L 160 0 L 152 18 L 48 18 Z" fill="#ffffff" stroke="#22c55e" strokeWidth="1.5"/>
          <text x="100" y="13" textAnchor="middle" fill="#090d16" fontFamily="sans-serif" fontWeight="900" fontSize="8.5" letterSpacing="1" className="font-montserrat">
            {branding.tagline || 'PES 2021 & GAMING'}
          </text>
        </g>

        {/* Sub-handle: KICK.COM/JOSECPP98 */}
        <text x="100" y="174" textAnchor="middle" fill="#4ade80" fontFamily="sans-serif" fontWeight="800" fontSize="7" letterSpacing="0.8">
          {branding.kickHandle || 'KICK.COM/JOSECPP98'}
        </text>
      </svg>
    </div>
  );
};
