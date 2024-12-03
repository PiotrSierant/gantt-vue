const express = require('express');
const router = express.Router();

const userProcessController = require('../controllers/processUsers.controller');

router.post('/', userProcessController.createUser);
router.get('/', userProcessController.getAllUsers);
router.get('/:id', userProcessController.getUserById);
router.put('/:id', userProcessController.updateUser);
router.delete('/:id', userProcessController.deleteUser);

module.exports = router;