import playersData from '../mockData/players.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlayerService {
  constructor() {
    this.players = [...playersData];
  }

  async getAll() {
    await delay(300);
    return [...this.players];
  }

  async getById(id) {
    await delay(200);
    const player = this.players.find(p => p.Id === parseInt(id, 10));
    return player ? { ...player } : null;
  }

  async create(playerData) {
    await delay(300);
    const newPlayer = {
      Id: Math.max(...this.players.map(p => p.Id), 0) + 1,
      ...playerData,
      kills: 0,
      isAlive: true
    };
    this.players.push(newPlayer);
    return { ...newPlayer };
  }

  async update(id, data) {
    await delay(200);
    const index = this.players.findIndex(p => p.Id === parseInt(id, 10));
    if (index !== -1) {
      this.players[index] = { ...this.players[index], ...data };
      return { ...this.players[index] };
    }
    return null;
  }

  async delete(id) {
    await delay(200);
    const index = this.players.findIndex(p => p.Id === parseInt(id, 10));
    if (index !== -1) {
      const deleted = this.players.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async respawn(id) {
    await delay(250);
    const player = this.players.find(p => p.Id === parseInt(id, 10));
    if (player) {
      player.health = 100;
      player.armor = 0;
      player.isAlive = true;
      player.position = { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 };
      return { ...player };
    }
    return null;
  }
}

export default new PlayerService();