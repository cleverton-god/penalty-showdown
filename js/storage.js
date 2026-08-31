// StorageManager - localStorage history
const KEY = 'penalty_showdown_history';

export class StorageManager {
  static getHistory() {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveMatch(match) {
    try {
      const history = this.getHistory();
      history.unshift({
        ...match,
        date: new Date().toISOString()
      });
      // Keep last 20
      if (history.length > 20) history.length = 20;
      localStorage.setItem(KEY, JSON.stringify(history));
    } catch { /* ignore */ }
  }

  static clear() {
    try {
      localStorage.removeItem(KEY);
    } catch { /* ignore */ }
  }
}
