const db = require('./db.service');

async function createProcess(processUserId, name, firstTaskStart, lastTaskEnd, summaryProgress) {
  const sql = `INSERT INTO Process (processUserId, name, firstTaskStart, lastTaskEnd, summaryProgress)
               VALUES (?, ?, ?, ?, ?)`;
  return await db.query(sql, [processUserId, name, firstTaskStart, lastTaskEnd, summaryProgress]);
}

async function getAllProcesses() {
  const sql = 'SELECT * FROM Process';
  return await db.query(sql, []);
}

async function getProcessById(processId) {
  const sql = 'SELECT * FROM Process WHERE processId = ?';
  const result = await db.query(sql, [processId]);
  return result[0];
}

async function updateProcess(processId, name, firstTaskStart, lastTaskEnd, summaryProgress) {
  const sql = `UPDATE Process SET name = ?, firstTaskStart = ?, lastTaskEnd = ?, summaryProgress = ?
               WHERE processId = ?`;
  return await db.query(sql, [name, firstTaskStart, lastTaskEnd, summaryProgress, processId]);
}

async function deleteProcess(processId) {
  const sql = 'DELETE FROM Process WHERE processId = ?';
  return await db.query(sql, [processId]);
}

module.exports = {
  createProcess,
  getAllProcesses,
  getProcessById,
  updateProcess,
  deleteProcess,
};
