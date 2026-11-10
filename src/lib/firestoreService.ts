import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { SavedTemplatePreset } from '../data/savedTemplates';
import { BrandProfile } from '../data/brands';
import { SocialPostRecord } from '../data/publicationHistory';
import { MediaAsset } from '../data/mediaLibrary';
import { TemplateData } from '../data/templates';
import { Club } from '../data/clubs';

// ==========================================
// 1. SAVED TEMPLATES PERSISTENCE
// ==========================================

export function subscribeToUserSavedTemplates(
  userId: string,
  onUpdate: (templates: SavedTemplatePreset[]) => void
): Unsubscribe {
  const colPath = `users/${userId}/savedTemplates`;
  const colRef = collection(db, 'users', userId, 'savedTemplates');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: SavedTemplatePreset[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as SavedTemplatePreset);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  );
}

export async function saveTemplateToFirestore(
  userId: string,
  template: SavedTemplatePreset
): Promise<void> {
  const docPath = `users/${userId}/savedTemplates/${template.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedTemplates', template.id);
    await setDoc(docRef, {
      ...template,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteTemplateFromFirestore(
  userId: string,
  templateId: string
): Promise<void> {
  const docPath = `users/${userId}/savedTemplates/${templateId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedTemplates', templateId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ==========================================
// 2. BRAND PROFILES PERSISTENCE
// ==========================================

export function subscribeToUserBrands(
  userId: string,
  onUpdate: (brands: BrandProfile[]) => void
): Unsubscribe {
  const colPath = `users/${userId}/brandProfiles`;
  const colRef = collection(db, 'users', userId, 'brandProfiles');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: BrandProfile[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as BrandProfile);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  );
}

export async function saveBrandToFirestore(
  userId: string,
  brand: BrandProfile
): Promise<void> {
  const docPath = `users/${userId}/brandProfiles/${brand.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'brandProfiles', brand.id);
    await setDoc(docRef, {
      ...brand,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteBrandFromFirestore(
  userId: string,
  brandId: string
): Promise<void> {
  const docPath = `users/${userId}/brandProfiles/${brandId}`;
  try {
    const docRef = doc(db, 'users', userId, 'brandProfiles', brandId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ==========================================
// 3. PUBLICATION HISTORY PERSISTENCE
// ==========================================

export function subscribeToUserPublications(
  userId: string,
  onUpdate: (posts: SocialPostRecord[]) => void
): Unsubscribe {
  const colPath = `users/${userId}/publications`;
  const colRef = collection(db, 'users', userId, 'publications');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: SocialPostRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as SocialPostRecord);
      });
      // Sort newest first
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  );
}

export async function savePublicationToFirestore(
  userId: string,
  record: SocialPostRecord
): Promise<void> {
  const docPath = `users/${userId}/publications/${record.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'publications', record.id);
    await setDoc(docRef, {
      ...record,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deletePublicationFromFirestore(
  userId: string,
  publicationId: string
): Promise<void> {
  const docPath = `users/${userId}/publications/${publicationId}`;
  try {
    const docRef = doc(db, 'users', userId, 'publications', publicationId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ==========================================
// 4. USER MEDIA ASSETS PERSISTENCE
// ==========================================

export function subscribeToUserMedia(
  userId: string,
  onUpdate: (assets: MediaAsset[]) => void
): Unsubscribe {
  const colPath = `users/${userId}/media`;
  const colRef = collection(db, 'users', userId, 'media');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: MediaAsset[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as MediaAsset);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  );
}

export async function saveMediaToFirestore(
  userId: string,
  asset: MediaAsset
): Promise<void> {
  const docPath = `users/${userId}/media/${asset.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'media', asset.id);
    await setDoc(docRef, {
      ...asset,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteMediaFromFirestore(
  userId: string,
  mediaId: string
): Promise<void> {
  const docPath = `users/${userId}/media/${mediaId}`;
  try {
    const docRef = doc(db, 'users', userId, 'media', mediaId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ==========================================
// 5. ACTIVE WORKSPACE PERSISTENCE
// ==========================================

export async function saveWorkspaceToFirestore(
  userId: string,
  templateData: TemplateData
): Promise<void> {
  const docPath = `users/${userId}/workspace/current`;
  try {
    const docRef = doc(db, 'users', userId, 'workspace', 'current');
    await setDoc(docRef, {
      userId,
      templateData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function loadWorkspaceFromFirestore(
  userId: string
): Promise<TemplateData | null> {
  const docPath = `users/${userId}/workspace/current`;
  try {
    const docRef = doc(db, 'users', userId, 'workspace', 'current');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.templateData as TemplateData) || null;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

// ==========================================
// 6. CUSTOM CLUBS & SHIELDS PERSISTENCE
// ==========================================

export function subscribeToUserCustomClubs(
  userId: string,
  onUpdate: (clubs: Club[]) => void
): Unsubscribe {
  const colPath = `users/${userId}/customClubs`;
  const colRef = collection(db, 'users', userId, 'customClubs');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Club[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Club);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  );
}

export async function saveCustomClubToFirestore(
  userId: string,
  club: Club
): Promise<void> {
  const docPath = `users/${userId}/customClubs/${club.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'customClubs', club.id);
    await setDoc(docRef, {
      ...club,
      userId,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteCustomClubFromFirestore(
  userId: string,
  clubId: string
): Promise<void> {
  const docPath = `users/${userId}/customClubs/${clubId}`;
  try {
    const docRef = doc(db, 'users', userId, 'customClubs', clubId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
