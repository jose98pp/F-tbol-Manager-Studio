export interface MediaAsset {
  id: string;
  name: string;
  category: 'stadium' | 'shield' | 'player' | 'user-upload';
  url: string;
  clubOrRegion?: string;
  tag?: string;
  isCustom?: boolean;
}

export const OFFICIAL_STADIUM_MEDIA: MediaAsset[] = [
  {
    id: 'stad-siles',
    name: 'Estadio Hernando Siles',
    category: 'stadium',
    clubOrRegion: 'La Paz (3,640m)',
    tag: 'Sede Selección Boliviana / Bolívar / The Strongest',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'stad-tahuichi',
    name: 'Estadio Ramón Tahuichi Aguilera',
    category: 'stadium',
    clubOrRegion: 'Santa Cruz de la Sierra',
    tag: 'Oriente Petrolero / Blooming / Guabirá',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'stad-capriles',
    name: 'Estadio Félix Capriles',
    category: 'stadium',
    clubOrRegion: 'Cochabamba',
    tag: 'Wilstermann / Aurora',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'stad-villa-ingenio',
    name: 'Estadio Municipal de El Alto (Villa Ingenio)',
    category: 'stadium',
    clubOrRegion: 'El Alto (4,083m)',
    tag: 'Always Ready / La Casa del Alto',
    url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'stad-bermudez',
    name: 'Estadio Jesús Bermúdez',
    category: 'stadium',
    clubOrRegion: 'Oruro (3,735m)',
    tag: 'San José / GV San José',
    url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'stad-night-lights',
    name: 'Noche de Copa / Estadio Iluminado',
    category: 'stadium',
    clubOrRegion: 'Luces y Niebla',
    tag: 'Fondo de Alto Impacto para Previa',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'
  }
];

export const PLAYER_SILHOUETTES: MediaAsset[] = [
  {
    id: 'player-celebration',
    name: 'Celebración de Gol con Brazos Abiertos',
    category: 'player',
    tag: 'Goleador / Festejo',
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'player-kick',
    name: 'Remate Potente al Arco',
    category: 'player',
    tag: 'Acción de Juego',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'player-goalkeeper',
    name: 'Arquero en Estirada Espectacular',
    category: 'player',
    tag: 'Atajada Clave',
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80'
  }
];

const LOCAL_STORAGE_USER_MEDIA_KEY = 'futbol_banner_user_media_assets_v1';

export function getUserUploadedMedia(): MediaAsset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_MEDIA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading user media:', e);
    return [];
  }
}

export function saveUserMedia(asset: { name: string; url: string; tag?: string }): MediaAsset {
  const current = getUserUploadedMedia();
  const newAsset: MediaAsset = {
    id: `user-media-${Date.now()}`,
    name: asset.name,
    category: 'user-upload',
    url: asset.url,
    tag: asset.tag || 'Subido por el usuario',
    isCustom: true
  };
  const updated = [newAsset, ...current];
  try {
    localStorage.setItem(LOCAL_STORAGE_USER_MEDIA_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving user media:', e);
  }
  return newAsset;
}

export function deleteUserMedia(id: string): void {
  const current = getUserUploadedMedia();
  const updated = current.filter(m => m.id !== id);
  try {
    localStorage.setItem(LOCAL_STORAGE_USER_MEDIA_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting user media:', e);
  }
}
