const dashboardService = require('../services/dasboard.service');

async function getMultiple(req, res, next) {
  try {
    const result = await dashboardService.getMultiple(req.query.page);
    res.json(result);
  } catch (err) {
    console.error(`Error while getting dashboard data`, err.message);
    next(err);
  }
}
  
async function getSingle(req, res, next) {
  try {
    const result = await dashboardService.getSingle(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Zegar nie znaleziony' });
    }
    res.json(result);
  } catch (err) {
    console.error(`Error while getting dashboard item`, err.message);
    next(err);
  }
}

module.exports = {
    getMultiple,
    getSingle,
};


//   get,
//   create,
//   update,
//   remove

// async function get(req, res, next) {
//     try {
//         res.json(await dashboard.getMultiple(req.query.page));
//     } catch (err) {
//         console.error(`Error while getting programming languages`, err.message);
//         next(err);
//     }
//   }
  
//   async function create(req, res, next) {
//     try {
//       res.json(await dashboard.create(req.body));
//     } catch (err) {
//       console.error(`Error while creating programming language`, err.message);
//       next(err);
//     }
//   }
  
//   async function update(req, res, next) {
//     try {
//       res.json(await dashboard.update(req.params.id, req.body));
//     } catch (err) {
//       console.error(`Error while updating programming language`, err.message);
//       next(err);
//     }
//   }
  
//   async function remove(req, res, next) {
//     try {
//       res.json(await dashboard.remove(req.params.id));
//     } catch (err) {
//       console.error(`Error while deleting programming language`, err.message);
//       next(err);
//     }
//   }