import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Minimal in-memory browser & localStorage shim for Node verification
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
  snapshot(): Record<string, string> {
    const obj: Record<string, string> = {};
    for (const [k, v] of this.map.entries()) obj[k] = v;
    return obj;
  }
  restore(data: Record<string, string>) {
    this.map.clear();
    for (const [k, v] of Object.entries(data)) this.map.set(k, v);
  }
}

const memStorage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', {
  value: memStorage,
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
  },
  configurable: true,
  writable: true,
});

import {
  COLLECTIBLES_CATALOG,
  ISLAND_CHALLENGES,
  ISLAND_CLUES,
  ISLAND_REGIONS,
  ISLAND_RELICS,
  IslandCollectibleType,
} from '../../data/movingIslandData';
import {
  ARCHIVE_CODEX_ITEMS,
  FINALE_STEP_HINTS,
  GATE_SCALES_DILEMMAS,
  MOVING_ISLAND_STORAGE_KEY,
  buildEndingAccomplishmentSummary,
  canOpenIslandPuzzle,
  checkGrandFinaleReadiness,
  claimRotatingIslandQuest,
  completeIslandPuzzleChallenge,
  computeUnlockedRegions,
  getEvaluatedRotatingQuests,
  loadMovingIslandState,
  prepareGameStageForIslandMission,
  recordFinaleHintUsed,
  selectAndVisitIslandRegion,
  submitGrandFinaleStep,
  syncIslandWithGames,
} from '../movingIslandManager';
import { completeCipherLevel, loadCipherProgress } from '../nesmaCipherStorage';
import { completeStage, getGameLevelProgress } from '../gameLevelsManager';
import { MovingIslandMain } from '../../components/movingIsland/MovingIslandMain';
import { IslandInterconnectedPuzzleModal } from '../../components/movingIsland/IslandInterconnectedPuzzleModal';
import { IslandGrandFinaleModal } from '../../components/movingIsland/IslandGrandFinaleModal';

interface TestRecord {
  id: string;
  titleAr: string;
  passed: boolean;
  details: string;
}

const results: TestRecord[] = [];

function recordTest(id: string, titleAr: string, fn: () => string) {
  const details = fn();
  results.push({ id, titleAr, passed: true, details });
}

async function runAcceptanceSuite() {
  // =========================================================================
  // SECTION 1: NEW PLAYER JOURNEY & UX CLARITY
  // =========================================================================

  recordTest('AT-01', 'دخول لاعب جديد من الصفر ووضوح الهدف الأول', () => {
    memStorage.clear();
    const initial = loadMovingIslandState();
    const unlocked = computeUnlockedRegions(initial);
    assert.deepEqual(unlocked, ['cipher-valley']);
    assert.equal(initial.selectedRegionId, 'cipher-valley');

    // Verify every locked region has explicit unlockRequirementSummaryAr & worldEffectSummaryAr
    for (const reg of ISLAND_REGIONS) {
      assert.ok(reg.unlockRequirementSummaryAr.trim().length > 10, `Missing unlock explanation for ${reg.id}`);
      assert.ok(reg.worldEffectSummaryAr.trim().length > 10, `Missing world effect for ${reg.id}`);
    }

    // Render MovingIslandMain HTML for brand-new player & verify immediate guidance banner
    const html = renderToStaticMarkup(
      React.createElement(MovingIslandMain, {
        language: 'ar',
        onBack: () => {},
        onLaunchLinkedGame: () => {},
      })
    );
    assert.ok(html.includes('نقطة البداية · الخطوة ١'), 'First-time player guidance badge missing');
    assert.ok(html.includes('ابدأ التحدي الأول الآن'), 'First-time player CTA missing');
    return 'فتح وادي الشفرات فقط عند البداية + ظهور شريط «نقطة البداية · الخطوة ١» وزر البدء المباشر.';
  });

  // =========================================================================
  // SECTION 2: REAL INTEGRATION WITH ALL 6 LINKED GAMES
  // =========================================================================

  let globalXP = 0;
  const addXP = (amt: number) => {
    globalXP += amt;
  };

  recordTest('AT-02', 'ربط المنطقة ١ بلعبة «شفرة نسمة» (nesma-cipher) وفتح جسر التوازن والمسار المختصر', () => {
    const targetLvl = prepareGameStageForIslandMission('nesma-cipher', 1);
    assert.equal(targetLvl, 1);

    // Real solve of Level 1 in nesma-cipher with 1 hint (2 stars) -> unlocks Shard #1 & Balance Bridge, NOT shortcut yet
    completeCipherLevel(1, 2, 1);
    const s1 = syncIslandWithGames(addXP);
    assert.equal(s1.state.collectibles.cipher_shard, 1);
    assert.ok(computeUnlockedRegions(s1.state).includes('balance-bridge'));
    assert.equal(s1.state.worldMutations.alternateShortcutActive, false);

    // Solve Levels 2..5 with 0 hints -> triggers ch_cipher_2 (0-hint mastery) AND ch_cipher_3 (5 stages)!
    completeCipherLevel(2, 3, 0);
    completeCipherLevel(3, 3, 0);
    completeCipherLevel(4, 3, 0);
    completeCipherLevel(5, 3, 0);
    const s2 = syncIslandWithGames(addXP);
    assert.equal(s2.state.collectibles.cipher_shard, 3);
    assert.equal(s2.state.worldMutations.alternateShortcutActive, true);
    assert.ok(s2.state.discoveredClueIds.includes('clue_cipher_code'));
    assert.ok(computeUnlockedRegions(s2.state).includes('vials-garden'));

    // Solve interactive island puzzle ch_cipher_4 (symbol_lock) -> 4th shard!
    const badSym = completeIslandPuzzleChallenge('ch_cipher_4', {
      type: 'symbol_lock',
      symbols: ['wave', 'sun', 'star', 'key'],
    });
    assert.equal(badSym.success, false);

    const okSym = completeIslandPuzzleChallenge(
      'ch_cipher_4',
      { type: 'symbol_lock', symbols: ['sun', 'key', 'wave', 'star'] },
      addXP
    );
    assert.equal(okSym.success, true);
    assert.equal(okSym.state.collectibles.cipher_shard, 4);
    return 'تم التحقق من ٤/٤ شظايا الشفرة + الدليل (٤-١-٣-٢) + فتح جسر التوازن والمسار المختصر.';
  });

  recordTest('AT-03', 'ربط المنطقة ٢ بلعبة «أحجار التوازن» (zen-puzzle) وإصلاح الجسر المعلّق', () => {
    const prep = prepareGameStageForIslandMission('zen-puzzle', 1);
    assert.equal(prep, 1);

    completeStage('zen-puzzle', 1, 3, 3, addXP);
    completeStage('zen-puzzle', 2, 3, 4, addXP);
    completeStage('zen-puzzle', 3, 3, 5, addXP);

    const synced = syncIslandWithGames(addXP);
    assert.equal(synced.state.collectibles.balance_crystal, 3);
    assert.ok(synced.state.discoveredClueIds.includes('clue_balance_ratio'));

    // Repair bridge via ch_balance_4 (bridge_counterweight)
    const badTorque = completeIslandPuzzleChallenge('ch_balance_4', {
      type: 'bridge_counterweight',
      slots: [6, 4, 2, 3],
    });
    assert.equal(badTorque.success, false);

    const okTorque = completeIslandPuzzleChallenge(
      'ch_balance_4',
      { type: 'bridge_counterweight', slots: [2, 6, 4, 3] },
      addXP
    );
    assert.equal(okTorque.success, true);
    assert.equal(okTorque.state.worldMutations.bridgeRepaired, true);
    assert.equal(okTorque.state.collectibles.balance_crystal, 4);
    return 'تم التحقق من ٤/٤ بلورات التوازن + إصلاح الجسر المعلّق بمعادلة العزم الفيزيائية.';
  });

  recordTest('AT-04', 'ربط المنطقة ٣ بلعبة «فرز قوارير المشاعر» (emotion-sort-puzzle) وكشف المرصد والبوابة المزدوجة', () => {
    const prep = prepareGameStageForIslandMission('emotion-sort-puzzle', 1);
    assert.equal(prep, 1);

    completeStage('emotion-sort-puzzle', 1, 3, 6, addXP);
    completeStage('emotion-sort-puzzle', 2, 3, 8, addXP);
    completeStage('emotion-sort-puzzle', 3, 3, 10, addXP);

    const synced = syncIslandWithGames(addXP);
    assert.equal(synced.state.collectibles.garden_seed, 3);
    assert.ok(synced.state.discoveredClueIds.includes('clue_vials_spectrum'));
    // Dual-game condition: Balance + Vials opens Order Library!
    assert.equal(synced.state.worldMutations.dualGateOpened, true);
    // Clues #1 + #3 reveal Hidden Mist Observatory!
    assert.equal(synced.state.worldMutations.hiddenCoveRevealed, true);

    const unlocked = computeUnlockedRegions(synced.state);
    assert.ok(unlocked.includes('order-library'));
    assert.ok(unlocked.includes('hidden-observatory'));

    // Interactive elixir_synthesis puzzle (ch_vials_4)
    const okElixir = completeIslandPuzzleChallenge(
      'ch_vials_4',
      {
        type: 'elixir_synthesis',
        layers: ['emerald_roots', 'azure_clarity', 'golden_hope'],
      },
      addXP
    );
    assert.equal(okElixir.success, true);
    assert.equal(okElixir.state.collectibles.garden_seed, 4);
    return 'تم التحقق من ٤/٤ بذور الحديقة + فتح البوابة المزدوجة للمكتبة + كشف مرصد الضباب الخفي.';
  });

  recordTest('AT-05', 'ربط المنطقة ٤ بلعبة «ترتيب الفوضى والرفوف» (mindful-organizer) وفتح بوابة الاختيار وغرفة الكنوز', () => {
    const prep = prepareGameStageForIslandMission('mindful-organizer', 1);
    assert.equal(prep, 1);

    completeStage('mindful-organizer', 1, 3, 6, addXP);
    completeStage('mindful-organizer', 2, 3, 8, addXP);
    completeStage('mindful-organizer', 3, 3, 10, addXP);

    const synced = syncIslandWithGames(addXP);
    assert.equal(synced.state.collectibles.library_key, 3);
    assert.ok(synced.state.discoveredClueIds.includes('clue_library_shelves'));
    // Treasure vault requires >=2 shards, >=2 seeds, >=2 keys -> now opened!
    assert.equal(synced.state.worldMutations.treasureVaultOpened, true);
    assert.ok(synced.state.relicIds.includes('vault_crown_relic'));

    const unlocked = computeUnlockedRegions(synced.state);
    assert.ok(unlocked.includes('choice-gate'));
    assert.ok(unlocked.includes('treasure-vault'));

    // Solve ch_library_4 (archive_codex)
    const assignments: Record<string, number> = {};
    for (const item of ARCHIVE_CODEX_ITEMS) {
      assignments[item.id] = item.idealShelf;
    }
    const okCodex = completeIslandPuzzleChallenge(
      'ch_library_4',
      { type: 'archive_codex', assignments },
      addXP
    );
    assert.equal(okCodex.success, true);
    assert.equal(okCodex.state.collectibles.library_key, 4);
    return 'تم التحقق من ٤/٤ مفاتيح المكتبة + فتح بوابة الاختيار + فتح غرفة الكنوز واستلام تاج الخزنة.';
  });

  recordTest('AT-06', 'ربط المنطقة ٥ بلعبة «في إيدي / برّا إيدي» (hands-control) وحراسة معبد البصيرة قبل الجاهزية', () => {
    const prep = prepareGameStageForIslandMission('hands-control', 1);
    assert.equal(prep, 1);

    completeStage('hands-control', 1, 3, 5, addXP);
    completeStage('hands-control', 2, 3, 6, addXP);
    completeStage('hands-control', 3, 3, 7, addXP);

    const synced = syncIslandWithGames(addXP);
    assert.equal(synced.state.collectibles.choice_stone, 3);
    assert.ok(synced.state.discoveredClueIds.includes('clue_choice_compass'));

    const unlockedBeforeMountain = computeUnlockedRegions(synced.state);
    assert.ok(unlockedBeforeMountain.includes('secrets-mountain'));
    // CRITICAL REGRESSION CHECK (Defect #2): Region 9 (finale-sanctuary) MUST STILL BE LOCKED because break-mountain is not played yet!
    assert.equal(
      unlockedBeforeMountain.includes('finale-sanctuary'),
      false,
      'finale-sanctuary must remain locked until all 6 games & collectibles are earned!'
    );

    // Solve ch_choice_4 (gate_scales)
    const choices: Record<string, boolean> = {};
    for (const d of GATE_SCALES_DILEMMAS) choices[d.id] = d.inHands;
    const okGate = completeIslandPuzzleChallenge(
      'ch_choice_4',
      { type: 'gate_scales', choices },
      addXP
    );
    assert.equal(okGate.success, true);
    assert.equal(okGate.state.collectibles.choice_stone, 4);
    return 'تم التحقق من ٤/٤ أحجار الاختيار + فتح جبل الأسرار + بقاء معبد البصيرة مغلقاً حتى اكتمال اللعبة السادسة.';
  });

  recordTest('AT-07', 'ربط المنطقة ٦ بلعبة «كسّري الجبل» (break-mountain) ومنطقة المرصد وفتح المنطقة التاسعة', () => {
    const prep = prepareGameStageForIslandMission('break-mountain', 1);
    assert.equal(prep, 1);

    completeStage('break-mountain', 1, 3, 4, addXP);
    completeStage('break-mountain', 2, 3, 5, addXP);
    completeStage('break-mountain', 3, 3, 6, addXP);
    completeStage('break-mountain', 4, 3, 7, addXP);

    const synced = syncIslandWithGames(addXP);
    assert.equal(synced.state.collectibles.mountain_fragment, 3);
    assert.ok(synced.state.discoveredClueIds.includes('clue_mountain_core'));

    // Solve Hidden Observatory puzzle (ch_observatory_vault: star_triangulation) -> grants 4th mountain_fragment & mist_navigator_lens!
    const okObs = completeIslandPuzzleChallenge(
      'ch_observatory_vault',
      { type: 'star_triangulation', rings: [4, 3, 6] },
      addXP
    );
    assert.equal(okObs.success, true);
    assert.equal(okObs.state.collectibles.mountain_fragment, 4);
    assert.ok(okObs.state.relicIds.includes('mist_navigator_lens'));

    // Now all 9 regions must be unlocked!
    const allUnlocked = computeUnlockedRegions(okObs.state);
    assert.equal(allUnlocked.length, 9);
    assert.ok(allUnlocked.includes('finale-sanctuary'));
    return 'تم التحقق من ٤/٤ شظايا الجبل + حل لغز المرصد الفلكي + انفتاح المناطق التسع بالكامل (٩/٩).';
  });

  // =========================================================================
  // SECTION 3: UX OBSTACLES, REACHABILITY & NO CIRCULAR DEPENDENCIES
  // =========================================================================

  recordTest('AT-08', 'اكتمال جميع المقتنيات (٢٤/٢٤) والأدلة (٦/٦) وعدم وجود تبعيات دائرية أو عناصر مستحيلة', () => {
    const st = loadMovingIslandState();
    const allTypes: IslandCollectibleType[] = [
      'cipher_shard',
      'balance_crystal',
      'garden_seed',
      'library_key',
      'choice_stone',
      'mountain_fragment',
    ];
    for (const t of allTypes) {
      assert.equal(st.collectibles[t], COLLECTIBLES_CATALOG[t].totalCount, `Incomplete set for ${t}`);
    }
    assert.equal(st.claimedChallengeIds.length, ISLAND_CHALLENGES.length);
    assert.equal(st.discoveredClueIds.length, Object.keys(ISLAND_CLUES).length);

    // Verify hints do not trivially dump raw single-word spoilers on Tier 1
    for (const step of [1, 2, 3, 4] as const) {
      const [tier1, tier2] = FINALE_STEP_HINTS[step];
      assert.ok(tier1.length > 20 && tier2.length > 20);
      assert.notEqual(tier1, tier2);
    }
    return 'جميع التحديات الـ ٢٤ والمقتنيات الـ ٢٤ والأدلة الـ ٦ قابلة للتحقيق ١٠٠٪ دون أي تعارض أو حلقة مفرغة.';
  });

  recordTest('AT-09', 'سلامة إعادة عرض الألغاز المحلولة دون أزرار ميتة أو تكرار مكافآت', () => {
    const st = loadMovingIslandState();
    const xpBefore = globalXP;

    // Render solved puzzle modal & verify "تفعيل الآلية والتحقق" button is active (not hidden!)
    const solvedChallenge = ISLAND_CHALLENGES.find((c) => c.id === 'ch_balance_4')!;
    const modalHtml = renderToStaticMarkup(
      React.createElement(IslandInterconnectedPuzzleModal, {
        challenge: solvedChallenge,
        islandState: st,
        onClose: () => {},
        onSolved: () => {},
      })
    );
    assert.ok(modalHtml.includes('تفعيل الآلية والتحقق'), 'Replay submit button must remain active');
    assert.ok(modalHtml.includes('دون تكرار المكافأة'), 'Replay notice must be visible');

    // Re-submit solved puzzle & re-play solved game stage -> zero duplicate XP or collectibles
    const replayPuzzle = completeIslandPuzzleChallenge(
      'ch_balance_4',
      { type: 'bridge_counterweight', slots: [2, 6, 4, 3] },
      addXP
    );
    assert.equal(replayPuzzle.alreadyClaimed, true);
    completeCipherLevel(1, 3, 0);
    completeStage('zen-puzzle', 1, 3, 3, () => {});
    const resync = syncIslandWithGames(addXP);

    assert.equal(globalXP, xpBefore, 'Replaying completed challenges must never grant duplicate Island XP');
    assert.equal(resync.state.collectibles.balance_crystal, 4);
    assert.equal(resync.state.collectibles.cipher_shard, 4);
    return 'زر التحقق يعمل عند إعادة التجربة مع تنبيه واضح، وصفر تكرار للنقاط أو المقتنيات.';
  });

  // =========================================================================
  // SECTION 4: PERSISTENCE, RELOAD & OFFLINE RESILIENCE
  // =========================================================================

  recordTest('AT-10', 'حفظ التقدم عند إغلاق التطبيق وإعادة فتحه والعمل بدون اتصال أو عند تلف جزئي', () => {
    selectAndVisitIslandRegion('secrets-mountain');
    const savedDiskSnapshot = memStorage.snapshot();

    // Simulate closing app (clearing memory) and reopening from persisted disk snapshot
    memStorage.clear();
    memStorage.restore(savedDiskSnapshot);

    const reopened = loadMovingIslandState();
    assert.equal(reopened.selectedRegionId, 'secrets-mountain');
    assert.equal(reopened.claimedChallengeIds.length, 24);
    assert.equal(reopened.worldMutations.bridgeRepaired, true);
    assert.equal(reopened.worldMutations.treasureVaultOpened, true);
    assert.equal(loadCipherProgress().completedLevels.length, 5);
    assert.ok(getGameLevelProgress('break-mountain').stars[4] === 3);

    // Verify rotating quests work 100% offline without network calls and do not double-claim
    const quests = getEvaluatedRotatingQuests(reopened);
    assert.equal(quests.length, 5);
    assert.ok(quests.every((q) => q.isCompleted));
    const qClaim1 = claimRotatingIslandQuest(quests[0].id, addXP);
    const qClaim2 = claimRotatingIslandQuest(quests[0].id, addXP);
    assert.equal(qClaim1.claimed, true);
    assert.equal(qClaim2.claimed, false);

    return 'استعادة التقدم ١٠٠٪ بعد الإغلاق وإعادة الفتح + عمل المهام المتجددة أوفلاين دون فقدان أو تكرار.';
  });

  // =========================================================================
  // SECTION 5: GRAND FINALE MULTI-STEP PUZZLE VERIFICATION
  // =========================================================================

  recordTest('AT-11', 'اللغز الختامي الكبير (منع الفتح المبكر، المحاولات الخاطئة، التلميحات، والحل الكامل)', () => {
    // 5a. Verify premature block on a separate partial snapshot
    const backup = memStorage.snapshot();
    memStorage.clear();
    completeCipherLevel(1, 3, 0);
    syncIslandWithGames();
    const blocked = submitGrandFinaleStep({
      step: 1,
      orderedRegions: [
        'cipher-valley',
        'balance-bridge',
        'vials-garden',
        'order-library',
        'choice-gate',
        'secrets-mountain',
      ],
    });
    assert.equal(blocked.correct, false);
    assert.ok(blocked.feedbackAr.includes('٦'));

    // Restore full pre-finale state
    memStorage.restore(backup);
    const readyState = loadMovingIslandState();
    assert.equal(checkGrandFinaleReadiness(readyState).isReady, true);

    // Wrong answers on Steps 1, 2, 3, 4 + progressive hint tracking
    const bad1 = submitGrandFinaleStep({
      step: 1,
      orderedRegions: [
        'secrets-mountain',
        'cipher-valley',
        'balance-bridge',
        'vials-garden',
        'order-library',
        'choice-gate',
      ],
    });
    assert.equal(bad1.correct, false);
    assert.equal(bad1.state.finaleAttempts, 1);

    const afterHint = recordFinaleHintUsed();
    assert.equal(afterHint.finaleHintsUsed, 1);

    // Solve Step 1
    const ok1 = submitGrandFinaleStep({
      step: 1,
      orderedRegions: [
        'cipher-valley',
        'balance-bridge',
        'vials-garden',
        'order-library',
        'choice-gate',
        'secrets-mountain',
      ],
    });
    assert.equal(ok1.correct, true);
    assert.equal(ok1.state.finaleCurrentStep, 2);

    // Wrong Step 2 -> Retry -> Solve Step 2
    const bad2 = submitGrandFinaleStep({ step: 2, pins: [1, 1, 1, 1] });
    assert.equal(bad2.correct, false);
    const ok2 = submitGrandFinaleStep({ step: 2, pins: [4, 1, 3, 2] });
    assert.equal(ok2.correct, true);
    assert.equal(ok2.state.finaleCurrentStep, 3);

    // Wrong Step 3 -> Retry -> Solve Step 3
    const bad3 = submitGrandFinaleStep({
      step: 3,
      shelves: { top: 'green', middle: 'blue', bottom: 'gold' },
    });
    assert.equal(bad3.correct, false);
    const ok3 = submitGrandFinaleStep({
      step: 3,
      shelves: { top: 'gold', middle: 'blue', bottom: 'green' },
    });
    assert.equal(ok3.correct, true);
    assert.equal(ok3.state.finaleCurrentStep, 4);

    // Wrong Step 4 -> Retry -> Solve Step 4 & Unlock Grand Finale Sanctuary!
    const bad4 = submitGrandFinaleStep({
      step: 4,
      selectedAnchorIds: ['breath_step', 'yesterday_regret', 'others_reactions'],
    });
    assert.equal(bad4.correct, false);
    assert.equal(bad4.state.finaleAttempts, 4);

    const xpBeforeFinale = globalXP;
    const ok4 = submitGrandFinaleStep(
      {
        step: 4,
        selectedAnchorIds: ['breath_step', 'honest_boundary', 'ask_support'],
      },
      addXP
    );
    assert.equal(ok4.correct, true);
    assert.equal(ok4.completedFinaleNow, true);
    assert.equal(ok4.state.finaleCompleted, true);
    assert.equal(ok4.state.worldMutations.finaleSanctuaryUnlocked, true);
    assert.ok(ok4.state.relicIds.includes('island_heart_prism'));
    assert.equal(globalXP - xpBeforeFinale, ISLAND_RELICS.island_heart_prism.xpBonus);

    // Render Final Coronation Modal & check personalized summary
    const summary = buildEndingAccomplishmentSummary(ok4.state);
    assert.equal(summary.relicsEarned, 3);
    assert.equal(summary.totalCollectibles, 24);
    const finaleHtml = renderToStaticMarkup(
      React.createElement(IslandGrandFinaleModal, {
        islandState: ok4.state,
        onClose: () => {},
        onStateUpdated: () => {},
        onJumpToGame: () => {},
      })
    );
    assert.ok(finaleHtml.includes('مشهد التتويج: قلب الجزيرة الموحّد'));
    assert.ok(finaleHtml.includes(ISLAND_RELICS.island_heart_prism.nameAr));

    return 'اجتياز حراسة الشروط، ٤ محاولات خاطئة وإعادة المحاولة، التلميحات التدريجية، وحل الخطوات الأربع وتتويج المعبد.';
  });

  recordTest('AT-12', 'تعافي النظام بأمان من تلف بيانات localStorage دون انهيار الواجهة', () => {
    memStorage.setItem(MOVING_ISLAND_STORAGE_KEY, '{corrupted_json:::');
    const recovered = loadMovingIslandState();
    assert.equal(recovered.version, 1);
    assert.deepEqual(recovered.visitedRegions, ['cipher-valley']);
    return 'تم استرداد الحالة الابتدائية بأمان عند حقن JSON تالف دون أي استثناء برمجي.';
  });

  console.log('\n=============================================================');
  console.log(`ACCEPTANCE SUITE SUMMARY: ${results.length}/${results.length} PASSED`);
  console.log('=============================================================');
  for (const r of results) {
    console.log(`[PASS] ${r.id} — ${r.titleAr}: ${r.details}`);
  }
}

runAcceptanceSuite().catch((err) => {
  console.error('Acceptance suite failed:', err);
  process.exit(1);
});
