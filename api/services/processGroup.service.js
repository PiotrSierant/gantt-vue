const db = require('./db.service');

async function createProcessGroup(name) {
    const sql = 'INSERT INTO processGroups (name) VALUES (?)';
    const params = [name];
    return await db.query(sql, params);
}

async function getAllProcessGroups() {
    const sql = 'SELECT * FROM processGroups';
    return await db.query(sql, []);
}

async function getProcessGroupById(processGroupId) {
    const sql = 'SELECT * FROM processGroups WHERE processGroupId = ?';
    const params = [processGroupId];
    const result = await db.query(sql, params);
    return result[0];
}

async function updateProcessGroup(processGroupId, name) {
    const sql = 'UPDATE processGroups SET name = ? WHERE processGroupId = ?';
    const params = [name, processGroupId];
    return await db.query(sql, params);
}

async function deleteProcessGroup(processGroupId) {
    const sql = 'DELETE FROM processGroups WHERE processGroupId = ?';
    const params = [processGroupId];
    return await db.query(sql, params);
}

module.exports = {
    createProcessGroup,
    getAllProcessGroups,
    getProcessGroupById,
    updateProcessGroup,
    deleteProcessGroup
};