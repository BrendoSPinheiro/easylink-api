const db = require('../../database');

class UserRepository {
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
}

module.exports = new UserRepository();
