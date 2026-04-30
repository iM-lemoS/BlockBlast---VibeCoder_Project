/**
 * Zen Sound Engine — synthesizes all sounds via Web Audio API.
 * No audio files required; works fully offline.
 */
let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playNote(freq, type, duration, volume, delay = 0) {
  try {
    const ac = getCtx();
    const now = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch (_) { /* AudioContext blocked — ignore */ }
}

/** Soft wooden tap when lifting a shape */
export function playPickup() {
  playNote(480, 'triangle', 0.1, 0.15);
}

/** Gentle marimba thud when placing a shape */
export function playPlace() {
  playNote(220, 'triangle', 0.28, 0.2);
  playNote(330, 'triangle', 0.18, 0.08, 0.04);
}

/** Ascending chime scale — more notes for more lines cleared */
export function playClear(lineCount = 1) {
  const scale = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  scale.slice(0, Math.min(lineCount + 1, 4)).forEach((freq, i) => {
    playNote(freq, 'sine', 0.55, 0.16, i * 0.1);
  });
}

/** Soft acoustic fade for session end */
export function playEnd() {
  [440, 349.23, 261.63].forEach((freq, i) => {
    playNote(freq, 'sine', 0.85, 0.12, i * 0.22);
  });
}
