const db = require('../../database');

class LinkRepository {
  async findAllByUserId(userId, orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`
      SELECT * FROM links
      WHERE user_id = $1
      ORDER BY title ${direction}
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
}

module.exports = new LinkRepository();
