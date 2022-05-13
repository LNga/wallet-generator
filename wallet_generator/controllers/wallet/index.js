var express = require('express');
var router = express.Router();
const walletService = require('../../service/');

router.post('/create', walletService.createWallet);

module.exports = router;
