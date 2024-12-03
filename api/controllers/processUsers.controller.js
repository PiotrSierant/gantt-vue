const userProcessService = require('../services/processUsers.service');

async function createUser(req, res) {
  try {
    const user = req.body;
    const newUser = await userProcessService.createUser(user);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating user' });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await userProcessService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching users' });
  }
}

async function getUserById(req, res) {
  try {
    const { processUserId } = req.params;
    const user = await userProcessService.getUserById(processUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching user' });
  }
}

async function updateUser(req, res) {
  try {
    const { processUserId } = req.params;
    const user = req.body;
    const updatedUser = await userProcessService.updateUser(processUserId, user);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating user' });
  }
}

async function deleteUser(req, res) {
  try {
    const { processUserId } = req.params;
    await userProcessService.deleteUser(processUserId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting user' });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
