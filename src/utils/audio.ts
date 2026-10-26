// Mindful & Arcade Game Sound Synthesizer + Ambient Soundscape Engine using Web Audio API

export type AmbientSoundscapeId = 'off' | 'rain' | 'forest' | 'waves';

export interface AmbientSoundscapeOption {
  id: AmbientSoundscapeId;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
}

export const AMBIENT_SOUNDSCAPES: AmbientSoundscapeOption[] = [
  {
    id: 'off',
    labelAr: 'إيقاف',
    labelEn: 'Off',
    descAr: 'بدون خلفية صوتية مرافقة',
    descEn: 'Silent background',
  },
  {
    id: 'rain',
    labelAr: 'مطر هادئ',
    labelEn: 'Rain',
    descAr: 'زخّات مطر ناعمة تساعد على التركيز والسكينة',
    descEn: 'Soft rainfall outside the window for calm focus',
  },
  {
    id: 'forest',
    labelAr: 'نسيم الغابة',
    labelEn: 'Forest',
    descAr: 'حفيف أوراق الشجر مع تغريد عصافير بعيدة',
    descEn: 'Gentle canopy breeze and distant songbirds',
  },
  {
    id: 'waves',
    labelAr: 'أمواج هادئة',
    labelEn: 'Calm Waves',
    descAr: 'مدّ وجزر متناغم مع إيقاع التنفس العميق',
    descEn: 'Slow ocean swells paced like mindful breathing',
  },
];

const SOUNDSCAPE_STORAGE_KEY = 'fakkerfeha_soundscape_v1';
const AMBIENT_VOLUME_STORAGE_KEY = 'fakkerfeha_ambient_volume_v1';

type AmbientListener = () => void;

class SoundManager {
  private ctx: AudioContext | null = null;
  private _enabled: boolean = (() => {
    if (typeof window === 'undefined') return true;
    try {
      const appSound = localStorage.getItem('fakkerfeha_sound_v1');
      if (appSound !== null) return appSound !== 'false';
      const stored = localStorage.getItem('nesma_cipher_sound_enabled');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  })();

  private currentSoundscape: AmbientSoundscapeId = (() => {
    if (typeof window === 'undefined') return 'off';
    try {
      const saved = localStorage.getItem(SOUNDSCAPE_STORAGE_KEY);
      if (saved === 'rain' || saved === 'forest' || saved === 'waves' || saved === 'off') {
        return saved;
      }
      return 'off';
    } catch {
      return 'off';
    }
  })();

  private ambientVolume: number = (() => {
    if (typeof window === 'undefined') return 0.55;
    try {
      const raw = localStorage.getItem(AMBIENT_VOLUME_STORAGE_KEY);
      if (raw !== null) {
        const parsed = parseFloat(raw);
        if (!Number.isNaN(parsed)) {
          return Math.min(1, Math.max(0.05, parsed));
        }
      }
      return 0.55;
    } catch {
      return 0.55;
    }
  })();

  private pinkNoiseBuffer: AudioBuffer | null = null;
  private brownNoiseBuffer: AudioBuffer | null = null;
  private ambientMasterGain: GainNode | null = null;
  private stopCurrentAmbientNodes: (() => void) | null = null;
  private activeRenderedSoundscape: AmbientSoundscapeId = 'off';
  private listeners: Set<AmbientListener> = new Set();
  private unlockBound = false;

  private pendingTimeouts: number[] = [];

  constructor() {
    this.setupAutoplayUnlock();
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    if (this._enabled === value) return;
    this._enabled = value;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nesma_cipher_sound_enabled', String(value));
      } catch {
        // ignore
      }
    }
    if (!value) {
      this.teardownAmbient(true);
    } else if (this.currentSoundscape !== 'off') {
      this.startAmbientEngine(this.currentSoundscape);
    }
    this.notifyListeners();
  }

  public toggleSound(): boolean {
    this.enabled = !this._enabled;
    return this._enabled;
  }

  public subscribe(listener: AmbientListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // ignore listener errors
      }
    });
  }

  private setupAutoplayUnlock() {
    if (typeof window === 'undefined' || this.unlockBound) return;
    this.unlockBound = true;

    const unlock = () => {
      if (this._enabled && this.currentSoundscape !== 'off') {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        if (this.activeRenderedSoundscape !== this.currentSoundscape) {
          this.startAmbientEngine(this.currentSoundscape);
        }
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  private clearPendingTimeouts() {
    this.pendingTimeouts.forEach(id => clearTimeout(id));
    this.pendingTimeouts = [];
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Soft Tibetan singing bowl / chime for milestones or insights
  playChime(pitch: number = 440, duration: number = 1.6) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, this.ctx.currentTime + duration * 0.1);
      osc.frequency.exponentialRampToValueAtTime(pitch, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy or browser restriction
    }
  }

  // Game click / card tap
  playSoftTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // ignore
    }
  }

  // Bilateral Butterfly Tap with Stereo Panning (Left ear vs Right ear)
  playBilateralTap(isLeft: boolean) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = isLeft ? 392 : 440; // G4 vs A4 gentle woodblock/calm chime
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      const ctx = this.ctx;
      if (typeof ctx.createStereoPanner === 'function') {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(isLeft ? -0.85 : 0.85, now);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  // Soft sand raking sound
  playRakeSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Deep organic stone plop
  playStonePlop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  // Somatic Shake / Rattle Sound (releasing tension)
  playShakeRattle() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // White noise burst simulating shaker/sigh
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  // Smooth breath / whoosh sound
  playWhoosh() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // ignore
    }
  }

  // Pop sound
  playPop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  // Retro Coin Collect (XP / Awareness Point earned)
  playCoinSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // ignore
    }
  }

  // Combo Streak (Pitch scales with streak multiplier)
  playComboSound(streak: number = 1) {
    if (!this.enabled) return;
    const basePitches = [523, 587, 659, 698, 784, 880, 988, 1046];
    const pitch = basePitches[Math.min(streak, basePitches.length - 1)];
    this.playChime(pitch, 0.6);
  }

  // Heartbeat sound
  playHeartbeat() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const playThump = (time: number, freq: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(time);
        osc.stop(time + 0.12);
      };

      playThump(now, 75);
      playThump(now + 0.15, 60);
    } catch {
      // ignore
    }
  }

  // Level Up / Win Fanfare
  playLevelUpFanfare() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 1.2);
      }, idx * 130);
    });
  }

  // Rewind Tape Sound
  playRewindSound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(900, now + 0.25);
      osc.frequency.linearRampToValueAtTime(350, now + 0.5);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore
    }
  }

  // Optional harmonic audio feedback chime (C5, E5, G5)
  playHarmonicAffirmation() {
    if (!this.enabled) return;
    this.clearPendingTimeouts();
    this.playChime(523.25, 1.2);
    const t1 = window.setTimeout(() => this.playChime(659.25, 1.4), 120);
    const t2 = window.setTimeout(() => this.playChime(783.99, 1.8), 240);
    this.pendingTimeouts.push(t1, t2);
  }

  // Success / completion chime
  playSuccess() {
    this.playHarmonicAffirmation();
  }

  // Deep breath in / out chime
  playBreathBell(isIn: boolean) {
    if (!this.enabled) return;
    const baseFreq = isIn ? 320 : 240;
    this.playChime(baseFreq, 2.5);
  }

  // Paper shredding / crumpling sound (tactile thought shredder)
  playPaperShred() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.35;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(700, now + 0.18);
      filter.Q.setValueAtTime(1.8, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.18);
    } catch {
      // ignore
    }
  }

  // Compass magnetic needle tick
  playCompassTick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  // Gentle balance scale weight shift / clink
  playScaleTilt() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.12);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  // Warm campfire / flame ignition whoosh & chime for daily streak
  playFlameIgnite() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Chord 1: Low warm whoosh (triangle)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.exponentialRampToValueAtTime(420, now + 0.25);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Chord 2: Sparkling higher harmonic (sine chime)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.08); // C5
      osc2.frequency.setValueAtTime(659.25, now + 0.16); // E5
      osc2.frequency.setValueAtTime(783.99, now + 0.24); // G5
      gain2.gain.setValueAtTime(0.001, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.14, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.65);
    } catch {
      // ignore
    }
  }

  // Plucked harp / kora string for the mental loom
  playLoomString(noteIndex: number = 0) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Pentatonic warm scale: C4, D4, E4, G4, A4, C5, D5, E5
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      const freq = scale[Math.abs(noteIndex) % scale.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // Gentle string decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // ignore
    }
  }

  // Audio distortion / defusion for inner critic echo chamber
  playEchoDistort(type: 'cartoon' | 'radio' | 'water' | 'mentor' = 'cartoon') {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (type === 'cartoon') {
        // High squeaky funny chirp
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(1400, now + 0.15);
        osc.frequency.linearRampToValueAtTime(1100, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      } else if (type === 'radio') {
        // Distant bandpass hum
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.4);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      } else if (type === 'water') {
        // Low bubbling wash
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      } else {
        // Warm mentor affirmation chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // ignore
    }
  }

  // Relaxing trickling sand sound for worry hourglass
  playSandTrickle() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.3);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  // Delicate blossom chime for gratitude tree
  playBloomChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch {
      // ignore
    }
  }

  // Cozy wooden clink for mindful shelf organizer
  playWoodClink() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }

  // Tactile stone tap for zen balancing stones
  playStoneClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // ignore
    }
  }

  // Satisfying liquid pouring and bubbling for emotion color sort
  playWaterPour() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Bubble 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(340, now);
      osc1.frequency.exponentialRampToValueAtTime(620, now + 0.1);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Bubble 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(420, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(780, now + 0.2);
      gain2.gain.setValueAtTime(0.09, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.22);
    } catch {
      // ignore
    }
  }

  // Crisp lock/snap when a puzzle piece clicks into place
  playPuzzleSnap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  playCorrect() {
    this.playSuccess();
  }

  playIncorrect() {
    this.playRewindSound();
  }

  playClick() {
    this.playSoftTap();
  }

  playHint() {
    this.playCompassTick();
  }

  // ============================================================================
  // Ambient Soundscape Synthesizer ('off' | 'rain' | 'forest' | 'waves')
  // ============================================================================

  public getSoundscape(): AmbientSoundscapeId {
    return this.currentSoundscape;
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
  }

  public isSoundscapeActive(): boolean {
    return this._enabled && this.currentSoundscape !== 'off';
  }

  public setAmbientVolume(volume: number) {
    const clamped = Math.min(1, Math.max(0.05, volume));
    this.ambientVolume = clamped;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AMBIENT_VOLUME_STORAGE_KEY, String(clamped));
      } catch {
        // ignore
      }
    }

    if (this.ctx && this.ambientMasterGain) {
      const now = this.ctx.currentTime;
      this.ambientMasterGain.gain.cancelScheduledValues(now);
      this.ambientMasterGain.gain.setTargetAtTime(clamped * 0.38, now, 0.08);
    }

    this.notifyListeners();
  }

  public setSoundscape(id: AmbientSoundscapeId) {
    this.currentSoundscape = id;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SOUNDSCAPE_STORAGE_KEY, id);
      } catch {
        // ignore
      }
    }

    if (id === 'off' || !this._enabled) {
      this.teardownAmbient(true);
    } else {
      this.startAmbientEngine(id);
    }

    this.notifyListeners();
  }

  public toggleSoundscape(id: AmbientSoundscapeId): AmbientSoundscapeId {
    const next = this.currentSoundscape === id ? 'off' : id;
    this.setSoundscape(next);
    return next;
  }

  private getPinkNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.pinkNoiseBuffer) return this.pinkNoiseBuffer;

    const durationSeconds = 6;
    const length = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
      // Crossfade final 0.15s into start for a seamless loop
      const fadeSamples = Math.floor(this.ctx.sampleRate * 0.15);
      for (let i = 0; i < fadeSamples; i++) {
        const alpha = i / fadeSamples;
        const endIdx = length - fadeSamples + i;
        data[endIdx] = data[endIdx] * (1 - alpha) + data[i] * alpha;
      }
    }

    this.pinkNoiseBuffer = buffer;
    return buffer;
  }

  private getBrownNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    if (this.brownNoiseBuffer) return this.brownNoiseBuffer;

    const durationSeconds = 6;
    const length = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lastOut = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.2;
      }
      const fadeSamples = Math.floor(this.ctx.sampleRate * 0.15);
      for (let i = 0; i < fadeSamples; i++) {
        const alpha = i / fadeSamples;
        const endIdx = length - fadeSamples + i;
        data[endIdx] = data[endIdx] * (1 - alpha) + data[i] * alpha;
      }
    }

    this.brownNoiseBuffer = buffer;
    return buffer;
  }

  private teardownAmbient(fadeOut = true) {
    const cleanup = this.stopCurrentAmbientNodes;
    const master = this.ambientMasterGain;
    this.stopCurrentAmbientNodes = null;
    this.ambientMasterGain = null;
    this.activeRenderedSoundscape = 'off';

    if (!cleanup) return;

    if (fadeOut && this.ctx && master) {
      try {
        const now = this.ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
        master.gain.linearRampToValueAtTime(0.0001, now + 0.35);
        window.setTimeout(() => {
          cleanup();
        }, 380);
        return;
      } catch {
        // fallback to immediate cleanup
      }
    }
    cleanup();
  }

  private startAmbientEngine(id: AmbientSoundscapeId) {
    if (id === 'off' || !this._enabled) return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      this.teardownAmbient(true);

      const ctx = this.ctx;
      const now = ctx.currentTime;
      const master = ctx.createGain();
      const targetGain = this.ambientVolume * 0.38;
      master.gain.setValueAtTime(0.0001, now);
      master.gain.linearRampToValueAtTime(targetGain, now + 0.65);
      master.connect(ctx.destination);

      const disposables: Array<{ stop?: () => void; disconnect?: () => void }> = [master];
      const timers: number[] = [];
      let disposed = false;

      if (id === 'rain') {
        const pink = this.getPinkNoiseBuffer();
        if (!pink) return;

        // Warm steady rainfall bed
        const rainBed = ctx.createBufferSource();
        rainBed.buffer = pink;
        rainBed.loop = true;

        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(240, now);

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(1450, now);

        const bedGain = ctx.createGain();
        bedGain.gain.setValueAtTime(0.62, now);

        rainBed.connect(hp);
        hp.connect(lp);
        lp.connect(bedGain);
        bedGain.connect(master);
        rainBed.start(now);

        // Soft upper window-patter layer modulated by a gentle LFO
        const patterSrc = ctx.createBufferSource();
        patterSrc.buffer = pink;
        patterSrc.loop = true;
        patterSrc.playbackRate.setValueAtTime(1.08, now);

        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(2400, now);
        bp.Q.setValueAtTime(0.85, now);

        const patterGain = ctx.createGain();
        patterGain.gain.setValueAtTime(0.22, now);

        const lfo = ctx.createOscillator();
        const lfoDepth = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.08, now);
        lfoDepth.gain.setValueAtTime(0.08, now);
        lfo.connect(lfoDepth);
        lfoDepth.connect(patterGain.gain);

        patterSrc.connect(bp);
        bp.connect(patterGain);
        patterGain.connect(master);

        patterSrc.start(now);
        lfo.start(now);

        disposables.push(rainBed, hp, lp, bedGain, patterSrc, bp, patterGain, lfo, lfoDepth);

        // Subtle individual water droplets
        const scheduleDroplet = () => {
          if (disposed || !this.ctx || !this._enabled) return;
          const delayMs = 220 + Math.random() * 580;
          const timer = window.setTimeout(() => {
            if (disposed || !this.ctx || !this._enabled) return;
            try {
              const t = ctx.currentTime;
              const dropOsc = ctx.createOscillator();
              const dropGain = ctx.createGain();
              const baseFreq = 900 + Math.random() * 1100;

              dropOsc.type = 'sine';
              dropOsc.frequency.setValueAtTime(baseFreq, t);
              dropOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, t + 0.045);

              dropGain.gain.setValueAtTime(0.0001, t);
              dropGain.gain.linearRampToValueAtTime(0.025 + Math.random() * 0.025, t + 0.008);
              dropGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);

              if (typeof ctx.createStereoPanner === 'function') {
                const pan = ctx.createStereoPanner();
                pan.pan.setValueAtTime(Math.random() * 1.4 - 0.7, t);
                dropOsc.connect(dropGain);
                dropGain.connect(pan);
                pan.connect(master);
              } else {
                dropOsc.connect(dropGain);
                dropGain.connect(master);
              }

              dropOsc.start(t);
              dropOsc.stop(t + 0.07);
            } catch {
              // ignore droplet error
            }
            scheduleDroplet();
          }, delayMs);
          timers.push(timer);
        };
        scheduleDroplet();
      } else if (id === 'forest') {
        const pink = this.getPinkNoiseBuffer();
        const brown = this.getBrownNoiseBuffer();
        if (!pink || !brown) return;

        // Rustling canopy breeze
        const windSrc = ctx.createBufferSource();
        windSrc.buffer = pink;
        windSrc.loop = true;

        const canopyFilter = ctx.createBiquadFilter();
        canopyFilter.type = 'bandpass';
        canopyFilter.frequency.setValueAtTime(520, now);
        canopyFilter.Q.setValueAtTime(1.3, now);

        const breezeLfo = ctx.createOscillator();
        const breezeDepth = ctx.createGain();
        breezeLfo.type = 'sine';
        breezeLfo.frequency.setValueAtTime(0.065, now);
        breezeDepth.gain.setValueAtTime(210, now);
        breezeLfo.connect(breezeDepth);
        breezeDepth.connect(canopyFilter.frequency);

        const windGain = ctx.createGain();
        windGain.gain.setValueAtTime(0.55, now);

        windSrc.connect(canopyFilter);
        canopyFilter.connect(windGain);
        windGain.connect(master);

        // Soft warm forest floor resonance
        const earthSrc = ctx.createBufferSource();
        earthSrc.buffer = brown;
        earthSrc.loop = true;

        const earthLp = ctx.createBiquadFilter();
        earthLp.type = 'lowpass';
        earthLp.frequency.setValueAtTime(210, now);

        const earthGain = ctx.createGain();
        earthGain.gain.setValueAtTime(0.28, now);

        earthSrc.connect(earthLp);
        earthLp.connect(earthGain);
        earthGain.connect(master);

        windSrc.start(now);
        breezeLfo.start(now);
        earthSrc.start(now);

        disposables.push(
          windSrc,
          canopyFilter,
          breezeLfo,
          breezeDepth,
          windGain,
          earthSrc,
          earthLp,
          earthGain
        );

        // Gentle, distant songbird phrases
        const scheduleBirdsong = () => {
          if (disposed || !this.ctx || !this._enabled) return;
          const delayMs = 3000 + Math.random() * 4500;
          const timer = window.setTimeout(() => {
            if (disposed || !this.ctx || !this._enabled) return;
            try {
              const t = ctx.currentTime;
              const notesCount = 2 + Math.floor(Math.random() * 2);
              const panValue = Math.random() * 1.5 - 0.75;
              const basePitch = 1750 + Math.random() * 650;

              for (let n = 0; n < notesCount; n++) {
                const start = t + n * 0.16;
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                const f0 = basePitch * (n % 2 === 0 ? 1 : 1.18);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(f0, start);
                osc.frequency.exponentialRampToValueAtTime(f0 * 1.12, start + 0.06);
                osc.frequency.exponentialRampToValueAtTime(f0 * 0.96, start + 0.13);

                g.gain.setValueAtTime(0.0001, start);
                g.gain.linearRampToValueAtTime(0.032, start + 0.025);
                g.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);

                if (typeof ctx.createStereoPanner === 'function') {
                  const pan = ctx.createStereoPanner();
                  pan.pan.setValueAtTime(panValue, start);
                  osc.connect(g);
                  g.connect(pan);
                  pan.connect(master);
                } else {
                  osc.connect(g);
                  g.connect(master);
                }

                osc.start(start);
                osc.stop(start + 0.15);
              }
            } catch {
              // ignore bird chirp error
            }
            scheduleBirdsong();
          }, delayMs);
          timers.push(timer);
        };
        scheduleBirdsong();
      } else if (id === 'waves') {
        const brown = this.getBrownNoiseBuffer();
        const pink = this.getPinkNoiseBuffer();
        if (!brown || !pink) return;

        // Deep rolling ocean swell (~9.5s slow breathing cycle)
        const swellSrc = ctx.createBufferSource();
        swellSrc.buffer = brown;
        swellSrc.loop = true;

        const swellFilter = ctx.createBiquadFilter();
        swellFilter.type = 'lowpass';
        swellFilter.frequency.setValueAtTime(340, now);

        const swellGain = ctx.createGain();
        swellGain.gain.setValueAtTime(0.55, now);

        const waveLfo = ctx.createOscillator();
        waveLfo.type = 'sine';
        waveLfo.frequency.setValueAtTime(0.105, now);

        const filterMod = ctx.createGain();
        filterMod.gain.setValueAtTime(220, now);
        waveLfo.connect(filterMod);
        filterMod.connect(swellFilter.frequency);

        const ampMod = ctx.createGain();
        ampMod.gain.setValueAtTime(0.32, now);
        waveLfo.connect(ampMod);
        ampMod.connect(swellGain.gain);

        swellSrc.connect(swellFilter);
        swellFilter.connect(swellGain);
        swellGain.connect(master);

        // Soft shoreline foam wash
        const foamSrc = ctx.createBufferSource();
        foamSrc.buffer = pink;
        foamSrc.loop = true;

        const foamBand = ctx.createBiquadFilter();
        foamBand.type = 'bandpass';
        foamBand.frequency.setValueAtTime(950, now);
        foamBand.Q.setValueAtTime(0.7, now);

        const foamGain = ctx.createGain();
        foamGain.gain.setValueAtTime(0.18, now);

        const foamLfo = ctx.createOscillator();
        const foamMod = ctx.createGain();
        foamLfo.type = 'sine';
        foamLfo.frequency.setValueAtTime(0.105, now);
        foamMod.gain.setValueAtTime(0.14, now);
        foamLfo.connect(foamMod);
        foamMod.connect(foamGain.gain);

        foamSrc.connect(foamBand);
        foamBand.connect(foamGain);
        foamGain.connect(master);

        swellSrc.start(now);
        foamSrc.start(now);
        waveLfo.start(now);
        foamLfo.start(now + 0.6);

        disposables.push(
          swellSrc,
          swellFilter,
          swellGain,
          waveLfo,
          filterMod,
          ampMod,
          foamSrc,
          foamBand,
          foamGain,
          foamLfo,
          foamMod
        );
      }

      this.ambientMasterGain = master;
      this.activeRenderedSoundscape = id;
      this.stopCurrentAmbientNodes = () => {
        disposed = true;
        timers.forEach((t) => window.clearTimeout(t));
        disposables.forEach((node) => {
          try {
            if (typeof node.stop === 'function') node.stop();
          } catch {
            // ignore already stopped
          }
          try {
            if (typeof node.disconnect === 'function') node.disconnect();
          } catch {
            // ignore disconnect error
          }
        });
      };
    } catch {
      // Browser audio restriction fallback
    }
  }
}

export const soundManager = new SoundManager();
