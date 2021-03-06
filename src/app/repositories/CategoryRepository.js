const db = require('../../database');

class CategoryRepository {
  async findAllByUserId(userId) {
    const rows = await db.query(`
      SELECT * FROM categories
      WHERE user_id = $1
      ORDER BY name
    `, [userId]);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
      SELECT * FROM categories
      WHERE id = $1
    `, [id]);

    return row;
  }

  async findByNameAndUserId(name, userId) {
    const [row] = await db.query(`
      SELECT * FROM categories
      WHERE name = $1 AND user_id = $2
    `, [name, userId]);

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

  async update(id, { name }) {
    const [row] = await db.query(`
      UPDATE categories
      SET name = $1
      WHERE id = $2
      RETURNING *
    `, [name, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query(`
      DELETE FROM categories
      WHERE id = $1
    `, [id]);

    return deleteOp;
  }
}

module.exports = new CategoryRepository();
