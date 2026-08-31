import { Player } from './player.js';
import { Goalkeeper } from './goalkeeper.js';
import { Ball } from './ball.js';
import { UI } from './ui.js';
import { AudioManager } from './audio.js';
import { StorageManager } from './storage.js';

const STATES = {
  MENU: 'MENU',
  INTRO: 'INTRO',
  PLAYER1_TURN: 'PLAYER1_TURN',
  PLAYER2_TURN: 'PLAYER2_TURN',
  SHOOTING: 'SHOOTING',
  RESULT: 'RESULT',
  SUDDEN_DEATH: 'SUDDEN_DEATH',
  GAME_OVER: 'GAME_OVER'
};

export class Game {
  constructor() {
    this.ui = new UI();
    this.audio = new AudioManager();
    this.gk = new Goalkeeper();
    this.ball = new Ball();
    this.p1 = null;
    this.p2 = null;
    this.state = STATES.MENU;
    this.currentPlayer = null;
    this.currentRound = 1;
    this.suddenDeath = false;
    this.suddenRound = 0;
    this.selectedZone = 4; // center
    this.power = 50;
    this.powerDirection = 1;
    this.powerInterval = null;
    this.aimDragging = false;
    this.canShoot = false;
    this.stadium = 'night';
    this.p1Color = '#e74c3c';
    this.p2Color = '#3498db';
  }

  init() {
    this.audio.init();
    this.ui.buildCrowd();
    this.ball.setElement(document.getElementById('ball'));
    this.gk.setElement(document.getElementById('goalkeeper'));
    this._buildZones();
    this._bindEvents();
    this.ui.showScreen('menu');
    this._startPowerOscillation();
  }

  _buildZones() {
    const container = document.getElementById('goal-zones');
    container.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const z = document.createElement('div');
      z.className = 'zone';
      z.dataset.zone = i;
      z.addEventListener('click', () => this._selectZone(i));
      z.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this._selectZone(i);
      }, { passive: false });
      container.appendChild(z);
    }
    this._highlightZone(4);
  }

  _bindEvents() {
    // Menu
    document.getElementById('btn-start').addEventListener('click', () => this.startMatch());
    document.getElementById('btn-history').addEventListener('click', () => this.showHistory());
    document.getElementById('btn-back-menu').addEventListener('click', () => {
      this.ui.showScreen('menu');
    });
    document.getElementById('btn-clear-history').addEventListener('click', () => {
      StorageManager.clear();
      this.ui.renderHistory([]);
    });
    document.getElementById('btn-sound').addEventListener('click', () => {
      const on = this.audio.toggle();
      document.getElementById('btn-sound').textContent = on ? '🔊' : '🔇';
    });

    // Color pickers
    document.querySelectorAll('#screen-menu .input-group').forEach((group, idx) => {
      group.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          group.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (idx === 0) this.p1Color = btn.dataset.color;
          else this.p2Color = btn.dataset.color;
        });
      });
    });

    // End buttons
    document.getElementById('btn-replay').addEventListener('click', () => this.replay());
    document.getElementById('btn-new').addEventListener('click', () => {
      this.ui.showScreen('menu');
      this.state = STATES.MENU;
    });

    // Shoot
    document.getElementById('btn-shoot').addEventListener('click', () => this.shoot());

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (this.state !== STATES.PLAYER1_TURN && this.state !== STATES.PLAYER2_TURN && this.state !== STATES.SUDDEN_DEATH) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.shoot();
      }
      // Arrow keys for zone
      const map = {
        ArrowLeft: [0, 3, 6],
        ArrowRight: [2, 5, 8],
        ArrowUp: [0, 1, 2],
        ArrowDown: [6, 7, 8]
      };
      if (map[e.code]) {
        // Move selection toward that direction
        const curr = this.selectedZone;
        let next = curr;
        if (e.code === 'ArrowLeft' && curr % 3 > 0) next = curr - 1;
        if (e.code === 'ArrowRight' && curr % 3 < 2) next = curr + 1;
        if (e.code === 'ArrowUp' && curr >= 3) next = curr - 3;
        if (e.code === 'ArrowDown' && curr <= 5) next = curr + 3;
        this._selectZone(next);
      }
    });

    // Click/touch on goal selects nearest zone
    const goal = document.querySelector('.goal');
    const pickZone = (clientX, clientY) => {
      const rect = goal.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const col = Math.min(2, Math.max(0, Math.floor(x * 3)));
      const row = Math.min(2, Math.max(0, Math.floor(y * 3)));
      this._selectZone(row * 3 + col);
    };
    goal.addEventListener('click', (e) => pickZone(e.clientX, e.clientY));
    goal.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      pickZone(t.clientX, t.clientY);
    }, { passive: false });

    // Stadium select
    document.getElementById('stadium').addEventListener('change', (e) => {
      this.stadium = e.target.value;
      this.ui.setStadium(this.stadium);
    });

    // Init audio on first interaction
    document.body.addEventListener('click', () => this.audio.init(), { once: true });
  }


  _selectZone(z) {
    this.selectedZone = z;
    this._highlightZone(z);
    this.audio.play('click');
  }

  _highlightZone(z) {
    document.querySelectorAll('.zone').forEach((el, i) => {
      el.classList.toggle('active', i === z);
    });
  }

  _startPowerOscillation() {
    // Power bar oscillates until shoot
    this.powerInterval = setInterval(() => {
      if (!this.canShoot) return;
      this.power += this.powerDirection * 2.2;
      if (this.power >= 100) { this.power = 100; this.powerDirection = -1; }
      if (this.power <= 5) { this.power = 5; this.powerDirection = 1; }
      this.ui.setPower(this.power);
    }, 30);
  }

  startMatch() {
    const n1 = document.getElementById('player1-name').value.trim() || 'Jogador 1';
    const n2 = document.getElementById('player2-name').value.trim() || 'Jogador 2';
    if (!n1 || !n2) return;

    this.stadium = document.getElementById('stadium').value;
    this.ui.setStadium(this.stadium);
    this.p1 = new Player(n1, this.p1Color, 1);
    this.p2 = new Player(n2, this.p2Color, 2);
    this.suddenDeath = false;
    this.suddenRound = 0;
    this.currentRound = 1;

    this.audio.play('whistle');
    this._showIntro();
  }

  _showIntro() {
    this.state = STATES.INTRO;
    this.ui.showScreen('intro');
    document.getElementById('intro-name1').textContent = this.p1.name;
    document.getElementById('intro-name2').textContent = this.p2.name;
    document.getElementById('intro-color1').style.background = this.p1.color;
    document.getElementById('intro-color2').style.background = this.p2.color;

    const cd = document.getElementById('countdown');
    cd.classList.remove('hidden');
    let count = 3;
    cd.textContent = count;
    this.audio.play('countdown');

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        cd.textContent = count;
        this.audio.play('countdown');
      } else {
        clearInterval(timer);
        cd.textContent = 'VAI!';
        this.audio.play('whistle');
        setTimeout(() => this._startPlayer1(), 600);
      }
    }, 900);
  }

  _startPlayer1() {
    this.state = STATES.PLAYER1_TURN;
    this.currentPlayer = this.p1;
    this.currentRound = 1;
    this.ui.showScreen('game');
    this.ui.updateScoreboard(this.p1, this.p2);
    this.ui.updateTurn(this.p1, 1, 5);
    this.ui.hideResult();
    this.ui.hideTransition();
    this._prepareShot(STATES.PLAYER1_TURN);
  }

  _prepareShot(nextState = null) {
    this.canShoot = true;
    this.ui.enableShoot(true);
    this.ui.zoomPitch(false);
    this.ball.reset();
    this.gk.reset();
    this.power = 50;
    this.powerDirection = 1;
    this.ui.setPower(this.power);
    this._selectZone(4);
    if (nextState) this.state = nextState;
  }

  async shoot() {
    if (!this.canShoot || this.state === STATES.SHOOTING || this.state === STATES.RESULT) return;
    this.canShoot = false;
    this.ui.enableShoot(false);
    this.state = STATES.SHOOTING;
    this.ui.zoomPitch(true);

    const zone = this.selectedZone;
    const power = this.power;
    this.audio.play('kick');

    // GK reads the shot and dives mid-flight (feels reactive)
    const dive = this.gk.chooseDive(zone);
    const flightMs = Math.max(380, 720 - power * 3);
    setTimeout(() => this.gk.animate(dive), Math.min(280, flightMs * 0.35));

    // Resolve outcome with balanced odds
    let result;
    const missChance = power > 92 ? 0.16 : (power < 18 ? 0.20 : 0.05);
    const cornerBonus = [0, 2, 6, 8].includes(zone) ? 0.05 : 0;
    if (Math.random() < missChance + cornerBonus) {
      result = 'miss';
    } else if (this.gk.isSave(zone, power, dive)) {
      result = 'save';
    } else {
      result = 'goal';
    }

    await this.ball.shoot(zone, power, result, dive);

    // Result
    this.state = STATES.RESULT;
    this.ui.zoomPitch(false);

    if (result === 'goal') {
      this.currentPlayer.addShot('goal');
      this.audio.play('goal');
      this.ui.showResult('goal');
      this.ui.spawnConfetti(28);
      this.gk.animate('sad');
      document.querySelector('.goal')?.classList.add('scored');
      setTimeout(() => document.querySelector('.goal')?.classList.remove('scored'), 800);
    } else if (result === 'save') {
      this.currentPlayer.addShot('save');
      this.audio.play('save');
      this.ui.showResult('save');
      this.gk.animate('celebrate');
    } else {
      this.currentPlayer.addShot('miss');
      this.audio.play('miss');
      this.ui.showResult('miss');
    }

    this.ui.updateScoreboard(this.p1, this.p2, this.suddenDeath);

    // Keep result visible, then reset GK and advance
    setTimeout(() => {
      this.ui.hideResult();
      this.gk.reset();
      this._nextShot();
    }, 2200);
  }

  _nextShot() {
    if (this.suddenDeath) {
      this._nextSudden();
      return;
    }

    // Regular 5 shots
    if (this.currentPlayer === this.p1) {
      if (this.currentRound < 5) {
        this.currentRound++;
        this.ui.updateTurn(this.p1, this.currentRound, 5);
        this._prepareShot(STATES.PLAYER1_TURN);
      } else {
        // Switch to player 2
        this.ui.showTransition(`FIM DAS COBRANÇAS DE ${this.p1.name}\n\nAGORA É A VEZ DE ${this.p2.name}`);
        this.audio.play('whistle');
        setTimeout(() => {
          this.ui.hideTransition();
          this.currentPlayer = this.p2;
          this.currentRound = 1;
          this.state = STATES.PLAYER2_TURN;
          this.ui.updateTurn(this.p2, 1, 5);
          this._prepareShot(STATES.PLAYER2_TURN);
        }, 2500);
      }
    } else {
      // Player 2
      if (this.currentRound < 5) {
        this.currentRound++;
        this.ui.updateTurn(this.p2, this.currentRound, 5);
        this._prepareShot(STATES.PLAYER2_TURN);
      } else {
        // End of regular
        this._checkEnd();
      }
    }
  }

  _checkEnd() {
    if (this.p1.goals > this.p2.goals) {
      this._endGame(this.p1);
    } else if (this.p2.goals > this.p1.goals) {
      this._endGame(this.p2);
    } else {
      // Sudden death
      this._startSuddenDeath();
    }
  }

  _startSuddenDeath() {
    this.suddenDeath = true;
    this.suddenRound = 1;
    this.state = STATES.SUDDEN_DEATH;
    this.ui.showScreen('sudden');
    this.audio.play('whistle');

    const cd = document.getElementById('sudden-count');
    let c = 3;
    cd.textContent = c;
    const t = setInterval(() => {
      c--;
      if (c > 0) {
        cd.textContent = c;
        this.audio.play('countdown');
      } else {
        clearInterval(t);
        this.ui.showScreen('game');
        this.currentPlayer = this.p1;
        this.ui.updateTurn(this.p1, this.suddenRound, 1, true);
        this.ui.updateScoreboard(this.p1, this.p2, true);
        this._prepareShot(STATES.SUDDEN_DEATH);
      }
    }, 800);
  }

  _nextSudden() {
    // Track sudden shots separately using suddenRound
    // Sequence: P1 shoots, then P2, then compare this round's results
    if (this.currentPlayer === this.p1) {
      this.ui.showTransition(`AGORA ${this.p2.name}`);
      setTimeout(() => {
        this.ui.hideTransition();
        this.currentPlayer = this.p2;
        this.ui.updateTurn(this.p2, this.suddenRound, 1, true);
        this._prepareShot(STATES.SUDDEN_DEATH);
      }, 1400);
    } else {
      // Both have taken their sudden shot this round
      const p1Last = this.p1.shots[this.p1.shots.length - 1];
      const p2Last = this.p2.shots[this.p2.shots.length - 1];

      if (p1Last === 'goal' && p2Last !== 'goal') {
        this._endGame(this.p1);
        return;
      }
      if (p2Last === 'goal' && p1Last !== 'goal') {
        this._endGame(this.p2);
        return;
      }
      // Same outcome — continue sudden death
      this.suddenRound++;
      this.ui.showTransition(`RODADA ${this.suddenRound}`);
      setTimeout(() => {
        this.ui.hideTransition();
        this.currentPlayer = this.p1;
        this.ui.updateTurn(this.p1, this.suddenRound, 1, true);
        this._prepareShot(STATES.SUDDEN_DEATH);
      }, 1400);
    }
  }

  _endGame(winner) {
    this.state = STATES.GAME_OVER;
    this.audio.play('victory');
    this.ui.spawnConfetti(60);
    this.ui.showEnd(winner, this.p1, this.p2, this.suddenRound);
    this.ui.showScreen('end');

    // Save history
    StorageManager.saveMatch({
      p1Name: this.p1.name,
      p2Name: this.p2.name,
      p1Goals: this.p1.goals,
      p2Goals: this.p2.goals,
      winner: winner.name,
      sudden: this.suddenDeath,
      totalShots: this.p1.shots.length + this.p2.shots.length
    });
  }

  replay() {
    // Same players
    this.p1.reset();
    this.p2.reset();
    this.suddenDeath = false;
    this.suddenRound = 0;
    this.currentRound = 1;
    this._showIntro();
  }

  showHistory() {
    const list = StorageManager.getHistory();
    this.ui.renderHistory(list);
    this.ui.showScreen('history');
  }
}
