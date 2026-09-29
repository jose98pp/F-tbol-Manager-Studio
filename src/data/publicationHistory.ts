export interface SocialPostRecord {
  id: string;
  title: string;
  templateType: string;
  channelName: string;
  networks: ('facebook' | 'tiktok' | 'instagram' | 'youtube' | 'twitter')[];
  caption: string;
  status: 'published' | 'scheduled' | 'failed';
  scheduledTimeBolivia?: string; // e.g. "2026-10-04 17:30 BOT"
  publishedAt?: string;
  errorMessage?: string;
  postUrls: {
    network: 'facebook' | 'tiktok' | 'instagram' | 'youtube' | 'twitter';
    url?: string;
    status: 'success' | 'failed';
  }[];
  bannerThumbnail?: string;
}

const LOCAL_STORAGE_PUBLICATIONS_KEY = 'futbol_banner_publication_history_v1';

export const INITIAL_PUBLICATION_RECORDS: SocialPostRecord[] = [
  {
    id: 'post-101',
    title: 'Previa Fecha 6: Bolívar vs The Strongest',
    templateType: 'versus',
    channelName: 'JoseCPP98 Deportes',
    networks: ['facebook', 'tiktok', 'youtube'],
    caption: '🔥 ¡CLÁSICO PACEÑO IMPERDIBLE! Bolívar vs The Strongest por la punta del torneo. ¿Quién se queda con la gloria? Transmisión completa por JoseCPP98 Deportes.',
    status: 'published',
    publishedAt: '2026-09-29 14:00 BOT',
    postUrls: [
      { network: 'facebook', url: 'https://www.facebook.com/JoseCPP98/posts/8920192841', status: 'success' },
      { network: 'tiktok', url: 'https://www.tiktok.com/@josecpp98_deportes/video/739182940182', status: 'success' },
      { network: 'youtube', url: 'https://www.youtube.com/post/Ugkx92182018a', status: 'success' }
    ]
  },
  {
    id: 'post-102',
    title: 'Alineación Confirmada: Bolívar',
    templateType: 'lineup',
    channelName: 'JoseCPP98 Deportes',
    networks: ['tiktok', 'instagram'],
    caption: '📋 ¡LOS 11 CONFIRMADOS! Así salta a la cancha la academia para el clásico de hoy.',
    status: 'scheduled',
    scheduledTimeBolivia: '2026-10-04 16:30 BOT',
    postUrls: []
  },
  {
    id: 'post-103',
    title: '¡GOLAZO! 1-0 Ramiro Vaca',
    templateType: 'goal',
    channelName: 'JoseCPP98 Deportes',
    networks: ['twitter', 'facebook'],
    caption: '⚽🔥 ¡GOOOOLAZO DE BOLÍVAR! Ramiro Vaca clava un derechazo al ángulo al minuto 38.',
    status: 'failed',
    errorMessage: 'Tiempo de espera agotado al conectar con API de X / Twitter (Token expirado)',
    publishedAt: '2026-09-28 18:22 BOT',
    postUrls: [
      { network: 'facebook', url: 'https://www.facebook.com/JoseCPP98/posts/8920192899', status: 'success' },
      { network: 'twitter', status: 'failed' }
    ]
  }
];

export function getPublicationHistory(): SocialPostRecord[] {
  if (typeof window === 'undefined') return INITIAL_PUBLICATION_RECORDS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PUBLICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PUBLICATIONS_KEY, JSON.stringify(INITIAL_PUBLICATION_RECORDS));
      return INITIAL_PUBLICATION_RECORDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading publications history:', e);
    return INITIAL_PUBLICATION_RECORDS;
  }
}

export function savePublicationRecord(record: Omit<SocialPostRecord, 'id'>): SocialPostRecord {
  const current = getPublicationHistory();
  const newRecord: SocialPostRecord = {
    ...record,
    id: `post-${Date.now()}`
  };
  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(LOCAL_STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving publication record:', e);
  }
  return newRecord;
}

export function updatePublicationRecord(id: string, updates: Partial<SocialPostRecord>): SocialPostRecord[] {
  const current = getPublicationHistory();
  const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
  try {
    localStorage.setItem(LOCAL_STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating publication record:', e);
  }
  return updated;
}

export function deletePublicationRecord(id: string): SocialPostRecord[] {
  const current = getPublicationHistory();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(LOCAL_STORAGE_PUBLICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting publication record:', e);
  }
  return updated;
}
