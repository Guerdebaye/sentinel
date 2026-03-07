const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticate } = require('../middleware/auth');

router.get('/dashboard', statsController.getDashboardStats);
router.get('/realtime', statsController.getRealtimeStats);
router.get('/historical', statsController.getHistoricalStats);
router.get('/countries', statsController.getCountryStats);

module.exports = router;