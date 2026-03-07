const express = require('express');
const router = express.Router();
const federatedController = require('../controllers/federated.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/current', federatedController.getCurrentRound);
router.get('/rounds', federatedController.getRounds);
router.get('/metrics', federatedController.getModelMetrics);

router.post('/rounds', authenticate, authorize(['super_admin']), federatedController.startNewRound);
router.post('/rounds/:roundId/contribute', authenticate, federatedController.submitContribution);
router.post('/rounds/:roundId/aggregate', authenticate, authorize(['super_admin']), federatedController.aggregateRound);

module.exports = router;