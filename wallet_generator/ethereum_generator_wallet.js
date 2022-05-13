const Web3 = require('web3');
const ganache = require('ganache');
const web3 = new Web3(ganache.provider());

async function newWallet(req) {
  if (req.blockchain == 'ethereum' && req.pin_code.length == 6) {
    const pin_code = req.pin_code;
    try {
      let wallet = await web3.eth.accounts.wallet.create(
        1,
        `${pin_code}21§3456764321§345674321§3453647544±±±§±±±!!!43534534534534`
      );
      let balance = await web3.eth.getBalance(
        wallet[wallet.length - 1].address
      );
      return {
        wallet_address: wallet[wallet.length - 1].address,
        currency_code: 'ETH',
        currency_balance: balance,
      };
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = { newWallet };
