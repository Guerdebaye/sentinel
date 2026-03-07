const express = require('express');
const router = express.Router();
const nodesController = require('../controllers/nodes.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', nodesController.getNodes);
router.get('/metrics', nodesController.getNodeMetrics);

router.post('/register', authenticate, nodesController.registerNode);
router.put('/:id/status', authenticate, nodesController.updateNodeStatus);
router.post('/heartbeat', authenticate, nodesController.heartbeat);

module.exports = router;