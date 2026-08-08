/**
 * Synthesized nature ambience using the Web Audio API.
 *
 * No audio asset ships with this repo (and shipping a real nature track
 * raises licensing questions), so we SYNTHESIZE a gentle bed: low-pass
 * filtered brown noise shaped to sit somewhere between soft rain and wind.
 * It is clearly labelled as placeholder in the UI — swap in a real,
 * licensed nature recording later.
 *
 * Every Web Audio call is guarded so the app never crashes on a device
 * (or a headless browser) where AudioContext is unavailable or blocked.
 */

type AudioContextCtor = typeof AudioContext;

function getAudioContextCtor(): AudioContextCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: AudioContextCtor })
      .webkitAudioContext
  );
}

export interface AmbiencePlayer {
  /** False when the Web Audio API is unavailable on this device. */
  readonly supported: boolean;
  /** Start (or resume) the ambient bed. Safe to call repeatedly. */
  start: () => void;
  /** Stop the ambient bed. Safe to call repeatedly. */
  stop: () => void;
  /** Set output volume, 0..1. */
  setVolume: (v: number) => void;
  /** Tear everything down (closes the AudioContext). */
  dispose: () => void;
}

/**
 * Fills an AudioBuffer with soft brown noise (integrated white noise),
 * which sounds far gentler and more "natural" than raw white noise.
 */
function fillBrownNoise(buffer: AudioBuffer): void {
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5; // compensate for the low amplitude of brown noise
  }
}

export function createAmbience(initialVolume: number): AmbiencePlayer {
  const Ctor = getAudioContextCtor();

  if (!Ctor) {
    // Graceful no-op player on unsupported / headless environments.
    return {
      supported: false,
      start() {},
      stop() {},
      setVolume() {},
      dispose() {},
    };
  }

  let ctx: AudioContext | null = null;
  let source: AudioBufferSourceNode | null = null;
  let gain: GainNode | null = null;
  let volume = initialVolume;
  let running = false;

  const ensureCtx = (): AudioContext => {
    if (!ctx) ctx = new Ctor();
    return ctx;
  };

  const start = (): void => {
    try {
      const context = ensureCtx();
      // Browsers suspend contexts created outside a user gesture.
      if (context.state === 'suspended') void context.resume();
      if (running) return;

      const buffer = context.createBuffer(
        1,
        Math.floor(context.sampleRate * 4),
        context.sampleRate
      );
      fillBrownNoise(buffer);

      source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Soft low-pass to round off the harshness → "rain / wind" character.
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 520;
      filter.Q.value = 0.6;

      gain = context.createGain();
      gain.gain.value = volume;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start();
      running = true;
    } catch {
      /* audio blocked / unavailable — degrade silently */
      running = false;
    }
  };

  const stop = (): void => {
    try {
      if (source) {
        source.stop();
      }
    } catch {
      /* already stopped */
    }
    try {
      source?.disconnect();
      gain?.disconnect();
    } catch {
      /* ignore */
    }
    source = null;
    gain = null;
    running = false;
  };

  const setVolume = (v: number): void => {
    volume = v;
    try {
      if (gain && ctx) {
        gain.gain.setTargetAtTime(v, ctx.currentTime, 0.05);
      }
    } catch {
      /* ignore */
    }
  };

  const dispose = (): void => {
    stop();
    try {
      void ctx?.close();
    } catch {
      /* ignore */
    }
    ctx = null;
  };

  return { supported: true, start, stop, setVolume, dispose };
}
