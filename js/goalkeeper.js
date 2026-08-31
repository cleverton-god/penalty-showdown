// Zones: 0-8
// 0 1 2
// 3 4 5
// 6 7 8

const ZONE_SIDE = {
  0: 'left', 1: 'center', 2: 'right',
  3: 'left', 4: 'center', 5: 'right',
  6: 'left', 7: 'center', 8: 'right'
};

const ZONE_HEIGHT = {
  0: 'high', 1: 'high', 2: 'high',
  3: 'mid',  4: 'mid',  5: 'mid',
  6: 'low',  7: 'low',  8: 'low'
};

export class Goalkeeper {
  constructor() {
    this.el = null;
    this.currentDir = 'center';
  }

  setElement(el) {
    this.el = el;
  }

  chooseDive(shotZone) {
    // Lê o chute com frequência alta
    const readChance = 0.72;
    const side = ZONE_SIDE[shotZone] || 'center';
    const height = ZONE_HEIGHT[shotZone] || 'mid';

    let dive;
    if (Math.random() < readChance) {
      if (side === 'left') dive = 'left';
      else if (side === 'right') dive = 'right';
      else {
        if (height === 'high') dive = 'up';
        else if (height === 'low') dive = 'stay';
        else dive = Math.random() < 0.55 ? 'stay' : 'up';
      }
    } else {
      if (side === 'left') dive = ['right', 'up', 'stay'][Math.floor(Math.random() * 3)];
      else if (side === 'right') dive = ['left', 'up', 'stay'][Math.floor(Math.random() * 3)];
      else dive = Math.random() < 0.5 ? 'left' : 'right';
    }

    this.currentDir = dive;
    return dive;
  }

  _clearPose() {
    if (!this.el) return;
    this.el.classList.remove(
      'dive-left', 'dive-right', 'dive-up', 'dive-stay',
      'save-pose', 'celebrate', 'sad',
      'save-z0','save-z1','save-z2','save-z3','save-z4','save-z5','save-z6','save-z7','save-z8'
    );
  }

  _setMoveDuration(ms) {
    if (!this.el) return;
    const d = Math.max(280, Math.min(520, ms));
    this.el.style.transitionDuration = `${d}ms, ${d}ms, ${d}ms, 0.3s, 0.3s`;
    this.el.querySelectorAll('.gk-arm, .gk-leg').forEach(n => {
      n.style.transitionDuration = `${Math.round(d * 0.85)}ms`;
    });
  }

  animate(state, shotZone = null, durationMs = 400) {
    if (!this.el) return;
    this._clearPose();
    this._setMoveDuration(durationMs);

    if (state === 'left' || state === 'dive-left') {
      this.el.classList.add('dive-left');
    } else if (state === 'right' || state === 'dive-right') {
      this.el.classList.add('dive-right');
    } else if (state === 'up' || state === 'dive-up') {
      this.el.classList.add('dive-up');
    } else if (state === 'stay' || state === 'center') {
      this.el.classList.add('dive-stay');
    } else if (state === 'save') {
      const z = shotZone != null ? shotZone : 4;
      this.el.classList.add('save-pose', 'save-z' + z);
      this.currentDir = ZONE_SIDE[z] === 'center'
        ? (ZONE_HEIGHT[z] === 'high' ? 'up' : 'stay')
        : ZONE_SIDE[z];
    } else if (state === 'celebrate') {
      if (this.currentDir === 'left') this.el.classList.add('dive-left');
      else if (this.currentDir === 'right') this.el.classList.add('dive-right');
      else if (this.currentDir === 'up') this.el.classList.add('dive-up');
      else this.el.classList.add('dive-stay');
      this.el.classList.add('celebrate');
    } else if (state === 'sad') {
      this.el.classList.add('sad');
    }
  }

  reset() {
    if (this.el) {
      this._setMoveDuration(450);
      this._clearPose();
      setTimeout(() => {
        if (!this.el) return;
        this.el.style.transitionDuration = '';
        this.el.querySelectorAll('.gk-arm, .gk-leg').forEach(n => {
          n.style.transitionDuration = '';
        });
      }, 500);
    }
    this.currentDir = 'center';
  }

  isSave(shotZone, power, diveDir) {
    const shotSide = ZONE_SIDE[shotZone];
    const shotHeight = ZONE_HEIGHT[shotZone];
    const isCorner = [0, 2, 6, 8].includes(shotZone);

    let diveSide = 'center';
    if (diveDir === 'left') diveSide = 'left';
    else if (diveDir === 'right') diveSide = 'right';

    // Lado oposto — ainda raro, mas não impossível
    if (
      (shotSide === 'left' && diveSide === 'right') ||
      (shotSide === 'right' && diveSide === 'left')
    ) {
      return Math.random() < 0.10;
    }

    if (shotSide === 'center' && diveSide !== 'center') {
      return Math.random() < 0.16;
    }

    if (diveSide === 'center' && shotSide !== 'center') {
      return Math.random() < 0.22;
    }

    let saveChance;

    if (shotSide === 'center') {
      if (shotHeight === 'high') {
        saveChance = (diveDir === 'up') ? 0.74 : 0.38;
      } else if (shotHeight === 'low') {
        saveChance = (diveDir === 'stay' || diveDir === 'center') ? 0.70 : 0.42;
      } else {
        if (diveDir === 'stay' || diveDir === 'center') saveChance = 0.68;
        else if (diveDir === 'up') saveChance = 0.62;
        else saveChance = 0.18;
      }
      if (power >= 50 && power <= 78) saveChance -= 0.05;
      if (power > 90) saveChance += 0.04;
      if (power < 30) saveChance += 0.10;
    } else {
      // Lado correto — defende bastante
      saveChance = 0.80;
      if (shotHeight === 'high') saveChance -= 0.04;
      if (shotHeight === 'low') saveChance += 0.03;
      if (isCorner) saveChance -= 0.06;
      if (power >= 48 && power <= 72) saveChance -= 0.04;
      if (power > 90) saveChance += 0.03;
      if (power < 28) saveChance += 0.08;
    }

    saveChance = Math.max(0.12, Math.min(0.90, saveChance));
    return Math.random() < saveChance;
  }
}
