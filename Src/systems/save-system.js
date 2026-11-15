import { GAME_CONFIG } from '../config.js';
export class SaveSystem {
  load(){ try { return JSON.parse(localStorage.getItem(GAME_CONFIG.saveKey) || 'null'); } catch { return null; } }
  save(data){ try { localStorage.setItem(GAME_CONFIG.saveKey, JSON.stringify({...data, savedAt: Date.now()})); return true; } catch { return false; } }
  clear(){ localStorage.removeItem(GAME_CONFIG.saveKey); }
  hasSave(){ return !!this.load(); }
}
