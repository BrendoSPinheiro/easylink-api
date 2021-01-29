const { Client } = require('pg');

const client = new Client({
  //* dados de conexão
  host: 'localhost',
  port: 5432,
  //* dados de acesso
  user: 'root',
  password: 'root',
  database: 'easylink',
});

client.connect();

exports.query = async (query, values) => {
  const { rows } = await client.query(query, values);
  return rows;
};
