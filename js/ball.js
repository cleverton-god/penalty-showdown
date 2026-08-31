export class Ball {
  constructor() {
    this.el = null;
    this.shadow = null;
  }

  setElement(el) {
    this.el = el;
    this.shadow = el?.querySelector('.ball-shadow');
  }

  reset() {
    if (!this.el) return;
    this.el.style.transition = 'none';
    this.el.style.left = '50%';
    this.el.style.bottom = '-10%';
    this.el.style.top = 'auto';
    this.el.style.transform = 'translateX(-50%) scale(1)';
    this.el.style.opacity = '1';
    if (this.shadow) {
      this.shadow.style.opacity = '1';
      this.shadow.style.transform = 'translateX(-50%) scale(1)';
    }
    const inner = this.el.querySelector('.ball-inner');
    if (inner) inner.style.animation = '';
  }

  shoot(zone, power, result, diveDir = 'stay', durationMs = null) {
    return new Promise(resolve => {
      if (!this.el) { resolve(); return; }

      const zonePos = {
        0: { x: 22, y: 28 },
        1: { x: 50, y: 24 },
        2: { x: 78, y: 28 },
        3: { x: 20, y: 48 },
        4: { x: 50, y: 50 },
        5: { x: 80, y: 48 },
        6: { x: 22, y: 68 },
        7: { x: 50, y: 72 },
        8: { x: 78, y: 68 }
      };

      let targetX = zonePos[zone]?.x ?? 50;
      let targetY = zonePos[zone]?.y ?? 50;

      if (result === 'miss') {
        const side = Math.random();
        if (side < 0.35) { targetX = 5; targetY = 40 + Math.random() * 30; }
        else if (side < 0.7) { targetX = 95; targetY = 40 + Math.random() * 30; }
        else { targetX = 30 + Math.random() * 40; targetY = 8; }
      }

      const duration = durationMs ?? Math.max(400, 700 - power * 2.8);
      const scale = 0.55 + (targetY / 100) * 0.25;

      if (result === 'save') {
        // // Bola encontra as luvas na zona
        const saveX = targetX;
        const saveY = targetY + 2;
        this._animateTo(saveX, saveY, duration, 0.7, () => {
          this._animateTo(saveX, saveY + 3, 180, 0.6, resolve);
        });
        return;
      }

      if (result === 'goal' && Math.abs(targetX - 50) < 8) {
        targetX += (Math.random() < 0.5 ? -7 : 7);
      }

      this._animateTo(targetX, targetY, duration, scale, () => {
        if (result === 'goal') this.el.style.opacity = '0.65';
        resolve();
      });
    });
  }

  _animateTo(leftPct, topPct, duration, scale, onDone) {
    const bottomPct = 100 - topPct;
    this.el.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    this.el.style.left = `${leftPct}%`;
    this.el.style.bottom = `${bottomPct}%`;
    this.el.style.top = 'auto';
    this.el.style.transform = `translate(-50%, 50%) scale(${scale})`;

    if (this.shadow) {
      this.shadow.style.transition = `all ${duration}ms ease`;
      this.shadow.style.transform = `translateX(-50%) scale(${scale * 0.75})`;
      this.shadow.style.opacity = String(0.25 + scale * 0.3);
    }

    const inner = this.el.querySelector('.ball-inner');
    if (inner) {
      inner.style.animation = `ballSpin ${duration}ms linear`;
    }

    setTimeout(() => {
      if (inner) inner.style.animation = '';
      if (onDone) onDone();
    }, duration + 20);
  }
}
