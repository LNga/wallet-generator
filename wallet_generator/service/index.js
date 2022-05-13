const { newWallet } = require('../ethereum_generator_wallet');

async function createWallet(req, res) {
  const isAuthenticated = req.headers.blockchain_api_key;
  if (!isAuthenticated) {
    return res.status(403).json({
      errorMessage: 'Not authenticated',
    });
  }
  const result = await newWallet(req.body, res);
  if (result) {
    return res.status(200).json(result);
  }
}

module.exports = {
  createWallet,
};
