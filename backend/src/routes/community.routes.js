const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const { authenticate } = require('../middleware/auth');

router.get('/reports', communityController.getReports);
router.get('/leaderboard', communityController.getLeaderboard);

router.post('/reports', authenticate, communityController.createReport);
router.post('/reports/:id/vote', authenticate, communityController.voteReport);
router.post('/reports/:id/comments', authenticate, communityController.addComment);

module.exports = router;