const express = require('express');
const router = express.Router();

const processController = require('../controllers/process.controller');

router.post('/processes', processController.createProcess);
router.get('/processes', processController.getAllProcesses);
router.get('/processes/:processId', processController.getProcessById);
router.put('/processes/:processId', processController.updateProcess);
router.delete('/processes/:processId', processController.deleteProcess);

module.exports = router;
