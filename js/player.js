export class Player {
  constructor(name, color, id) {
    this.name = name || `Jogador ${id}`;
    this.color = color || (id === 1 ? "#e74c3c" : "#3498db");
    this.id = id;
    this.goals = 0;
    this.shots = []; // 'goal' | 'save' | 'miss'
    this.saves = 0; // goals against when opposing
    this.misses = 0;
  }

  addShot(result) {
    this.shots.push(result);
    if (result === "goal") this.goals++;
    else if (result === "miss") this.misses++;
  }

  reset() {
    this.goals = 0;
    this.shots = [];
    this.saves = 0;
    this.misses = 0;
  }

  get accuracy() {
    if (this.shots.length === 0) return 0;
    return Math.round((this.goals / this.shots.length) * 100);
  }
}
