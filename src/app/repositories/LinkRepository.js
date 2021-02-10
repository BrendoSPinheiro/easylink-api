const db = require('../../database');

class LinkRepository {
  async findById(id) {
    const [row] = await db.query(`
      SELECT links.*, categories.name as category_name
      FROM links
      LEFT JOIN categories ON categories.id = links.category_id
      WHERE links.id = $1
    `, [id]);

    return row;
  }

  async findAllByUserId(userId, orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`
      SELECT links.*, categories.name as category_name
      FROM links
      LEFT JOIN categories ON categories.id = links.category_id
      WHERE links.user_id = $1
      ORDER BY links.title ${direction}
    `, [userId]);

    return rows;
  }

  async findByUrlAndUserId(url, userId) {
    const [row] = await db.query(`
      SELECT * FROM links
      WHERE url = $1 AND user_id = $2
    `, [url, userId]);

    return row;
  }

  async create({ title, url, category_id, userId }) {
    const [row] = await db.query(`
      INSERT INTO links(title, url, category_id, user_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `, [title, url, category_id, userId]);

    return row;
  }

  async update(id, { title, url, category_id }) {
    const [row] = await db.query(`
      UPDATE links
      SET title = $1, url = $2, category_id = $3
      WHERE id = $4
      RETURNING *
    `, [title, url, category_id, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query(`
      DELETE FROM links
      WHERE id = $1
    `, [id]);

    return deleteOp;
  }
}

module.exports = new LinkRepository();
