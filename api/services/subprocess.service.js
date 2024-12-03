const db = require('./db.service');

async function createSubprocess(processId, processGroupsId, name, progress, start, end) {
  const sql = `INSERT INTO Subprocess (processId, processGroupsId, name, progress, start, end)
               VALUES (?, ?, ?, ?, ?, ?)`;
  return await db.query(sql, [processId, processGroupsId, name, progress, start, end]);
}

async function getAllSubprocesses() {
  const sql = 'SELECT * FROM Subprocess';
  return await db.query(sql, []);
}

async function getSubprocessById(subprocessId) {
  const sql = 'SELECT * FROM Subprocess WHERE subprocessId = ?';
  const result = await db.query(sql, [subprocessId]);
  return result[0];
}

async function updateSubprocess(subprocessId, processGroupsId, name, progress, start, end) {
  const sql = `UPDATE Subprocess SET processGroupsId = ?, name = ?, progress = ?, start = ?, end = ?
               WHERE subprocessId = ?`;
  return await db.query(sql, [processGroupsId, name, progress, start, end, subprocessId]);
}

async function deleteSubprocess(subprocessId) {
  const sql = 'DELETE FROM Subprocess WHERE subprocessId = ?';
  return await db.query(sql, [subprocessId]);
}

module.exports = {
  createSubprocess,
  getAllSubprocesses,
  getSubprocessById,
  updateSubprocess,
  deleteSubprocess,
};
