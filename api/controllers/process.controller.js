const processService = require('../services/process.service');

async function createProcess(req, res) {
  try {
    const { processUserId, name, firstTaskStart, lastTaskEnd, summaryProgress } = req.body;
    const newProcess = await processService.createProcess(
      processUserId, name, firstTaskStart, lastTaskEnd, summaryProgress
    );
    return res.status(201).json(newProcess);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating process' });
  }
}

async function getAllProcesses(req, res) {
  try {
    const processes = await processService.getAllProcesses();
    return res.status(200).json(processes);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching processes' });
  }
}

async function getProcessById(req, res) {
  try {
    const { processId } = req.params;
    const process = await processService.getProcessById(processId);
    if (!process) return res.status(404).json({ error: 'Process not found' });
    return res.status(200).json(process);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching process' });
  }
}

async function updateProcess(req, res) {
  try {
    const { processId } = req.params;
    const { name, firstTaskStart, lastTaskEnd, summaryProgress } = req.body;
    await processService.updateProcess(processId, name, firstTaskStart, lastTaskEnd, summaryProgress);
    return res.status(200).json({ message: 'Process updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating process' });
  }
}

async function deleteProcess(req, res) {
  try {
    const { processId } = req.params;
    await processService.deleteProcess(processId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting process' });
  }
}

module.exports = {
  createProcess,
  getAllProcesses,
  getProcessById,
  updateProcess,
  deleteProcess,
};
