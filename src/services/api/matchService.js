import matchesData from '../mockData/matches.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MatchService {
  constructor() {
    this.matches = [...matchesData];
  }

  async getAll() {
    await delay(300);
    return [...this.matches];
  }

  async getById(id) {
    await delay(200);
    const match = this.matches.find(m => m.Id === parseInt(id, 10));
    return match ? { ...match } : null;
  }

  async create(matchData) {
    await delay(300);
    const newMatch = {
      Id: Math.max(...this.matches.map(m => m.Id), 0) + 1,
      ...matchData,
      timeElapsed: 0,
      state: 'lobby'
    };
    this.matches.push(newMatch);
    return { ...newMatch };
  }

  async update(id, data) {
    await delay(200);
    const index = this.matches.findIndex(m => m.Id === parseInt(id, 10));
    if (index !== -1) {
      this.matches[index] = { ...this.matches[index], ...data };
      return { ...this.matches[index] };
    }
    return null;
  }

  async delete(id) {
    await delay(200);
    const index = this.matches.findIndex(m => m.Id === parseInt(id, 10));
    if (index !== -1) {
      const deleted = this.matches.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async getActiveMatches() {
    await delay(250);
    return this.matches.filter(m => m.state === 'active').map(m => ({ ...m }));
  }

  async getMatchHistory() {
    await delay(250);
    return this.matches.filter(m => m.state === 'ended').map(m => ({ ...m }));
  }
}

export default new MatchService();