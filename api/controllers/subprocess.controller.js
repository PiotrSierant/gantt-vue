const subprocessService = require('../services/subprocess.service');

async function createSubprocess(req, res) {
  try {
    const { processId, processGroupsId, name, progress, start, end } = req.body;
    const newSubprocess = await subprocessService.createSubprocess(processId, processGroupsId, name, progress, start, end);
    return res.status(201).json(newSubprocess);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating subprocess' });
  }
}

async function getAllSubprocesses(req, res) {
  try {
    const subprocesses = await subprocessService.getAllSubprocesses();
    return res.status(200).json(subprocesses);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching subprocesses' });
  }
}

async function getSubprocessById(req, res) {
  try {
    const { subprocessId } = req.params;
    const subprocess = await subprocessService.getSubprocessById(subprocessId);
    if (!subprocess) return res.status(404).json({ error: 'Subprocess not found' });
    return res.status(200).json(subprocess);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching subprocess' });
  }
}

async function updateSubprocess(req, res) {
  try {
    const { subprocessId } = req.params;
    const { processGroupsId, name, progress, start, end } = req.body;
    await subprocessService.updateSubprocess(subprocessId, processGroupsId, name, progress, start, end);
    return res.status(200).json({ message: 'Subprocess updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating subprocess' });
  }
}

async function deleteSubprocess(req, res) {
  try {
    const { subprocessId } = req.params;
    await subprocessService.deleteSubprocess(subprocessId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting subprocess' });
  }
}

module.exports = {
  createSubprocess,
  getAllSubprocesses,
  getSubprocessById,
  updateSubprocess,
  deleteSubprocess,
};
