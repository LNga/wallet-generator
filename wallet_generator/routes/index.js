var express = require('express');
const walletController = require('../controllers/wallet');
const router = express.Router();

// User Route
router.use('/wallets', walletController);

module.exports = router;
