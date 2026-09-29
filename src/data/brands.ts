import { ChannelBranding, DEFAULT_BRANDING } from './branding';

export interface BrandProfile {
  id: string;
  name: string;
  channelHandle: string;
  tagline: string;
  theme: 'neon-gaming' | 'tv-broadcast' | 'fire-red' | 'electric-blue';
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  connectedAccounts: {
    facebook: boolean;
    facebookPageName?: string;
    tiktok: boolean;
    tiktokHandle?: string;
    instagram: boolean;
    instagramHandle?: string;
    youtube: boolean;
    youtubeChannel?: string;
    twitter: boolean;
    twitterHandle?: string;
  };
}

export const DEFAULT_BRAND_PROFILES: BrandProfile[] = [
  {
    id: 'brand-josecpp98',
    name: 'JoseCPP98 Deportes',
    channelHandle: '@JoseCPP98',
    tagline: 'Fútbol Boliviano & Internacional En Vivo',
    theme: 'neon-gaming',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    connectedAccounts: {
      facebook: true,
      facebookPageName: 'JoseCPP98 Deportes Oficial',
      tiktok: true,
      tiktokHandle: '@josecpp98_deportes',
      instagram: true,
      instagramHandle: '@josecpp98_sports',
      youtube: true,
      youtubeChannel: 'JoseCPP98 Transmisiones',
      twitter: true,
      twitterHandle: '@JoseCPP98_bo'
    }
  },
  {
    id: 'brand-futbol-bolivia-hd',
    name: 'Fútbol Boliviano HD',
    channelHandle: '@FutbolBoliviaHD',
    tagline: 'La Pasión de Nuestra División Profesional',
    theme: 'tv-broadcast',
    primaryColor: '#dc2626',
    secondaryColor: '#eab308',
    connectedAccounts: {
      facebook: true,
      facebookPageName: 'Fútbol Boliviano HD - Transmisiones',
      tiktok: true,
      tiktokHandle: '@futbolbolivianohd',
      instagram: true,
      instagramHandle: '@futbolboliviahd',
      youtube: false,
      twitter: true,
      twitterHandle: '@FutbolBoliviaHD'
    }
  },
  {
    id: 'brand-radio-exito',
    name: 'Radio Éxito Deportes',
    channelHandle: '@RadioExitoDeportes',
    tagline: 'El Relato Emocionante de Cada Fin de Semana',
    theme: 'electric-blue',
    primaryColor: '#2563eb',
    secondaryColor: '#ffffff',
    connectedAccounts: {
      facebook: true,
      facebookPageName: 'Radio Éxito 93.1 FM Deportes',
      tiktok: false,
      instagram: true,
      instagramHandle: '@radioexitodeportes',
      youtube: true,
      youtubeChannel: 'Radio Éxito En Vivo',
      twitter: true,
      twitterHandle: '@RadioExitoDep'
    }
  }
];

export function brandProfileToChannelBranding(b: BrandProfile): ChannelBranding {
  return {
    channelName: b.name,
    tagline: b.tagline,
    youtubeHandle: b.connectedAccounts.youtubeChannel || b.channelHandle,
    kickHandle: b.channelHandle,
    tiktokHandle: b.connectedAccounts.tiktokHandle || b.channelHandle,
    facebookHandle: b.connectedAccounts.facebookPageName || b.channelHandle,
    showYoutube: b.connectedAccounts.youtube,
    showKick: true,
    showTiktok: b.connectedAccounts.tiktok,
    showFacebook: b.connectedAccounts.facebook,
    theme: b.theme,
    logoType: b.logoUrl ? 'custom-upload' : 'default-cyber',
    customLogoUrl: b.logoUrl || '',
    sponsorText: '¡TRANSMISIÓN EN VIVO Y EN ALTA DEFINICIÓN!'
  };
}
