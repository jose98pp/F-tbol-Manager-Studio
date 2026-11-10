import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  subscribeToUserSavedTemplates,
  saveTemplateToFirestore,
  deleteTemplateFromFirestore,
  subscribeToUserBrands,
  saveBrandToFirestore,
  deleteBrandFromFirestore,
  subscribeToUserPublications,
  savePublicationToFirestore,
  deletePublicationFromFirestore,
  subscribeToUserMedia,
  saveMediaToFirestore,
  deleteMediaFromFirestore,
  saveWorkspaceToFirestore,
  loadWorkspaceFromFirestore,
  subscribeToUserCustomClubs,
  saveCustomClubToFirestore,
  deleteCustomClubFromFirestore
} from '../lib/firestoreService';
import { SavedTemplatePreset, getCustomPresets } from '../data/savedTemplates';
import { BrandProfile, DEFAULT_BRAND_PROFILES } from '../data/brands';
import { SocialPostRecord, getPublicationHistory } from '../data/publicationHistory';
import { MediaAsset, getUserUploadedMedia } from '../data/mediaLibrary';
import { WorkspaceSnapshot } from '../data/workspace';
import { Club } from '../data/clubs';

interface FirebaseContextType {
  user: User | null;
  authLoading: boolean;
  isCloudConnected: boolean;
  firestoreDatabaseId: string;
  projectId: string;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: Date | null;
  // Cloud collections
  savedTemplates: SavedTemplatePreset[];
  brandProfiles: BrandProfile[];
  publicationHistory: SocialPostRecord[];
  userMedia: MediaAsset[];
  customClubs: Club[];
  // Cloud actions
  addSavedTemplate: (preset: Omit<SavedTemplatePreset, 'id' | 'isCustom' | 'createdAt'>) => Promise<SavedTemplatePreset>;
  removeSavedTemplate: (id: string) => Promise<void>;
  addBrandProfile: (brand: BrandProfile) => Promise<void>;
  removeBrandProfile: (id: string) => Promise<void>;
  addPublicationRecord: (record: Omit<SocialPostRecord, 'id'>) => Promise<SocialPostRecord>;
  removePublicationRecord: (id: string) => Promise<void>;
  addUserMediaAsset: (asset: Omit<MediaAsset, 'id' | 'isCustom'>) => Promise<MediaAsset>;
  removeUserMediaAsset: (id: string) => Promise<void>;
  saveWorkspaceSnapshot: (snapshot: WorkspaceSnapshot) => Promise<void>;
  loadWorkspaceSnapshot: () => Promise<WorkspaceSnapshot | null>;
  addCustomClub: (club: Club) => Promise<Club>;
  removeCustomClub: (id: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // States with local fallbacks
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplatePreset[]>(() => getCustomPresets());
  const [brandProfiles, setBrandProfiles] = useState<BrandProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('futbol_banner_brand_profiles_v1');
        return raw ? JSON.parse(raw) : DEFAULT_BRAND_PROFILES;
      } catch {
        return DEFAULT_BRAND_PROFILES;
      }
    }
    return DEFAULT_BRAND_PROFILES;
  });
  const [publicationHistory, setPublicationHistory] = useState<SocialPostRecord[]>(() => getPublicationHistory());
  const [userMedia, setUserMedia] = useState<MediaAsset[]>(() => getUserUploadedMedia());
  const [customClubs, setCustomClubs] = useState<Club[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('futbol_banner_custom_clubs_v1');
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Listen to Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        setCloudSyncStatus('syncing');
        // Initial migration of local storage to Firestore if user has existing local items
        try {
          const localPresets = getCustomPresets();
          for (const p of localPresets) {
            await saveTemplateToFirestore(currentUser.uid, p);
          }
          const localBrands = brandProfiles.filter(b => !DEFAULT_BRAND_PROFILES.some(d => d.id === b.id));
          for (const b of localBrands) {
            await saveBrandToFirestore(currentUser.uid, b);
          }
          const localPosts = getPublicationHistory();
          for (const post of localPosts) {
            await savePublicationToFirestore(currentUser.uid, post);
          }
          const localMedia = getUserUploadedMedia();
          for (const m of localMedia) {
            await saveMediaToFirestore(currentUser.uid, m);
          }
          for (const club of customClubs) {
            await saveCustomClubToFirestore(currentUser.uid, club);
          }
          setCloudSyncStatus('synced');
          setLastSyncedAt(new Date());
        } catch (err) {
          console.warn('Initial Firestore sync warning:', err);
          setCloudSyncStatus('error');
        }
      } else {
        setCloudSyncStatus('idle');
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore changes when user is authenticated
  useEffect(() => {
    if (!user) return;

    setCloudSyncStatus('syncing');

    // 1. Templates listener
    const unsubTemplates = subscribeToUserSavedTemplates(user.uid, (cloudList) => {
      setSavedTemplates(cloudList);
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
    });

    // 2. Brands listener
    const unsubBrands = subscribeToUserBrands(user.uid, (cloudList) => {
      // Merge with default brands so user always has standard options
      const customIds = new Set(cloudList.map(b => b.id));
      const combined = [...cloudList, ...DEFAULT_BRAND_PROFILES.filter(d => !customIds.has(d.id))];
      setBrandProfiles(combined);
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
    });

    // 3. Publications listener
    const unsubPublications = subscribeToUserPublications(user.uid, (cloudList) => {
      setPublicationHistory(cloudList);
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
    });

    // 4. Media listener
    const unsubMedia = subscribeToUserMedia(user.uid, (cloudList) => {
      setUserMedia(cloudList);
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
    });

    // 5. Custom Clubs & Shields listener
    const unsubClubs = subscribeToUserCustomClubs(user.uid, (cloudList) => {
      setCustomClubs(cloudList);
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date());
    });

    return () => {
      unsubTemplates();
      unsubBrands();
      unsubPublications();
      unsubMedia();
      unsubClubs();
    };
  }, [user]);

  // Actions
  const addSavedTemplate = useCallback(
    async (preset: Omit<SavedTemplatePreset, 'id' | 'isCustom' | 'createdAt'>): Promise<SavedTemplatePreset> => {
      const newPreset: SavedTemplatePreset = {
        ...preset,
        id: `tpl-${Date.now()}`,
        isCustom: true,
        createdAt: new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      if (user) {
        setCloudSyncStatus('syncing');
        await saveTemplateToFirestore(user.uid, newPreset);
        setCloudSyncStatus('synced');
      } else {
        // Fallback to local storage
        const current = getCustomPresets();
        const updated = [newPreset, ...current];
        localStorage.setItem('futbol_banner_custom_presets_v1', JSON.stringify(updated));
        setSavedTemplates(updated);
      }
      return newPreset;
    },
    [user]
  );

  const removeSavedTemplate = useCallback(
    async (id: string): Promise<void> => {
      if (user) {
        setCloudSyncStatus('syncing');
        await deleteTemplateFromFirestore(user.uid, id);
        setCloudSyncStatus('synced');
      } else {
        const current = getCustomPresets();
        const updated = current.filter(p => p.id !== id);
        localStorage.setItem('futbol_banner_custom_presets_v1', JSON.stringify(updated));
        setSavedTemplates(updated);
      }
    },
    [user]
  );

  const addBrandProfile = useCallback(
    async (brand: BrandProfile): Promise<void> => {
      if (user) {
        setCloudSyncStatus('syncing');
        await saveBrandToFirestore(user.uid, brand);
        setCloudSyncStatus('synced');
      } else {
        const current = brandProfiles;
        const updated = [brand, ...current.filter(b => b.id !== brand.id)];
        localStorage.setItem('futbol_banner_brand_profiles_v1', JSON.stringify(updated));
        setBrandProfiles(updated);
      }
    },
    [user, brandProfiles]
  );

  const removeBrandProfile = useCallback(
    async (id: string): Promise<void> => {
      if (user) {
        setCloudSyncStatus('syncing');
        await deleteBrandFromFirestore(user.uid, id);
        setCloudSyncStatus('synced');
      } else {
        const updated = brandProfiles.filter(b => b.id !== id);
        localStorage.setItem('futbol_banner_brand_profiles_v1', JSON.stringify(updated));
        setBrandProfiles(updated);
      }
    },
    [user, brandProfiles]
  );

  const addPublicationRecord = useCallback(
    async (record: Omit<SocialPostRecord, 'id'>): Promise<SocialPostRecord> => {
      const newRecord: SocialPostRecord = {
        ...record,
        id: `pub-${Date.now()}`
      };

      if (user) {
        setCloudSyncStatus('syncing');
        await savePublicationToFirestore(user.uid, newRecord);
        setCloudSyncStatus('synced');
      } else {
        const current = getPublicationHistory();
        const updated = [newRecord, ...current];
        localStorage.setItem('futbol_banner_publication_history_v2', JSON.stringify(updated));
        setPublicationHistory(updated);
      }
      return newRecord;
    },
    [user]
  );

  const removePublicationRecord = useCallback(
    async (id: string): Promise<void> => {
      if (user) {
        setCloudSyncStatus('syncing');
        await deletePublicationFromFirestore(user.uid, id);
        setCloudSyncStatus('synced');
      } else {
        const current = getPublicationHistory();
        const updated = current.filter(p => p.id !== id);
        localStorage.setItem('futbol_banner_publication_history_v2', JSON.stringify(updated));
        setPublicationHistory(updated);
      }
    },
    [user]
  );

  const addUserMediaAsset = useCallback(
    async (asset: Omit<MediaAsset, 'id' | 'isCustom'>): Promise<MediaAsset> => {
      const newAsset: MediaAsset = {
        ...asset,
        id: `media-${Date.now()}`,
        isCustom: true
      };

      if (user) {
        setCloudSyncStatus('syncing');
        await saveMediaToFirestore(user.uid, newAsset);
        setCloudSyncStatus('synced');
      } else {
        const current = getUserUploadedMedia();
        const updated = [newAsset, ...current];
        localStorage.setItem('futbol_banner_user_media_v1', JSON.stringify(updated));
        setUserMedia(updated);
      }
      return newAsset;
    },
    [user]
  );

  const removeUserMediaAsset = useCallback(
    async (id: string): Promise<void> => {
      if (user) {
        setCloudSyncStatus('syncing');
        await deleteMediaFromFirestore(user.uid, id);
        setCloudSyncStatus('synced');
      } else {
        const current = getUserUploadedMedia();
        const updated = current.filter(m => m.id !== id);
        localStorage.setItem('futbol_banner_user_media_v1', JSON.stringify(updated));
        setUserMedia(updated);
      }
    },
    [user]
  );

  const saveWorkspaceSnapshot = useCallback(
    async (snapshot: WorkspaceSnapshot): Promise<void> => {
      if (!user) return;
      await saveWorkspaceToFirestore(user.uid, snapshot);
    },
    [user]
  );

  const loadWorkspaceSnapshot = useCallback(async (): Promise<WorkspaceSnapshot | null> => {
    if (!user) return null;
    return await loadWorkspaceFromFirestore(user.uid);
  }, [user]);

  const addCustomClub = useCallback(
    async (club: Club): Promise<Club> => {
      const clubToSave: Club = {
        ...club,
        isCustom: true
      };
      if (user) {
        setCloudSyncStatus('syncing');
        await saveCustomClubToFirestore(user.uid, clubToSave);
        setCloudSyncStatus('synced');
      } else {
        const current = customClubs;
        const updated = [clubToSave, ...current.filter(c => c.id !== clubToSave.id)];
        localStorage.setItem('futbol_banner_custom_clubs_v1', JSON.stringify(updated));
        setCustomClubs(updated);
      }
      return clubToSave;
    },
    [user, customClubs]
  );

  const removeCustomClub = useCallback(
    async (id: string): Promise<void> => {
      if (user) {
        setCloudSyncStatus('syncing');
        await deleteCustomClubFromFirestore(user.uid, id);
        setCloudSyncStatus('synced');
      } else {
        const updated = customClubs.filter(c => c.id !== id);
        localStorage.setItem('futbol_banner_custom_clubs_v1', JSON.stringify(updated));
        setCustomClubs(updated);
      }
    },
    [user, customClubs]
  );

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authLoading,
        isCloudConnected: !!user,
        firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || '',
        projectId: firebaseConfig.projectId || '',
        cloudSyncStatus,
        lastSyncedAt,
        savedTemplates,
        brandProfiles,
        publicationHistory,
        userMedia,
        customClubs,
        addSavedTemplate,
        removeSavedTemplate,
        addBrandProfile,
        removeBrandProfile,
        addPublicationRecord,
        removePublicationRecord,
        addUserMediaAsset,
        removeUserMediaAsset,
        saveWorkspaceSnapshot,
        loadWorkspaceSnapshot,
        addCustomClub,
        removeCustomClub
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
