import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Compass, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { SECTION_GUIDES, SectionGuideId } from '../../data/sectionGuides';
import { soundManager } from '../../utils/audio';

const SECTION_GUIDE_COLLAPSED_KEY = 'fakkerfeha_section_guides_collapsed_v1';

function readCollapsedMap(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SECTION_GUIDE_COLLAPSED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeCollapsedState(sectionId: SectionGuideId, collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const map = readCollapsedMap();
    map[sectionId] = collapsed;
    localStorage.setItem(SECTION_GUIDE_COLLAPSED_KEY, JSON.stringify(map));
  } catch {
    // ignore storage quota errors
  }
}

interface SectionGuideBannerProps {
  sectionId: SectionGuideId;
  language: Language;
  className?: string;
}

export const SectionGuideBanner: React.FC<SectionGuideBannerProps> = ({
  sectionId,
  language,
  className = '',
}) => {
  const isAr = language === 'ar';
  const guide = SECTION_GUIDES[sectionId];

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = readCollapsedMap();
    return Boolean(saved[sectionId]);
  });

  if (!guide) return null;

  const toggleCollapse = () => {
    soundManager.playSoftTap();
    const next = !isCollapsed;
    setIsCollapsed(next);
    writeCollapsedState(sectionId, next);
  };

  return (
    <section
      aria-label={isAr ? `دليل القسم: ${guide.sectionNameAr}` : `Section Guide: ${guide.sectionNameEn}`}
      dir={isAr ? 'rtl' : 'ltr'}
      className={`rounded-3xl bg-emerald-50/75 dark:bg-stone-900/95 border border-emerald-200/90 dark:border-emerald-800/60 shadow-2xs transition-colors print:hidden ${className}`}
    >
      {/* Header Row: Section Name + Toggle */}
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-2xl bg-white dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-lg shrink-0 shadow-2xs"
          >
            {guide.icon}
          </span>
          <div className="min-w-0">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
              {isAr ? 'دليل القسم السريع' : 'Quick Section Guide'}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 leading-snug">
              {isAr ? guide.sectionNameAr : guide.sectionNameEn}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-emerald-100/70 dark:bg-stone-800 dark:hover:bg-stone-700 border border-emerald-200 dark:border-stone-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
        >
          <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span>
            {isCollapsed
              ? isAr
                ? 'عرض الشرح'
                : 'Show Guide'
              : isAr
              ? 'طيّ الشرح'
              : 'Hide Guide'}
          </span>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 shrink-0" />
          ) : (
            <ChevronUp className="w-4 h-4 shrink-0" />
          )}
        </button>
      </div>

      {/* Expandable 3-Pillar Body: Idea, Expected Benefit, How to Start */}
      {!isCollapsed && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 border-t border-emerald-200/60 dark:border-stone-800 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {/* 1. فكرة القسم */}
            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-800/70 border border-emerald-100 dark:border-stone-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                <Compass className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'فكرة القسم' : 'What It Is'}</span>
              </div>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                {isAr ? guide.ideaAr : guide.ideaEn}
              </p>
            </div>

            {/* 2. الفائدة المتوقعة */}
            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-800/70 border border-emerald-100 dark:border-stone-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'الفائدة المتوقعة' : 'How It Helps'}</span>
              </div>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                {isAr ? guide.benefitAr : guide.benefitEn}
              </p>
            </div>

            {/* 3. كيف أبدأ؟ */}
            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-stone-800/70 border border-emerald-100 dark:border-stone-700/80 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-teal-800 dark:text-teal-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'كيف أبدأ؟' : 'How to Start'}</span>
              </div>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                {isAr ? guide.howToStartAr : guide.howToStartEn}
              </p>
            </div>
          </div>

          {(isAr ? guide.ethicalNoteAr : guide.ethicalNoteEn) && (
            <p className="text-xs text-stone-600 dark:text-stone-300 px-1 leading-relaxed">
              🌿 {isAr ? guide.ethicalNoteAr : guide.ethicalNoteEn}
            </p>
          )}
        </div>
      )}
    </section>
  );
};
