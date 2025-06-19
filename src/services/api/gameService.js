import players from '../mockData/players.json';
import weapons from '../mockData/weapons.json';
import matches from '../mockData/matches.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameService {
  constructor() {
    this.gameState = {
      currentMatch: null,
      players: [...players],
      weapons: [...weapons],
      isGameActive: false,
      gameLoop: null
    };
  }

  async startMatch() {
    await delay(300);
    const match = {
      Id: Date.now(),
      players: [...this.gameState.players],
      zone: {
        center: { x: 400, y: 300 },
        radius: 350,
        shrinkTime: 60,
        damagePerSecond: 5
      },
      timeElapsed: 0,
      state: 'active'
    };
    
    this.gameState.currentMatch = match;
    this.gameState.isGameActive = true;
    return { ...match };
  }

  async endMatch(winnerId = null) {
    await delay(200);
    if (this.gameState.currentMatch) {
      this.gameState.currentMatch.state = 'ended';
      this.gameState.currentMatch.winnerId = winnerId;
      this.gameState.isGameActive = false;
    }
    return { ...this.gameState.currentMatch };
  }

  async getCurrentMatch() {
    await delay(100);
    return this.gameState.currentMatch ? { ...this.gameState.currentMatch } : null;
  }

  async updatePlayerPosition(playerId, position) {
    await delay(50);
    const player = this.gameState.players.find(p => p.Id === playerId);
    if (player) {
      player.position = { ...position };
    }
    return player ? { ...player } : null;
  }

  async updatePlayerHealth(playerId, health) {
    await delay(50);
    const player = this.gameState.players.find(p => p.Id === playerId);
    if (player) {
      player.health = Math.max(0, health);
      if (player.health <= 0) {
        player.isAlive = false;
      }
    }
    return player ? { ...player } : null;
  }

  async addKill(playerId) {
    await delay(50);
    const player = this.gameState.players.find(p => p.Id === playerId);
    if (player) {
      player.kills += 1;
    }
    return player ? { ...player } : null;
  }

  async updateZone(zoneData) {
    await delay(100);
    if (this.gameState.currentMatch) {
      this.gameState.currentMatch.zone = { ...zoneData };
    }
    return this.gameState.currentMatch ? { ...this.gameState.currentMatch.zone } : null;
  }

  async getGameState() {
    await delay(50);
    return {
      match: this.gameState.currentMatch ? { ...this.gameState.currentMatch } : null,
      players: [...this.gameState.players],
      isActive: this.gameState.isGameActive
    };
  }

  async resetGame() {
    await delay(200);
    this.gameState = {
      currentMatch: null,
      players: [...players],
      weapons: [...weapons],
      isGameActive: false,
      gameLoop: null
    };
    return true;
  }
}

export default new GameService();