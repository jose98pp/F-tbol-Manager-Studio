export interface ChannelBranding {
  channelName: string;
  tagline: string;
  youtubeHandle: string;
  kickHandle: string;
  tiktokHandle: string;
  facebookHandle: string;
  showYoutube: boolean;
  showKick: boolean;
  showTiktok: boolean;
  showFacebook: boolean;
  theme: 'neon-gaming' | 'tv-broadcast' | 'fire-red' | 'electric-blue';
  logoType: 'default-cyber' | 'custom-upload';
  customLogoUrl: string;
  sponsorText: string;
  sponsorLogoUrl?: string;
}

export const DEFAULT_BRANDING: ChannelBranding = {
  channelName: 'JOSECPP98',
  tagline: 'PES 2021 & GAMING',
  youtubeHandle: 'JOSECPP98',
  kickHandle: 'KICK.COM/JOSECPP98',
  tiktokHandle: '@JOSECPP98',
  facebookHandle: 'JOSECPP98',
  showYoutube: true,
  showKick: true,
  showTiktok: true,
  showFacebook: false,
  theme: 'neon-gaming',
  logoType: 'default-cyber',
  customLogoUrl: '',
  sponsorText: '¡TRANSMISIÓN EN VIVO Y EN ALTA DEFINICIÓN!'
};

export interface BannerFormat {
  id: 'tiktok-story' | 'facebook-square' | 'facebook-feed' | 'horizontal-16-9';
  name: string;
  platform: 'TikTok' | 'Facebook' | 'Multi';
  aspectRatio: string;
  width: number;
  height: number;
  description: string;
}

export const BANNER_FORMATS: BannerFormat[] = [
  {
    id: 'tiktok-story',
    name: 'TikTok / Story / Reels',
    platform: 'TikTok',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    description: 'Formato vertical de alto impacto para TikTok y Facebook Stories'
  },
  {
    id: 'facebook-square',
    name: 'Facebook / Instagram Cuadrado',
    platform: 'Facebook',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    description: 'El formato estándar perfecto para posts en feeds de Facebook'
  },
  {
    id: 'facebook-feed',
    name: 'Facebook Feed Vertical',
    platform: 'Facebook',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    description: 'Máxima visibilidad en el scroll de Facebook e Instagram'
  },
  {
    id: 'horizontal-16-9',
    name: 'Banner Horizontal HD / YouTube',
    platform: 'Multi',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    description: 'Miniaturas de video, portada de Facebook y stream overlays'
  }
];
