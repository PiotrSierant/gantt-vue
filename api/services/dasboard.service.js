const db = require('./db.service');
const helper = require('../utils/helper');

async function getMultiple() {
  const sql = 'SELECT * FROM process';
  const rows = await db.query(sql);
  const data = helper.emptyOrRows(rows);
  
  return data.length === 0 ? data : data.map((row) => row.id);
}

async function getSingle(id) {
  const sql = `
    SELECT 
        process.*, 
        users.name AS user_name, 
        users.last_name AS user_last_name, 
        users.phone AS user_phone 
    FROM process
    JOIN users ON process.user_id = users.id
    WHERE process.id = ?
  `;
  const result = await db.query(sql, [id]);
  if (result.length) {
    const process = result[0];
    return {
      id: process.id,
      name: process.name,
      data: process.data,
      progress: JSON.parse(process.data)[0].progress,
      user: {
        id: process.user_id,
        name: process.user_name,
        last_name: process.user_last_name,
        phone: process.user_phone,
      },
    };
  }
  return null;
}

module.exports = {
  getMultiple,
  getSingle,
};