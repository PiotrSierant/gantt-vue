const db = require('./db.service');

async function createUser(user) {
  const sql = 'INSERT INTO users (processUserId, email, name, lastname, phone) VALUES (?, ?, ?, ?, ?)';
  const params = [user.processUserId, user.email, user.name, user.lastname, user.phone];
  return await db.query(sql, params);
}

async function getAllUsers() {
  const sql = 'SELECT * FROM users';
  return await db.query(sql, []);
}

async function getUserById(processUserId) {
  const sql = 'SELECT * FROM users WHERE processUserId = ?';
  const params = [processUserId];
  const result = await db.query(sql, params);
  return result[0];
}

async function updateUser(processUserId, user) {
  const sql = 'UPDATE users SET email = ?, name = ?, lastname = ?, phone = ? WHERE processUserId = ?';
  const params = [user.email, user.name, user.lastname, user.phone, processUserId];
  return await db.query(sql, params);
}

async function deleteUser(processUserId) {
  const sql = 'DELETE FROM users WHERE processUserId = ?';
  const params = [processUserId];
  return await db.query(sql, params);
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
