const db = require('../../database');

class CategoryRepository {
  async findAll() {
    const rows = await db.query(`
      SELECT * FROM categories ORDER BY name
    `);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT * FROM categories
      WHERE id = $1
    `, [id]);

    return row;
  }

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
