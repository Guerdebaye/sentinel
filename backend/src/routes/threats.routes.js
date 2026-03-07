const express = require('express');
const router = express.Router();
const threatsController = require('../controllers/threats.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', threatsController.getThreats);
router.get('/heatmap', threatsController.getHeatmapData);
router.get('/stats', threatsController.getStats);
router.get('/:id', threatsController.getThreatById);

router.post('/', authenticate, threatsController.createThreat);
router.put('/:id', authenticate, threatsController.updateThreat);
router.post('/:id/verify', authenticate, authorize(['national_admin', 'super_admin']), threatsController.verifyThreat);

module.exports = router;