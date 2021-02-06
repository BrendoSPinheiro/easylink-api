const db = require('../../database');

class LinkRepository {
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
