import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.map.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  setItem(key: string, value: string): void {
    this.map.set(key, String(value));
  }
}

const memStorage = new MemoryStorage();
const mockDocElAttrs = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  value: memStorage,
  configurable: true,
  writable: true,
});
Object.defineProperty(globalThis, 'document', {
  value: {
    documentElement: {
      setAttribute: (k: string, v: string) => mockDocElAttrs.set(k, v),
      getAttribute: (k: string) => mockDocElAttrs.get(k) ?? null,
    },
  },
  configurable: true,
  writable: true,
});
Object.defineProperty(globalThis, 'window', {
  value: {
    localStorage: memStorage,
    location: { search: '', hash: '', pathname: '/' },
    scrollTo: () => {},
    history: { pushState: () => {}, replaceState: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  },
  configurable: true,
  writable: true,
});

import {
  FONT_SCALE_OPTIONS,
  FONT_SCALE_STORAGE_KEY,
  applyFontScale,
  cycleFontScale,
  getInitialFontScale,
} from '../fontPreferences';
import { SECTION_GUIDES, SectionGuideId } from '../../data/sectionGuides';
import { CIPHER_MECHANIC_GUIDES, GAME_GUIDES } from '../../data/gameGuides';
import { ALL_36_GAMES } from '../../data/gamesCatalog';
import { SectionGuideBanner } from '../../components/common/SectionGuideBanner';
import {
  AUTO_SHOW_GAME_GUIDES_STORAGE_KEY,
  GameGuideWrapper,
  GameHowToPlayModal,
  isAutoGameGuideEnabled,
  resetSeenGameGuides,
  setAutoGameGuideEnabled,
} from '../../components/common/GameGuideSystem';
import { GameMode } from '../../types';

const ALL_APP_MODES: GameMode[] = [
  'map',
  'library',
  'journey',
  'hands-control',
  'reframe-sentence',
  'break-mountain',
  'gather-bubbles',
  'boundaries-circle',
  'gentle-break',
  'first-sentence',
  'distance-safe',
  'small-light',
  'game-butterfly-tap',
  'game-somatic-shake',
  'game-pmr-squeeze',
  'game-sensory-grounding',
  'game-infinity-flow',
  'game-balloon-breath',
  'discover',
  'cards-insight',
  'scenarios-quick',
  'visual-projection',
  'micro-challenge-30s',
  'daily-quests',
  'wisdom-vault',
  'touch-and-break',
  'body-motion-challenge',
  'emotion-roulette',
  'scratch-to-reveal',
  'multi-sensory-quest',
  'speed-lie-detector',
  'challenge-separate',
  'challenge-feeling',
  'challenge-perspective',
  'challenge-react',
  'decisional-balance',
  'thought-shredder',
  'core-needs-compass',
  'inner-mirror',
  'cognitive-reframing-puzzle',
  'inner-labyrinth',
  'digital-release-ritual',
  'relational-energy-matrix',
  'resonance-chamber',
  'mental-loom',
  'worry-sandbox',
  'blooming-gratitude',
  'nesma-cipher',
  'mindful-organizer',
  'zen-puzzle',
  'emotion-sort-puzzle',
  'smart-games-hub',
  'moving-island',
  'workshop',
  'my-journey',
  'weekly-session',
  'profile',
  'projects',
  'admin-cms',
];

const PURE_SECTION_MODES = new Set<SectionGuideId>([
  'map',
  'library',
  'smart-games-hub',
  'weekly-session',
  'discover',
  'my-journey',
  'profile',
  'workshop',
  'projects',
  'admin-cms',
]);

function runReadabilityAndGuidesTests() {
  // 1. Verify CSS & index.html typography tokens and Arabic fonts
  const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
  const indexCss = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf8');

  assert.ok(indexHtml.includes('family=Cairo'), 'Cairo font must be loaded in index.html');
  assert.ok(indexHtml.includes('family=Tajawal'), 'Tajawal font must be loaded in index.html');
  assert.ok(
    indexHtml.includes('fakkerfeha_font_scale_v1'),
    'index.html must initialize saved font scale synchronously before first paint'
  );
  assert.ok(indexCss.includes('html[data-font-scale="large"]'), 'CSS must support large scale');
  assert.ok(indexCss.includes('html[data-font-scale="xlarge"]'), 'CSS must support xlarge scale');
  assert.ok(indexCss.includes('--text-base: 1.125rem'), 'Base text must be 18px (1.125rem)');

  // 2. Verify 3-level Font Scale utility & persistence
  memStorage.clear();
  mockDocElAttrs.clear();
  assert.equal(FONT_SCALE_OPTIONS.length, 3);
  assert.deepEqual(
    FONT_SCALE_OPTIONS.map((o) => o.labelAr),
    ['عادي', 'كبير', 'كبير جدًا']
  );
  assert.equal(getInitialFontScale(), 'normal');

  applyFontScale('large');
  assert.equal(memStorage.getItem(FONT_SCALE_STORAGE_KEY), 'large');
  assert.equal(mockDocElAttrs.get('data-font-scale'), 'large');
  assert.equal(getInitialFontScale(), 'large');

  const nextAfterLarge = cycleFontScale('large');
  assert.equal(nextAfterLarge, 'xlarge');
  applyFontScale(nextAfterLarge);
  assert.equal(memStorage.getItem(FONT_SCALE_STORAGE_KEY), 'xlarge');
  assert.equal(mockDocElAttrs.get('data-font-scale'), 'xlarge');
  assert.equal(cycleFontScale('xlarge'), 'normal');

  // 3. Verify all 12 Section Guides (completeness, uniqueness, SSR render)
  const expectedSections: SectionGuideId[] = [
    'map',
    'library',
    'moving-island',
    'nesma-cipher',
    'smart-games-hub',
    'weekly-session',
    'discover',
    'my-journey',
    'profile',
    'workshop',
    'projects',
    'admin-cms',
  ];
  assert.equal(Object.keys(SECTION_GUIDES).length, 12);

  const uniqueIdeas = new Set<string>();
  for (const secId of expectedSections) {
    const g = SECTION_GUIDES[secId];
    assert.ok(g, `Missing section guide for ${secId}`);
    assert.ok(g.sectionNameAr.trim().length >= 5, `Short sectionNameAr for ${secId}`);
    assert.ok(g.ideaAr.trim().length >= 20, `Short ideaAr for ${secId}`);
    assert.ok(g.benefitAr.trim().length >= 20, `Short benefitAr for ${secId}`);
    assert.ok(g.howToStartAr.trim().length >= 20, `Short howToStartAr for ${secId}`);
    assert.ok(!uniqueIdeas.has(g.ideaAr), `Duplicate ideaAr detected on ${secId}`);
    uniqueIdeas.add(g.ideaAr);

    const html = renderToStaticMarkup(
      React.createElement(SectionGuideBanner, { sectionId: secId, language: 'ar' })
    );
    assert.ok(html.includes(g.sectionNameAr), `Banner missing sectionNameAr for ${secId}`);
    assert.ok(html.includes('فكرة القسم'), `Banner missing فكرة القسم for ${secId}`);
    assert.ok(html.includes('الفائدة المتوقعة'), `Banner missing الفائدة المتوقعة for ${secId}`);
    assert.ok(html.includes('كيف أبدأ؟'), `Banner missing كيف أبدأ؟ for ${secId}`);
  }

  // 4. Verify 100% Game Guides coverage across all playable GameModes & ALL_36_GAMES + 10 Cipher puzzle mechanics
  let verifiedPlayableCount = 0;
  const uniqueGameGoals = new Set<string>();

  for (const mode of ALL_APP_MODES) {
    if (PURE_SECTION_MODES.has(mode as SectionGuideId)) continue;
    const guide = GAME_GUIDES[mode];
    assert.ok(guide, `Playable mode "${mode}" is missing a GameGuideInfo entry!`);
    assert.ok(guide.ideaAndGoalAr.trim().length >= 20, `Short ideaAndGoalAr for ${mode}`);
    assert.ok(guide.controlsAr.trim().length >= 20, `Short controlsAr for ${mode}`);
    assert.ok(guide.winConditionAr.trim().length >= 15, `Short winConditionAr for ${mode}`);
    assert.ok(guide.scoringAndHintsAr.trim().length >= 15, `Short scoringAndHintsAr for ${mode}`);
    assert.ok(guide.navigationAndExitAr.trim().length >= 15, `Short navigationAndExitAr for ${mode}`);
    assert.ok(!uniqueGameGoals.has(guide.ideaAndGoalAr), `Duplicate game goal on ${mode}`);
    uniqueGameGoals.add(guide.ideaAndGoalAr);
    verifiedPlayableCount++;
  }

  for (const catalogGame of ALL_36_GAMES) {
    assert.ok(
      GAME_GUIDES[catalogGame.id],
      `Catalog game "${catalogGame.id}" (${catalogGame.nameAr}) is missing from GAME_GUIDES!`
    );
  }

  assert.equal(Object.keys(CIPHER_MECHANIC_GUIDES).length, 10);

  // 5. Verify GameGuideWrapper & GameHowToPlayModal rendering + localStorage skip preference
  const wrapperHtml = renderToStaticMarkup(
    React.createElement(GameGuideWrapper, {
      gameMode: 'zen-puzzle',
      language: 'ar',
      children: React.createElement('div', { id: 'live-game-canvas' }, 'LIVE_ZEN_STATE_42'),
    })
  );
  assert.ok(wrapperHtml.includes('طريقة اللعب'), 'Wrapper must render طريقة اللعب button');
  assert.ok(
    wrapperHtml.includes('LIVE_ZEN_STATE_42'),
    'Wrapper must continuously render live game children'
  );

  const modalHtml = renderToStaticMarkup(
    React.createElement(GameHowToPlayModal, {
      guide: GAME_GUIDES['nesma-cipher']!,
      language: 'ar',
      isOpen: true,
      onClose: () => {},
    })
  );
  assert.ok(modalHtml.includes('فكرة اللعبة وهدفها'));
  assert.ok(modalHtml.includes('طريقة اللعب والتحكم'));
  assert.ok(modalHtml.includes('كيفية إكمال المرحلة أو الفوز'));
  assert.ok(modalHtml.includes('النقاط والنجوم والتلميحات'));
  assert.ok(modalHtml.includes('المرحلة التالية أو الخروج'));

  setAutoGameGuideEnabled(false);
  assert.equal(memStorage.getItem(AUTO_SHOW_GAME_GUIDES_STORAGE_KEY), 'false');
  assert.equal(isAutoGameGuideEnabled(), false);
  resetSeenGameGuides();
  assert.equal(isAutoGameGuideEnabled(), true);

  console.log(
    JSON.stringify(
      {
        status: 'ALL_READABILITY_AND_GUIDES_TESTS_PASSED',
        fontLevelsVerified: FONT_SCALE_OPTIONS.map((o) => o.id),
        sectionsVerified: expectedSections.length,
        playableGameModesVerified: verifiedPlayableCount,
        catalogEntriesVerified: ALL_36_GAMES.length,
        cipherMechanicsVerified: Object.keys(CIPHER_MECHANIC_GUIDES).length,
      },
      null,
      2
    )
  );
}

runReadabilityAndGuidesTests();
