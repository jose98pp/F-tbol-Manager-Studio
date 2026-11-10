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

const LOCAL_STORAGE_PUBLICATIONS_KEY = 'futbol_banner_publication_history_v2';

export const INITIAL_PUBLICATION_RECORDS: SocialPostRecord[] = [];

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
