// Web Audio API Synthesizers for cute & funny birthday sound effects
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isSongPlaying = false;
    this.songTimeout = null;
    this.currentNoteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Cute Pop / Click
  playPop() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Realistic / Funny Cat Meow
  playCatMeow() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc2.type = 'sine';

    // Pitch sweep for "Meee-ooo-ww"
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(820, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.55);

    osc2.frequency.setValueAtTime(450 * 2, now);
    osc2.frequency.exponentialRampToValueAtTime(820 * 2, now + 0.22);
    osc2.frequency.exponentialRampToValueAtTime(520 * 2, now + 0.55);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + 0.22);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.55);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.6);
    osc2.stop(now + 0.6);
  }

  // Funny Egg Crack Sound (Hairline Snap)
  playEggCrack() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3200;
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);

    // Click tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
    oscGain.gain.setValueAtTime(0.25, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Hilarious Egg Splat + Squelch Explosion
  playEggSplat() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    // 1. Heavy squelch / splat
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.28);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);

    // 2. Wet slap noise
    const bufferSize = this.ctx.sampleRate * 0.22;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // 3. Funny slide whistle after egg cracks!
    setTimeout(() => {
      if (this.isMuted) return;
      const t = this.ctx.currentTime;
      const whistle = this.ctx.createOscillator();
      const whistleGain = this.ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(400, t);
      whistle.frequency.exponentialRampToValueAtTime(1100, t + 0.35);

      whistleGain.gain.setValueAtTime(0.25, t);
      whistleGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      whistle.connect(whistleGain);
      whistleGain.connect(this.ctx.destination);
      whistle.start(t);
      whistle.stop(t + 0.4);
    }, 180);
  }

  // Blow out candles (wind puff + victory chime)
  playBlowCandles() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    // Wind puff
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    // Joy chime sequence
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => {
        if (this.isMuted) return;
        const chimeNow = this.ctx.currentTime;
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, chimeNow);
        chimeGain.gain.setValueAtTime(0.2, chimeNow);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, chimeNow + 0.5);
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(chimeNow);
        chime.stop(chimeNow + 0.5);
      }, 250 + idx * 80);
    });
  }

  // Party Horn Buzz (Kazoo celebration)
  playPartyHorn() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.linearRampToValueAtTime(360, now + 0.35);

    osc2.frequency.setValueAtTime(324, now); // slight detune
    osc2.frequency.linearRampToValueAtTime(365, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  // Synthesized polyphonic Happy Birthday Melody Loop
  toggleHappyBirthday(forceState = null) {
    if (forceState !== null) {
      this.isSongPlaying = !forceState;
    }
    if (this.isSongPlaying) {
      this.stopHappyBirthday();
    } else {
      this.startHappyBirthday();
    }
    return this.isSongPlaying;
  }

  startHappyBirthday() {
    this.init();
    this.isSongPlaying = true;
    this.currentNoteIndex = 0;
    this.playNextBirthdayNote();
  }

  stopHappyBirthday() {
    this.isSongPlaying = false;
    if (this.songTimeout) {
      clearTimeout(this.songTimeout);
      this.songTimeout = null;
    }
  }

  playNextBirthdayNote() {
    if (!this.isSongPlaying || this.isMuted) return;

    // Note frequencies in Hz
    // Key of C:
    // "Hap-py Birth-day to you" -> G4, G4, A4, G4, C5, B4
    // "Hap-py Birth-day to you" -> G4, G4, A4, G4, D5, C5
    // "Hap-py Birth-day dear [Name]" -> G4, G4, G5, E5, C5, B4, A4
    // "Hap-py Birth-day to you" -> F5, F5, E5, C5, D5, C5
    const G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33;
    const E5 = 659.25, F5 = 698.46, G5 = 783.99;

    const melody = [
      { note: G4, dur: 0.28, pause: 0.35 },
      { note: G4, dur: 0.28, pause: 0.35 },
      { note: A4, dur: 0.55, pause: 0.65 },
      { note: G4, dur: 0.55, pause: 0.65 },
      { note: C5, dur: 0.55, pause: 0.65 },
      { note: B4, dur: 0.95, pause: 1.15 },

      { note: G4, dur: 0.28, pause: 0.35 },
      { note: G4, dur: 0.28, pause: 0.35 },
      { note: A4, dur: 0.55, pause: 0.65 },
      { note: G4, dur: 0.55, pause: 0.65 },
      { note: D5, dur: 0.55, pause: 0.65 },
      { note: C5, dur: 0.95, pause: 1.15 },

      { note: G4, dur: 0.28, pause: 0.35 },
      { note: G4, dur: 0.28, pause: 0.35 },
      { note: G5, dur: 0.55, pause: 0.65 },
      { note: E5, dur: 0.55, pause: 0.65 },
      { note: C5, dur: 0.55, pause: 0.65 },
      { note: B4, dur: 0.55, pause: 0.65 },
      { note: A4, dur: 0.95, pause: 1.15 },

      { note: F5, dur: 0.28, pause: 0.35 },
      { note: F5, dur: 0.28, pause: 0.35 },
      { note: E5, dur: 0.55, pause: 0.65 },
      { note: C5, dur: 0.55, pause: 0.65 },
      { note: D5, dur: 0.55, pause: 0.65 },
      { note: C5, dur: 1.2, pause: 1.6 }
    ];

    const current = melody[this.currentNoteIndex];
    const now = this.ctx.currentTime;

    // Cheerful Marimba / Bell Synthesizer
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(current.note, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(current.note * 2, now); // shimmer octave

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + current.dur);
    osc2.stop(now + current.dur);

    this.currentNoteIndex = (this.currentNoteIndex + 1) % melody.length;
    this.songTimeout = setTimeout(() => {
      this.playNextBirthdayNote();
    }, current.pause * 1000);
  }
}

// Global Sound Instance
window.sounds = new SoundEngine();
