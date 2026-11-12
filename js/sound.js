/**
 * SOUND EFFECTS SYNTHESIZER (WEB AUDIO API)
 * 100% Zero dependensi eksternal, disintesis secara matematis di browser.
 * Default mute, dapat diaktifkan lewat tombol audio toggle.
 */

const SoundFX = (function() {
  let audioCtx = null;
  let isSoundEnabled = localStorage.getItem('portfolio-sound') === 'true';

  function initAudio() {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.08, type = 'sine', gainVal = 0.05) {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Graceful fallback: do nothing if audio is blocked
    }
  }

  return {
    isEnabled: () => isSoundEnabled,
    toggle: () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('portfolio-sound', isSoundEnabled ? 'true' : 'false');
      if (isSoundEnabled) {
        initAudio();
        SoundFX.click();
      }
      return isSoundEnabled;
    },
    click: () => {
      playTone(480, 0.05, 'triangle', 0.04);
    },
    pop: () => {
      playTone(680, 0.08, 'sine', 0.05);
    },
    themeSwitch: () => {
      if (!isSoundEnabled) return;
      playTone(520, 0.06, 'sine', 0.04);
      setTimeout(() => playTone(780, 0.08, 'sine', 0.04), 60);
    },
    success: () => {
      if (!isSoundEnabled) return;
      playTone(523.25, 0.08, 'sine', 0.05); // C5
      setTimeout(() => playTone(659.25, 0.08, 'sine', 0.05), 80); // E5
      setTimeout(() => playTone(783.99, 0.12, 'sine', 0.05), 160); // G5
    },
    modalOpen: () => {
      playTone(400, 0.07, 'sine', 0.04);
    },
    modalClose: () => {
      playTone(320, 0.07, 'sine', 0.04);
    }
  };
})();

if (typeof window !== 'undefined') {
  window.SoundFX = SoundFX;
}
