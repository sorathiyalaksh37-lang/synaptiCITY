/**
 * Synthesizes a subtle, soft "whoosh / air movement" sound using the Web Audio API.
 * Used for guided journey stage transitions and the "START THE RIDE" action.
 */
export const playWhooshSound = (soundEnabled: boolean = true): void => {
  if (!soundEnabled || typeof window === 'undefined') return;

  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return;

  try {
    const ctx = new AudioContextClass();

    // 350ms duration whoosh
    const duration = 0.35;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to sweep frequencies (soft air movement sound)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.5;

    const now = ctx.currentTime;
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.exponentialRampToValueAtTime(750, now + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(120, now + duration);

    // Envelope for subtle volume fade in and smooth fade out
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    // Cleanup audio context after playback ends
    window.setTimeout(() => {
      void ctx.close();
    }, Math.ceil((duration + 0.1) * 1000));
  } catch {
    // Fail silently if browser blocks audio context or audio is unsupported
  }
};
