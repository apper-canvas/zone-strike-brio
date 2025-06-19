import weaponsData from '../mockData/weapons.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WeaponService {
  constructor() {
    this.weapons = [...weaponsData];
  }

  async getAll() {
    await delay(250);
    return [...this.weapons];
  }

  async getById(id) {
    await delay(200);
    const weapon = this.weapons.find(w => w.Id === parseInt(id, 10));
    return weapon ? { ...weapon } : null;
  }

  async getByType(type) {
    await delay(200);
    return this.weapons.filter(w => w.type === type).map(w => ({ ...w }));
  }

  async create(weaponData) {
    await delay(300);
    const newWeapon = {
      Id: Math.max(...this.weapons.map(w => w.Id), 0) + 1,
      ...weaponData
    };
    this.weapons.push(newWeapon);
    return { ...newWeapon };
  }

  async update(id, data) {
    await delay(200);
    const index = this.weapons.findIndex(w => w.Id === parseInt(id, 10));
    if (index !== -1) {
      this.weapons[index] = { ...this.weapons[index], ...data };
      return { ...this.weapons[index] };
    }
    return null;
  }

  async delete(id) {
    await delay(200);
    const index = this.weapons.findIndex(w => w.Id === parseInt(id, 10));
    if (index !== -1) {
      const deleted = this.weapons.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
}

export default new WeaponService();