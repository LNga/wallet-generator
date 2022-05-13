const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
const nock = require('nock');
var assert = require('assert');

require('dotenv').config();

const postData = async () => {
  const headers = {
    blockchain_api_key: process.env.BLOCKCHAIN_API_KEY,
  };
  const res = await axios.post(
    'http://localhost:5000/voodoo.blockchain.com/wallets/create',
    { blockchain: 'ethereum', pin_code: '458963' },
    {
      headers: headers,
    }
  );
  console.log(res);
  return res;
};

describe('address length', () => {
  it('checks if API returns 42 characters ethereum address', async () => {
    nock('http://localhost:5000/voodoo.blockchain.com')
      .post(
        '/wallets/create',
        { blockchain: 'ethereum', pin_code: '458963' },
        {
          'BLOCKCHAIN-API-KEY': 'voodoo-blockchain-is-lit',
        }
      )
      .reply(200, {
        wallet_address: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
        currency_code: 'ETH',
        currency_balance: 0,
      });
    const results = await postData();
    assert.equal(results.data.wallet_address.length, 42);
  });
});

describe('currency code', () => {
  it('checks if API returns "ETH" as a currency code', async () => {
    nock('http://localhost:5000/voodoo.blockchain.com')
      .post(
        '/wallets/create',
        { blockchain: 'ethereum', pin_code: '458963' },
        {
          'BLOCKCHAIN-API-KEY': 'voodoo-blockchain-is-lit',
        }
      )
      .reply(200, {
        wallet_address: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
        currency_code: 'ETH',
        currency_balance: 0,
      });
    const results = await postData();
    assert.equal(results.data.currency_code, 'ETH');
  });
});

describe('account balance', () => {
  it('checks if API returns 0 balance', async () => {
    nock('http://localhost:5000/voodoo.blockchain.com')
      .post(
        '/wallets/create',
        { blockchain: 'ethereum', pin_code: '458963' },
        {
          'BLOCKCHAIN-API-KEY': 'voodoo-blockchain-is-lit',
        }
      )
      .reply(200, {
        wallet_address: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
        currency_code: 'ETH',
        currency_balance: 0,
      });
    const results = await postData();
    assert.equal(results.data.currency_balance, 0);
  });
});
