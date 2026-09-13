// D-025: every cue is synthesised. No audio files are shipped.

const HUM_LOW_HZ = 46;
const HUM_HIGH_HZ = 138;
const HUM_PEAK = 0.16;
const NOISE_SECONDS = 1;

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

export class Cues {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private hums: { osc: OscillatorNode; sub: OscillatorNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private humLevel = -1;

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

  private bell(hz: number, delay: number, peak: number): void {
    const ctx = this.ctx;
    const out = this.out;
    if (!ctx || !out) return;
    const t = ctx.currentTime + delay;
    for (const [partial, share] of [[1, 1], [2.76, 0.3]] as const) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz * partial, t);
      const gain = ctx.createGain();
      envelope(gain, t, peak * share, 0.005, 1.1 / partial);
      osc.connect(gain).connect(out);
      osc.start(t);
      osc.stop(t + 1.3);
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
