const express = require('express');
const router = express.Router();

const processGroupController = require('../controllers/processGroup.controller');

router.post('/process-groups', processGroupController.createProcessGroup);
router.get('/process-groups', processGroupController.getAllProcessGroups);
router.get('/process-groups/:processGroupId', processGroupController.getProcessGroupById);
router.put('/process-groups/:processGroupId', processGroupController.updateProcessGroup);
router.delete('/process-groups/:processGroupId', processGroupController.deleteProcessGroup);

module.exports = router;