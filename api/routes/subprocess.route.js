const express = require('express');
const router = express.Router();

const subprocessController = require('../controllers/subprocess.controller');

router.post('/subprocesses', subprocessController.createSubprocess);
router.get('/subprocesses', subprocessController.getAllSubprocesses);
router.get('/subprocesses/:subprocessId', subprocessController.getSubprocessById);
router.put('/subprocesses/:subprocessId', subprocessController.updateSubprocess);
router.delete('/subprocesses/:subprocessId', subprocessController.deleteSubprocess);

module.exports = router;