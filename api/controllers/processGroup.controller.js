const processGroupService = require('../services/processGroup.service');

async function createProcessGroup(req, res) {
  try {
    const { name } = req.body;
    const newProcessGroup = await processGroupService.createProcessGroup(name);
    return res.status(201).json(newProcessGroup);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Process group name must be unique' });
    }
    return res.status(500).json({ error: 'Error creating process group' });
  }
}

async function getAllProcessGroups(req, res) {
  try {
    const processGroups = await processGroupService.getAllProcessGroups();
    return res.status(200).json(processGroups);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching process groups' });
  }
}

async function getProcessGroupById(req, res) {
  try {
    const { processGroupId } = req.params;
    const processGroup = await processGroupService.getProcessGroupById(processGroupId);
    if (!processGroup) {
      return res.status(404).json({ error: 'Process group not found' });
    }
    return res.status(200).json(processGroup);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching process group' });
  }
}

async function updateProcessGroup(req, res) {
  try {
    const { processGroupId } = req.params;
    const { name } = req.body;
    await processGroupService.updateProcessGroup(processGroupId, name);
    return res.status(200).json({ message: 'Process group updated successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Process group name must be unique' });
    }
    return res.status(500).json({ error: 'Error updating process group' });
  }
}

async function deleteProcessGroup(req, res) {
  try {
    const { processGroupId } = req.params;
    await processGroupService.deleteProcessGroup(processGroupId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting process group' });
  }
}

module.exports = {
  createProcessGroup,
  getAllProcessGroups,
  getProcessGroupById,
  updateProcessGroup,
  deleteProcessGroup
};
