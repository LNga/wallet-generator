const express = require('express');
const router = express.Router();
const playerService = require('../../services/player');

router.post('/create', playerService.createPlayer);

module.exports = router;
