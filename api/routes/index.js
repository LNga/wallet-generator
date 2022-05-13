var express = require('express');
const playerController = require('../controllers/player');
const router = express.Router();

// User Route
router.use('/players', playerController);

module.exports = router;
