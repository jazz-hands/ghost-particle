// D-025: every cue is synthesised. No audio files are shipped.

const HUM_LOW_HZ = 46;
const HUM_HIGH_HZ = 138;
const HUM_PEAK = 0.16;
const NOISE_SECONDS = 1;
const TICK_BASE_SECONDS = 0.5;
const TICK_MIN_SECONDS = 0.06;
const WHOOSH_SECONDS = 0.9;
// The pass-through blip: high and short, stepping through a few pitches so a run of
// obstacles does not read as one repeated sample.
const THWIP_HZ = 2400;
const THWIP_STEPS = [1, 1.122, 1.26, 1.122];
const THWIP_SECONDS = 0.045;
// The flavor card's climb (3.6): a low pad walking up an octave and a half.
const RISE_LOW_HZ = 180;
const RISE_HIGH_HZ = 900;
const RISING_SECONDS = 4;
// Three ascending notes, the last left to ring (3.7).
const TADA_NOTES = [
  { hz: 523.25, delay: 0, decay: 0.22 },
  { hz: 659.25, delay: 0.12, decay: 0.22 },
  { hz: 783.99, delay: 0.24, decay: 0.9 },
] as const;

// Level 6's field (6.1): the charge hum held far down as a bed under the fill, lifting a
// little as the map crowds, and never near the charge hum's own peak.
const FIELD_HUM_LOW = 0.06;
const FIELD_HUM_HIGH = 0.2;
// Single ticks as batches land, never a loop: wide at the start of the rush and no tighter
// than a quarter second at its densest.
const BATCH_TICK_WIDE = 0.8;
const BATCH_TICK_TIGHT = 0.25;
// The swell into the glow (6.3): a pad climbing an octave and a fifth, arriving late so it
// peaks with the light rather than ahead of it.
const SWELL_SECONDS = 2.5;
const SWELL_LOW_HZ = 110;
const SWELL_HIGH_HZ = 330;
const SWELL_PEAK = 0.17;
const SWELL_CURVE = 2.2;
const SWELL_RELEASE = 1.2;

const clamp01 = (v: number): number => Math.min(Math.max(v, 0), 1);

/** The charge hum's pitch, bent so the last part of the hold still climbs audibly. */
export function humFrequency(level: number): number {
  return HUM_LOW_HZ + (HUM_HIGH_HZ - HUM_LOW_HZ) * clamp01(level) ** 1.3;
}

/** Zero is silence, not a quiet hum: 1.4 ends with nothing sounding. */
export function humVolume(level: number): number {
  const l = clamp01(level);
  return l === 0 ? 0 : HUM_PEAK * (0.3 + 0.7 * l);
}

/** The counter's click spacing. Rate 1 is the level 2 loop; level 4 speeds it with the meter. */
export function tickSeconds(rate: number): number {
  const r = Number.isFinite(rate) && rate > 0 ? rate : 1;
  return Math.max(TICK_BASE_SECONDS / r, TICK_MIN_SECONDS);
}

/** The pass-through blip's pitch for the nth pass; the cycle keeps a run of them alive. */
export function thwipPitch(n: number): number {
  const i = Number.isFinite(n) ? Math.floor(n) : 0;
  const step = THWIP_STEPS[((i % THWIP_STEPS.length) + THWIP_STEPS.length) % THWIP_STEPS.length]!;
  return THWIP_HZ * step;
}

/** The rising tone's pitch a fraction u through its climb; geometric, so it reads as steady. */
export function risingToneFrequency(u: number): number {
  return RISE_LOW_HZ * (RISE_HIGH_HZ / RISE_LOW_HZ) ** clamp01(u);
}

/** The fanfare: three ascending notes, staggered, the last one ringing on. */
export function tadaNotes(): readonly { hz: number; delay: number; decay: number }[] {
  return TADA_NOTES;
}

/** The fill's bed hum: low the whole way, lifting as the map fills. */
export function fieldHumLevel(u: number): number {
  return FIELD_HUM_LOW + (FIELD_HUM_HIGH - FIELD_HUM_LOW) * clamp01(u);
}

/** The gap between batch ticks a fraction u into the rush; never tighter than a quarter second. */
export function batchTickSpacing(u: number): number {
  return BATCH_TICK_WIDE - (BATCH_TICK_WIDE - BATCH_TICK_TIGHT) * clamp01(u);
}

/** The swell's pitch a fraction u through its rise; geometric, so it reads as one steady climb. */
export function swellFrequency(u: number): number {
  return SWELL_LOW_HZ * (SWELL_HIGH_HZ / SWELL_LOW_HZ) ** clamp01(u);
}

/** The swell's loudness through the same rise: held back early, full with the light. */
export function swellGain(u: number): number {
  return SWELL_PEAK * clamp01(u) ** SWELL_CURVE;
}

export class Cues {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private hums: { osc: OscillatorNode; sub: OscillatorNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private humLevel = -1;
  private ticker: ReturnType<typeof setInterval> | null = null;
  private lastBatchTick = -Infinity;

  /** The first Space keydown is the only gesture allowed to start audio (1.1). */
  unlock(): void {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    if (typeof AudioContext !== 'function') return;
    const ctx = new AudioContext();
    const out = ctx.createGain();
    out.gain.value = 0.9;
    out.connect(ctx.destination);
    this.ctx = ctx;
    this.out = out;
    void ctx.resume();
  }

  /** A held tone whose pitch and volume follow the charge; 0 silences it. */
  hum(level: number): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    if (!this.hums && level <= 0) return;
    if (Math.abs(level - this.humLevel) < 0.01) return;
    this.humLevel = level;

    if (!this.hums) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.value = 6;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain).connect(out);
      osc.start();
      sub.start();
      this.hums = { osc, sub, filter, gain };
    }

    const { osc, sub, filter, gain } = this.hums;
    const t = ctx.currentTime;
    const hz = humFrequency(level);
    osc.frequency.setTargetAtTime(hz, t, 0.06);
    sub.frequency.setTargetAtTime(hz / 2, t, 0.06);
    filter.frequency.setTargetAtTime(240 + 1400 * clamp01(level), t, 0.06);
    gain.gain.setTargetAtTime(humVolume(level), t, 0.07);
  }

  /** A short noisy burst: the fusion snap at 1.5. */
  crackle(): void {
    this.noiseBurst({ hz: 1500, q: 0.7, peak: 0.5, decay: 0.28 });
  }

  /** A soft bubble pop: a sine dropped fast through its own tail. */
  pop(): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);
    const gain = ctx.createGain();
    envelope(gain, t, 0.34, 0.006, 0.16);
    osc.connect(gain).connect(out);
    osc.start(t);
    osc.stop(t + 0.2);
    this.noiseBurst({ hz: 2600, q: 1.4, peak: 0.12, decay: 0.05 });
  }

  /** Two bell notes a fifth apart, the second a beat behind the first. */
  chime(): void {
    this.bell(784, 0, 0.22);
    this.bell(1175, 0.13, 0.16);
  }

  /** The UI confirm: one tiny high tick. */
  blip(): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1320, t);
    const gain = ctx.createGain();
    envelope(gain, t, 0.2, 0.004, 0.06);
    osc.connect(gain).connect(out);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  /** A soft click for counters and meters: one narrow, quiet noise tap. */
  tick(): void {
    this.noiseBurst({ hz: 2200, q: 2.4, peak: 0.055, decay: 0.03 });
  }

  /** The counter's click loop. Rate multiplies the pace; calling it again re-paces it. */
  startTicking(rate = 1): void {
    this.stopTicking();
    this.tick();
    this.ticker = setInterval(() => this.tick(), tickSeconds(rate) * 1000);
  }

  stopTicking(): void {
    if (this.ticker === null) return;
    clearInterval(this.ticker);
    this.ticker = null;
  }

  /** A filtered noise sweep: the pass between levels. */
  whoosh(seconds = WHOOSH_SECONDS): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx);
    src.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = 1.1;
    band.frequency.setValueAtTime(280, t);
    band.frequency.exponentialRampToValueAtTime(3000, t + seconds * 0.55);
    band.frequency.exponentialRampToValueAtTime(400, t + seconds);
    const gain = ctx.createGain();
    envelope(gain, t, 0.22, seconds * 0.4, seconds * 0.6);
    src.connect(band).connect(gain).connect(out);
    src.start(t);
    src.stop(t + seconds + 0.05);
  }

  /** A tiny high blip, played on every pass-through. */
  thwip(n = 0): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    const hz = thwipPitch(n);
    osc.frequency.setValueAtTime(hz, t);
    osc.frequency.exponentialRampToValueAtTime(hz * 0.6, t + THWIP_SECONDS);
    const gain = ctx.createGain();
    envelope(gain, t, 0.09, 0.002, THWIP_SECONDS);
    osc.connect(gain).connect(out);
    osc.start(t);
    osc.stop(t + THWIP_SECONDS + 0.05);
  }

  /** A pad that climbs for the length of a card: the flavor change at 3.6. */
  risingTone(seconds = RISING_SECONDS): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    envelope(gain, t, 0.1, seconds * 0.35, seconds * 0.65);
    gain.connect(out);
    for (const [partial, detune] of [[1, 0], [2, 6]] as const) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.detune.value = detune;
      // The ramp is sampled from the same curve the unit tests pin down.
      const steps = 24;
      for (let i = 0; i <= steps; i += 1) {
        const at = t + (seconds * i) / steps;
        const hz = risingToneFrequency(i / steps) * partial;
        if (i === 0) osc.frequency.setValueAtTime(hz, at);
        else osc.frequency.exponentialRampToValueAtTime(hz, at);
      }
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + seconds + 0.1);
    }
  }

  /** Three ascending bell notes: the burst out of the Sun. */
  tada(): void {
    for (const note of tadaNotes()) this.bell(note.hz, note.delay, 0.2, note.decay);
  }

  /** The bed under the level 6 fill: the hum held low, or null to let it go. */
  fieldHum(u: number | null): void {
    this.hum(u === null ? 0 : fieldHumLevel(u));
  }

  /** One soft tick as a batch of arrivals lands, rate-limited so a rush never becomes a loop. */
  batchTick(u = 1): void {
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.currentTime - this.lastBatchTick < batchTickSpacing(u)) return;
    this.lastBatchTick = ctx.currentTime;
    this.tick();
  }

  /** A pad that rises and blooms: the dots going up into one light. */
  swell(seconds = SWELL_SECONDS): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime;
    const span = Math.max(seconds, 0.1);
    const steps = 24;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    for (let i = 1; i <= steps; i += 1) {
      gain.gain.exponentialRampToValueAtTime(Math.max(swellGain(i / steps), 0.0001), t + (span * i) / steps);
    }
    gain.gain.exponentialRampToValueAtTime(0.0001, t + span + SWELL_RELEASE);
    gain.connect(out);
    // A fifth above the root, detuned a little, so the pad beats slowly instead of sitting still.
    for (const [partial, detune] of [[1, 0], [1.5, 8]] as const) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.detune.value = detune;
      for (let i = 0; i <= steps; i += 1) {
        const at = t + (span * i) / steps;
        const hz = swellFrequency(i / steps) * partial;
        if (i === 0) osc.frequency.setValueAtTime(hz, at);
        else osc.frequency.exponentialRampToValueAtTime(hz, at);
      }
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + span + SWELL_RELEASE + 0.1);
    }
  }

  private bell(hz: number, delay: number, peak: number, decay = 1.1): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime + delay;
    for (const [partial, share] of [[1, 1], [2.76, 0.3]] as const) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz * partial, t);
      const gain = ctx.createGain();
      envelope(gain, t, peak * share, 0.005, decay / partial);
      osc.connect(gain).connect(out);
      osc.start(t);
      osc.stop(t + decay + 0.2);
    }
  }

  private noiseBurst(o: { hz: number; q: number; peak: number; decay: number }): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx);
    src.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = o.hz;
    band.Q.value = o.q;
    const gain = ctx.createGain();
    envelope(gain, t, o.peak, 0.004, o.decay);
    src.connect(band).connect(gain).connect(out);
    src.start(t);
    src.stop(t + o.decay + 0.05);
  }

  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noise) return this.noise;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * NOISE_SECONDS), ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i += 1) samples[i] = Math.random() * 2 - 1;
    this.noise = buffer;
    return buffer;
  }
}

function envelope(gain: GainNode, t: number, peak: number, attack: number, decay: number): void {
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}
