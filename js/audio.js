// AudioManager - Web Audio API with silent fallback
export class AudioManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      this.enabled = false;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  play(type) {
    if (!this.enabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      switch (type) {
        case 'kick': this._kick(); break;
        case 'goal': this._goal(); break;
        case 'save': this._save(); break;
        case 'miss': this._miss(); break;
        case 'whistle': this._whistle(); break;
        case 'countdown': this._beep(440); break;
        case 'victory': this._victory(); break;
        case 'crowd': this._crowd(); break;
        case 'click': this._click(); break;
      }
    } catch (e) { /* silent */ }
  }

  _osc(freq, type, duration, gain = 0.15, detune = 0) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    g.gain.setValueAtTime(gain, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start();
    o.stop(this.ctx.currentTime + duration);
  }

  _kick() {
    this._osc(80, 'sine', 0.15, 0.3);
    this._osc(120, 'triangle', 0.1, 0.15);
  }

  _goal() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this._osc(f, 'square', 0.2, 0.12), i * 80);
    });
    this._crowd();
  }

  _save() {
    this._osc(200, 'sawtooth', 0.2, 0.15);
    this._osc(150, 'triangle', 0.25, 0.1);
  }

  _miss() {
    this._osc(180, 'sawtooth', 0.3, 0.12);
    setTimeout(() => this._osc(100, 'sine', 0.4, 0.1), 100);
  }

  _whistle() {
    this._osc(1200, 'sine', 0.4, 0.1);
    setTimeout(() => this._osc(1400, 'sine', 0.3, 0.08), 150);
  }

  _beep(freq) {
    this._osc(freq, 'sine', 0.15, 0.12);
  }

  _victory() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      setTimeout(() => this._osc(f, 'square', 0.25, 0.1), i * 120);
    });
  }

  _crowd() {
    // Simple noise-like cheer
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this._osc(200 + Math.random() * 400, 'sawtooth', 0.3, 0.03);
      }, i * 50);
    }
  }

  _click() {
    this._osc(800, 'sine', 0.05, 0.08);
  }
}
