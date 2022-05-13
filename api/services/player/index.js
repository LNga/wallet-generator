var validator = require('validator');
const PasswordValidator = require('password-validator');
const { pool } = require('../../index');
const axios = require('axios');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();

async function createPlayer(req, res) {
  const userName = req.body.userName;
  const pwd = req.body.pwd;
  const pin_code = req.body.pin_code;
  const client = await pool.connect();

  if (!isValidUsername(userName)) {
    return res
      .status(400)
      .json({
        result:
          'The password needs to contain between 3 and 100 characters, only uppercase, and contain digits or underscore',
      })
      .end();
  } else if (!isValidPassword(pwd)) {
    return res
      .status(400)
      .json({
        result: 'The password needs to contain between 6 and 32 characters',
      })
      .end();
  } else if (!isValidPincode(pin_code)) {
    return res
      .status(400)
      .json({ result: 'The pin code must be exactly 6 digits' })
      .end();
  } else {
    try {
      await client.query('BEGIN');

      //Generating Wallet
      const { wallet_address, currency_code, currency_balance } =
        await createWallet(pin_code);

      //Inserting new player
      const queryPlayer =
        'INSERT INTO players (username, pwd, pincode) VALUES ($1,$2,$3) RETURNING *';
      const newPlayer = await client.query(queryPlayer, [
        userName,
        bcrypt.hashSync(pwd, saltRounds),
        bcrypt.hashSync(pin_code, saltRounds),
      ]);

      //Inserting new wallet
      const queryWallet =
        'INSERT INTO wallets (username, wallet_address, currency, balance) VALUES ($1,$2,$3,$4) RETURNING *';
      const newWallet = await client.query(queryWallet, [
        userName,
        wallet_address,
        currency_code,
        currency_balance,
      ]);
      await client.query('COMMIT');
      return res
        .status(200)
        .json({ ...newWallet.rows[0], ...newPlayer.rows[0] })
        .end();
    } catch (err) {
      await client.query('ROLLBACK');
      return res.status(400).json({ result: err.message }).end();
    } finally {
      client.release();
    }
  }
}

function isValidUsername(userName) {
  let result;
  !(
    validator.matches(userName, '^[a-z0-9_]*$') &&
    validator.isByteLength(userName, { min: 3, max: 100 })
  )
    ? (result = false)
    : (result = true);
  return result;
}

function isValidPassword(pwd) {
  const passwordSchema = new PasswordValidator();
  passwordSchema
    .is()
    .min(6)
    .is()
    .max(32)
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf([
      'Password',
      '12345678',
      'qwertyuiop',
      'azertyuiop',
      '123456789',
      'football',
      'iloveyou',
      'starwars',
      'passw0rd',
      'whatever',
      'trustno1',
    ]);
  !passwordSchema.validate(pwd) ? (result = false) : (result = true);
  return result;
}

function isValidPincode(pincode) {
  !(
    `${pincode.length}` == 6 &&
    validator.isNumeric(pincode, { no_symbols: true })
  )
    ? (result = false)
    : (result = true);

  return result;
}

async function createWallet(pin_code) {
  const headers = {
    blockchain_api_key: process.env.BLOCKCHAIN_API_KEY,
  };
  const walletDetails = await axios.post(
    'http://localhost:5000/voodoo.blockchain.com/wallets/create',
    { blockchain: 'ethereum', pin_code: pin_code },
    {
      headers: headers,
    }
  );
  return walletDetails.data;
}

module.exports = {
  createPlayer,
};
