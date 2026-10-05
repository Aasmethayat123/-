import { SavedMoment } from '../types';

const MOMENTS_STORAGE_KEY = 'nesma_hayat_saved_moments_v1';

export function getSavedMoments(): SavedMoment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MOMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMoment(moment: Omit<SavedMoment, 'id' | 'date'>): SavedMoment {
  const all = getSavedMoments();
  const newMoment: SavedMoment = {
    ...moment,
    id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  };
  const updated = [newMoment, ...all];
  try {
    localStorage.setItem(MOMENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return newMoment;
}

export function deleteMoment(id: string): void {
  const all = getSavedMoments();
  const updated = all.filter(m => m.id !== id);
  try {
    localStorage.setItem(MOMENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
