import { useEffect, useState } from 'react';

export type FontScaleLevel = 'normal' | 'large' | 'xlarge';

export const FONT_SCALE_STORAGE_KEY = 'fakkerfeha_font_scale_v1';
export const FONT_SCALE_CHANGED_EVENT = 'nesma:font-scale-changed';

export interface FontScaleOption {
  id: FontScaleLevel;
  labelAr: string;
  labelEn: string;
  shortBadgeAr: string;
  shortBadgeEn: string;
  descAr: string;
  descEn: string;
}

export const FONT_SCALE_OPTIONS: FontScaleOption[] = [
  {
    id: 'normal',
    labelAr: 'عادي',
    labelEn: 'Normal',
    shortBadgeAr: 'ع',
    shortBadgeEn: 'A',
    descAr: 'حجم واضح ومريح للقراءة اليومية (١٨ بكسل للنصوص الأساسية)',
    descEn: 'Clear comfortable base reading size (18px body text)',
  },
  {
    id: 'large',
    labelAr: 'كبير',
    labelEn: 'Large',
    shortBadgeAr: 'ع+',
    shortBadgeEn: 'A+',
    descAr: 'تكبير إضافي مريح للعين في القراءة الطويلة والألعاب',
    descEn: 'Larger text across all screens, articles, and games',
  },
  {
    id: 'xlarge',
    labelAr: 'كبير جدًا',
    labelEn: 'Extra Large',
    shortBadgeAr: 'ع++',
    shortBadgeEn: 'A++',
    descAr: 'أعلى وضوح بصري للنصوص والأزرار مع التفاف تلقائي للأسطر',
    descEn: 'Maximum text clarity with safe multi-line wrapping',
  },
];

export function isValidFontScale(val: unknown): val is FontScaleLevel {
  return val === 'normal' || val === 'large' || val === 'xlarge';
}

export function getInitialFontScale(): FontScaleLevel {
  if (typeof window === 'undefined') return 'normal';
  try {
    const saved = localStorage.getItem(FONT_SCALE_STORAGE_KEY);
    if (isValidFontScale(saved)) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'normal';
}

export function applyFontScale(level: FontScaleLevel): void {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-font-scale', level);
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(FONT_SCALE_STORAGE_KEY, level);
    } catch {
      // ignore storage errors
    }
    try {
      if (typeof CustomEvent === 'function' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(
          new CustomEvent<FontScaleLevel>(FONT_SCALE_CHANGED_EVENT, { detail: level })
        );
      }
    } catch {
      // ignore event dispatch errors in non-DOM test shims
    }
  }
}

export function cycleFontScale(current: FontScaleLevel): FontScaleLevel {
  if (current === 'normal') return 'large';
  if (current === 'large') return 'xlarge';
  return 'normal';
}

export function useFontScale(): {
  fontScale: FontScaleLevel;
  setFontScale: (next: FontScaleLevel) => void;
  cycleNextFontScale: () => FontScaleLevel;
} {
  const [fontScale, setFontScaleState] = useState<FontScaleLevel>(() => getInitialFontScale());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sync = () => {
      setFontScaleState(getInitialFontScale());
    };
    window.addEventListener(FONT_SCALE_CHANGED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FONT_SCALE_CHANGED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setFontScale = (next: FontScaleLevel) => {
    setFontScaleState(next);
    applyFontScale(next);
  };

  const cycleNextFontScale = (): FontScaleLevel => {
    const next = cycleFontScale(fontScale);
    setFontScale(next);
    return next;
  };

  return { fontScale, setFontScale, cycleNextFontScale };
}
