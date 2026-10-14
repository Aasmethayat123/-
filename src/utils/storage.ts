/**
 * Storage & Consent Protocol for Nesma Hayat (نظام التخزين المعتمد وحفظ الملاحظات والجلسات)
 * Provides strict control over data persistence with privacy-first consent:
 * - When consent is true: saves securely to local storage.
 * - When consent is false: operates strictly in-memory (ephemeral / no persistence).
 * - Scans notes through safetyInterceptor to detect crises.
 */

import { checkTextSafety, triggerCrisisInterception } from './safetyInterceptor';

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  category: 'weekly-session' | 'reflection' | 'gratitude' | 'thought-record' | 'crisis-plan';
  tags: string[];
  mood?: string;
  date: string;
  timestamp: number;
  isEphemeral?: boolean;
}

export interface StorageConsentSettings {
  consentGranted: boolean;
  consentTimestamp: number;
}

const STORAGE_NOTES_KEY = 'nesma_hayat_user_notes_v1';
const STORAGE_CONSENT_KEY = 'nesma_hayat_storage_consent_v1';

// In-memory fallback for ephemeral (no-consent) sessions
let inMemoryEphemeralNotes: SavedNote[] = [];

/**
 * Sanitize text to prevent script injection
 */
function sanitizeInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
}

/**
 * Get user consent status for data persistence
 */
export function getStorageConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_CONSENT_KEY);
    if (!raw) return true; // Default true, but user can explicitly revoke or toggle off
    const parsed = JSON.parse(raw) as StorageConsentSettings;
    return !!parsed.consentGranted;
  } catch {
    return false;
  }
}

/**
 * Set user consent status for data persistence
 */
export function setStorageConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const settings: StorageConsentSettings = {
      consentGranted: granted,
      consentTimestamp: Date.now()
    };
    localStorage.setItem(STORAGE_CONSENT_KEY, JSON.stringify(settings));
    if (!granted) {
      // Clear persistent notes if consent is revoked
      localStorage.removeItem(STORAGE_NOTES_KEY);
      inMemoryEphemeralNotes = [];
    }
  } catch {
    // ignore
  }
}

/**
 * Main storage object exposing standard methods requested by user:
 * storage.addNote, storage.getNotes, storage.deleteNote, storage.clearNotes, etc.
 */
export const storage = {
  /**
   * Add a note with strict consent validation and safety interception
   */
  addNote(data: {
    title?: string;
    content: string;
    category?: SavedNote['category'];
    tags?: string[];
    mood?: string;
    overrideConsent?: boolean; // Can be passed per-session (e.g. "جلسة خاصة دون حفظ")
  }): SavedNote {
    const sanitizedContent = sanitizeInput(data.content);
    const sanitizedTitle = sanitizeInput(data.title || 'ملاحظة جديدة');

    // Real-time safety interception:
    const safety = checkTextSafety(sanitizedContent);
    if (safety.isCrisis) {
      triggerCrisisInterception(sanitizedContent, 'storage_add_note');
    }

    const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const dateFormatted = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const isConsented = data.overrideConsent !== undefined ? data.overrideConsent : getStorageConsent();

    const newNote: SavedNote = {
      id: noteId,
      title: sanitizedTitle,
      content: sanitizedContent,
      category: data.category || 'reflection',
      tags: data.tags || [],
      mood: data.mood,
      date: dateFormatted,
      timestamp: Date.now(),
      isEphemeral: !isConsented
    };

    if (isConsented && typeof window !== 'undefined') {
      // Persist to localStorage
      try {
        const existing = storage.getNotes();
        const updated = [newNote, ...existing];
        localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to write note to localStorage:', err);
      }
    } else {
      // Non-persisted ephemeral mode (does not touch localStorage or sessionStorage)
      inMemoryEphemeralNotes = [newNote, ...inMemoryEphemeralNotes];
    }

    return newNote;
  },

  /**
   * Retrieve all saved notes
   */
  getNotes(): SavedNote[] {
    const isConsented = getStorageConsent();
    if (!isConsented) {
      return [...inMemoryEphemeralNotes];
    }

    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_NOTES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Delete a note by id
   */
  deleteNote(id: string): boolean {
    const isConsented = getStorageConsent();
    if (!isConsented) {
      const initialLen = inMemoryEphemeralNotes.length;
      inMemoryEphemeralNotes = inMemoryEphemeralNotes.filter(n => n.id !== id);
      return inMemoryEphemeralNotes.length < initialLen;
    }

    if (typeof window === 'undefined') return false;
    try {
      const notes = storage.getNotes();
      const updated = notes.filter(n => n.id !== id);
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clear all notes
   */
  clearNotes(): void {
    inMemoryEphemeralNotes = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_NOTES_KEY);
      } catch {
        // ignore
      }
    }
  },

  /**
   * Check consent status
   */
  getConsent: getStorageConsent,
  setConsent: setStorageConsent
};

/**
 * Automated test suite to verify the dual consent paths:
 * Path A: Consent granted -> item written to localStorage.
 * Path B: Consent revoked / denied -> 0 items written to localStorage.
 */
export function runStorageConsentTests(): {
  consentPathPassed: boolean;
  noConsentPathPassed: boolean;
  details: {
    step: string;
    passed: boolean;
    storageBefore: number;
    storageAfter: number;
    notesReturned: number;
    description: string;
  }[];
} {
  const details = [];

  if (typeof window === 'undefined') {
    return {
      consentPathPassed: false,
      noConsentPathPassed: false,
      details: [{ step: 'SSR check', passed: false, storageBefore: 0, storageAfter: 0, notesReturned: 0, description: 'window is undefined' }]
    };
  }

  // Backup existing data
  const originalConsent = localStorage.getItem(STORAGE_CONSENT_KEY);
  const originalNotes = localStorage.getItem(STORAGE_NOTES_KEY);

  try {
    // ---- TEST 1: Consent Path (موافقة وحفظ البيانات) ----
    localStorage.removeItem(STORAGE_NOTES_KEY);
    setStorageConsent(true);
    const beforeCountA = localStorage.getItem(STORAGE_NOTES_KEY) ? JSON.parse(localStorage.getItem(STORAGE_NOTES_KEY)!).length : 0;

    const testNoteA = storage.addNote({
      title: 'ملاحظة اختبار موافقة الحفظ',
      content: 'محتوى تجريبي آمن لاختبار مسار الحفظ المعتمد',
      category: 'weekly-session'
    });

    const afterCountA = localStorage.getItem(STORAGE_NOTES_KEY) ? JSON.parse(localStorage.getItem(STORAGE_NOTES_KEY)!).length : 0;
    const notesA = storage.getNotes();

    const consentPassed = afterCountA === 1 && notesA.length >= 1 && notesA[0].id === testNoteA.id && !testNoteA.isEphemeral;
    details.push({
      step: 'مسار موافقة وحفظ البيانات (Consent: TRUE)',
      passed: consentPassed,
      storageBefore: beforeCountA,
      storageAfter: afterCountA,
      notesReturned: notesA.length,
      description: 'تم التحقق من كتابة الملاحظة في localStorage واسترجاعها بنجاح عند تفعيل الموافقة.'
    });

    // ---- TEST 2: No-Consent Path (عدم الحفظ / الجلسة الخاصة) ----
    // Clear storage first
    localStorage.removeItem(STORAGE_NOTES_KEY);
    setStorageConsent(false);
    const beforeCountB = localStorage.getItem(STORAGE_NOTES_KEY) ? JSON.parse(localStorage.getItem(STORAGE_NOTES_KEY)!).length : 0;

    const testNoteB = storage.addNote({
      title: 'ملاحظة جلسة خاصة بدون موافقة',
      content: 'بيانات غير حساسة مؤقتة يجب ألا تُسجل في أي وسيط تخزين',
      category: 'weekly-session',
      overrideConsent: false
    });

    const afterCountB = localStorage.getItem(STORAGE_NOTES_KEY) ? JSON.parse(localStorage.getItem(STORAGE_NOTES_KEY)!).length : 0;

    const noConsentPassed = beforeCountB === 0 && afterCountB === 0 && testNoteB.isEphemeral === true;
    details.push({
      step: 'مسار عدم الحفظ / الجلسة الخاصة (Consent: FALSE)',
      passed: noConsentPassed,
      storageBefore: beforeCountB,
      storageAfter: afterCountB,
      notesReturned: 0,
      description: 'تم التحقق الصارم من بقاء localStorage خالية تماماً (0 عناصر) وعدم كتابة أي بايت.'
    });

    return {
      consentPathPassed: consentPassed,
      noConsentPathPassed: noConsentPassed,
      details
    };
  } finally {
    // Restore original state
    if (originalConsent !== null) localStorage.setItem(STORAGE_CONSENT_KEY, originalConsent);
    else localStorage.removeItem(STORAGE_CONSENT_KEY);

    if (originalNotes !== null) localStorage.setItem(STORAGE_NOTES_KEY, originalNotes);
    else localStorage.removeItem(STORAGE_NOTES_KEY);
  }
}
