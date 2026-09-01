export class UI {
  constructor() {
    this.screens = {
      menu: document.getElementById("screen-menu"),
      intro: document.getElementById("screen-intro"),
      game: document.getElementById("screen-game"),
      sudden: document.getElementById("screen-sudden"),
      end: document.getElementById("screen-end"),
      history: document.getElementById("screen-history"),
    };
  }

  showScreen(name) {
    Object.values(this.screens).forEach((s) => s.classList.remove("active"));
    if (this.screens[name]) {
      this.screens[name].classList.add("active");
    }
  }

  setStadium(type) {
    const bg = document.getElementById("stadium-bg");
    bg.className = "stadium-bg " + type;
  }

  updateScoreboard(p1, p2, isSudden = false) {
    document.getElementById("sb-name1").textContent = p1.name;
    document.getElementById("sb-name2").textContent = p2.name;
    document.getElementById("sb-score1").textContent = p1.goals;
    document.getElementById("sb-score2").textContent = p2.goals;

    this._renderShots("shots-p1", p1.shots, isSudden ? 99 : 5);
    this._renderShots("shots-p2", p2.shots, isSudden ? 99 : 5);
  }

  _renderShots(id, shots, max) {
    const el = document.getElementById(id);
    el.innerHTML = "";
    const count = Math.max(shots.length, Math.min(max, 5));
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.className = "shot-dot";
      if (i < shots.length) {
        // Never use bare class "goal" — it collides with the .goal element CSS
        dot.classList.add(shots[i] === "goal" ? "shot-goal" : "shot-miss");
      } else {
        dot.classList.add("pending");
      }
      el.appendChild(dot);
    }
  }

  updateTurn(player, round, total = 5, isSudden = false) {
    document.getElementById("turn-name").textContent = player.name;
    document.getElementById("turn-name").style.color = player.color;
    if (isSudden) {
      document.getElementById("turn-round").textContent =
        `MORTE SÚBITA · RODADA ${round}`;
    } else {
      document.getElementById("turn-round").textContent =
        `COBRANÇA ${round}/${total}`;
    }
  }

  showResult(type) {
    const el = document.getElementById("result-msg");
    // Use result-* classes to avoid colliding with .goal (the actual goal element)
    el.className = "result-msg show result-" + type;
    if (type === "goal") {
      el.innerHTML =
        '<span class="rm-icon">⚽</span><span class="rm-text">GOOOOOL!</span><span class="rm-sub">QUE GOLAÇO!</span>';
    } else if (type === "save") {
      el.innerHTML =
        '<span class="rm-icon">🧤</span><span class="rm-text">DEFENDEU!</span><span class="rm-sub">QUE DEFESA!</span>';
    } else {
      el.innerHTML =
        '<span class="rm-icon">❌</span><span class="rm-text">FORA!</span><span class="rm-sub">ERROU O ALVO</span>';
    }
    el.classList.remove("hidden");
  }

  hideResult() {
    const el = document.getElementById("result-msg");
    el.className = "result-msg hidden";
    el.innerHTML = "";
  }

  showTransition(text) {
    const el = document.getElementById("transition-msg");
    el.textContent = text;
    el.classList.remove("hidden");
  }

  hideTransition() {
    document.getElementById("transition-msg").classList.add("hidden");
  }

  setPower(value) {
    const fill = document.getElementById("power-fill");
    const val = document.getElementById("power-value");
    if (fill) fill.style.width = value + "%";
    if (val) val.textContent = Math.round(value) + "%";
  }

  enableShoot(enabled) {
    document.getElementById("btn-shoot").disabled = !enabled;
  }

  zoomPitch(zoom) {
    // Zoom desativado — o gol não aumenta ao chutar
  }

  celebrate(on) {
    const bg = document.getElementById("stadium-bg");
    if (on) bg.classList.add("celebrate");
    else bg.classList.remove("celebrate");
  }

  spawnConfetti(count = 40) {
    const container = document.getElementById("confetti");
    if (!container) return;
    // No green — avoids looking like a green overlay on the scoreboard
    const colors = [
      "#ffd700",
      "#ff3366",
      "#00ccff",
      "#ff6b00",
      "#ffffff",
      "#a855f7",
      "#ff8fab",
    ];
    for (let i = 0; i < count; i++) {
      const c = document.createElement("div");
      c.className = "confetti-piece";
      c.style.left = 8 + Math.random() * 84 + "%";
      c.style.top = "0";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDelay = Math.random() * 0.4 + "s";
      c.style.animationDuration = 2 + Math.random() * 1.4 + "s";
      container.appendChild(c);
      setTimeout(() => c.remove(), 3800);
    }
  }

  spawnParticles(x, y, color = "#00ff88") {
    const pitch = document.getElementById("pitch");
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.background = color;
      const angle = (i / 12) * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
      p.style.setProperty("--tx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--ty", Math.sin(angle) * dist + "px");
      pitch.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }

  buildCrowd() {
    const colors = [
      "#c0392b",
      "#e74c3c",
      "#2980b9",
      "#3498db",
      "#27ae60",
      "#2ecc71",
      "#8e44ad",
      "#9b59b6",
      "#f39c12",
      "#e67e22",
      "#1abc9c",
      "#34495e",
      "#ffffff",
      "#f1c40f",
      "#d35400",
      "#2c3e50",
      "#16a085",
    ];
    const fill = (id, count, sizeMin, sizeMax, flagChance = 0.1) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        p.className = "crowd-person";
        const h = sizeMin + Math.random() * (sizeMax - sizeMin);
        p.style.height = h + "px";
        p.style.width = Math.max(3, h * 0.42) + "px";
        p.style.animationDelay = Math.random() * 2.2 + "s";
        p.style.animationDuration = 1.0 + Math.random() * 1.4 + "s";
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        if (Math.random() < flagChance) p.classList.add("has-flag");
        el.appendChild(p);
      }
    };
    fill("crowd-back", 70, 6, 11, 0.06);
    fill("crowd-mid", 60, 9, 15, 0.1);
    fill("crowd", 50, 12, 20, 0.14);
  }

  showEnd(winner, p1, p2, suddenRounds) {
    document.getElementById("champ-name").textContent = winner.name;
    document.getElementById("champ-name").style.color = winner.color;
    document.getElementById("final-score").textContent =
      `${p1.name} ${p1.goals} × ${p2.goals} ${p2.name}`;

    const stats = document.getElementById("end-stats");
    let html = `
      <div><strong>${p1.name}</strong>: ${p1.goals} gols · ${p1.accuracy}% acerto · ${p1.misses} erros</div>
      <div><strong>${p2.name}</strong>: ${p2.goals} gols · ${p2.accuracy}% acerto · ${p2.misses} erros</div>
      <div>Total de cobranças: ${p1.shots.length + p2.shots.length}</div>
    `;
    if (suddenRounds > 0) {
      html += `<div>Morte súbita: ${suddenRounds} rodada(s)</div>`;
    }
    stats.innerHTML = html;
  }

  renderHistory(list) {
    const el = document.getElementById("history-list");
    if (!list.length) {
      el.innerHTML =
        '<div class="history-empty">Nenhuma partida registrada ainda.</div>';
      return;
    }
    el.innerHTML = list
      .map((m) => {
        const d = new Date(m.date);
        const dateStr =
          d.toLocaleDateString("pt-BR") +
          " " +
          d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        return `
        <div class="history-item">
          <div class="h-score">${m.p1Name} ${m.p1Goals} × ${m.p2Goals} ${m.p2Name}</div>
          <div class="h-meta">Vencedor: ${m.winner} · ${dateStr}${m.sudden ? " · Morte Súbita" : ""}</div>
        </div>
      `;
      })
      .join("");
  }
}
