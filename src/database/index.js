class Database {
  constructor(initialData = {}) {
    this.db = { ...initialData };
  }

  async list(namespace) {
    if (this.db[namespace]) {
      return Object.values(this.db[namespace]);
    }
    return [];
  }

  async find(namespace, id) {
    if (this.db[namespace] && this.db[namespace][id]) {
      return this.db[namespace][id];
    }
    return null;
  }

  async createOrUpdate(namespace, id, data) {
    if (!this.db[namespace]) {
      this.db[namespace] = {};
    }
    if (!this.db[namespace][id]) {
      this.db[namespace][id] = {};
    }
    this.db[namespace][id] = {
      ...this.db[namespace][id],
      ...data,
    };
    return this.db[namespace][id];
  }

  async delete(namespace, id) {
    if (this.db[namespace] && this.db[namespace][id]) {
      this.db[namespace][id] = undefined;
    }
    return id;
  }

  drop() {
    this.db = {};
  }
}

const db = new Database();
export default db;
