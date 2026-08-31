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
    // ~48% de ler o chute certo
    const readChance = 0.48;
    const side = ZONE_SIDE[shotZone] || 'center';
    const height = ZONE_HEIGHT[shotZone] || 'mid';

    let dive;
    if (Math.random() < readChance) {
      if (side === 'left') dive = 'left';
      else if (side === 'right') dive = 'right';
      else {
        // Centro: escolhe pose pela altura
        if (height === 'high') dive = 'up';
        else if (height === 'low') dive = 'stay';
        else dive = Math.random() < 0.5 ? 'stay' : 'up';
      }
    } else {
      if (side === 'left') {
        dive = ['right', 'up', 'stay'][Math.floor(Math.random() * 3)];
      } else if (side === 'right') {
        dive = ['left', 'up', 'stay'][Math.floor(Math.random() * 3)];
      } else {
        // Errou o meio → vai pro lado
        dive = Math.random() < 0.5 ? 'left' : 'right';
      }
    }

    this.currentDir = dive;
    return dive;
  }

  animate(state) {
    if (!this.el) return;
    this.el.classList.remove('dive-left', 'dive-right', 'dive-up', 'dive-stay', 'celebrate', 'sad');

    if (state === 'left' || state === 'dive-left') {
      this.el.classList.add('dive-left');
    } else if (state === 'right' || state === 'dive-right') {
      this.el.classList.add('dive-right');
    } else if (state === 'up' || state === 'dive-up') {
      this.el.classList.add('dive-up');
    } else if (state === 'stay' || state === 'center') {
      this.el.classList.add('dive-stay');
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
      this.el.classList.remove('dive-left', 'dive-right', 'dive-up', 'dive-stay', 'celebrate', 'sad');
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

    // Lado oposto → quase impossível
    if (
      (shotSide === 'left' && diveSide === 'right') ||
      (shotSide === 'right' && diveSide === 'left')
    ) {
      return Math.random() < 0.02;
    }

    // Saiu do meio com bola no meio → quase nunca
    if (shotSide === 'center' && diveSide !== 'center') {
      return Math.random() < 0.04;
    }

    // Ficou no meio com bola no canto → raro
    if (diveSide === 'center' && shotSide !== 'center') {
      return Math.random() < 0.06;
    }

    let saveChance;

    if (shotSide === 'center') {
      // ===== BOLA NO MEIO + GOLEIRO NO MEIO =====
      // Mesmo no meio, NÃO é defesa garantida.
      // Força boa e altura “difícil” favorecem o gol.
      if (shotHeight === 'high') {
        // Alta: precisa pular
        saveChance = (diveDir === 'up') ? 0.45 : 0.12;
      } else if (shotHeight === 'low') {
        // Baixa: ficar no lugar ajuda, mas chute forte fura
        saveChance = (diveDir === 'stay' || diveDir === 'center') ? 0.40 : 0.18;
      } else {
        // Meia altura (zona 4): o mais comum
        if (diveDir === 'stay' || diveDir === 'center') saveChance = 0.35;
        else if (diveDir === 'up') saveChance = 0.30;
        else saveChance = 0.05;
      }

      // No meio, força no ponto doce reduz bastante a defesa
      if (power >= 50 && power <= 78) saveChance -= 0.14;
      if (power > 88) saveChance += 0.08; // chute estourado
      if (power < 28) saveChance += 0.18; // fraco demais
    } else {
      // Lado correto
      saveChance = 0.58;
      if (shotHeight === 'high') saveChance -= 0.10;
      if (shotHeight === 'low') saveChance += 0.04;
      if (isCorner) saveChance -= 0.12;
      if (power >= 48 && power <= 72) saveChance -= 0.10;
      if (power > 90) saveChance += 0.08;
      if (power < 25) saveChance += 0.12;
    }

    saveChance = Math.max(0.03, Math.min(0.72, saveChance));
    return Math.random() < saveChance;
  }
}
