const db = require('../../database');

class UserRepository {
  async findById(id) {
    const [row] = await db.query(`
      SELECT id, name, email, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [id]);

    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query(`
      SELECT id, name, email, created_at, updated_at
      FROM users
      WHERE email = $1
    `, [email]);

    return row;
  }

  async create({ name, email, password }) {
    const [row] = await db.query(`
      INSERT INTO users(name, email, password)
      VALUES($1, $2, $3)
      RETURNING id, name, email, created_at, updated_at
    `, [name, email, password]);

    return row;
  }

  async update(id, { name, email }) {
    const [row] = await db.query(`
      UPDATE users
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING id, name, email, created_at, updated_at
    `, [name, email, id]);

    return row;
  }
}

module.exports = new UserRepository();
