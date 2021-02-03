const db = require('../../database');

class CategoryRepository {
  async findByName(name) {
    const [row] = await db.query(`
      SELECT * FROM categories
      WHERE name = $1
    `, [name]);

    return row;
  }

  async create({ name, userId }) {
    const [row] = await db.query(`
      INSERT INTO categories(name, user_id)
      VALUES($1, $2)
      RETURNING *
    `, [name, userId]);

    return row;
  }
}

module.exports = new CategoryRepository();
