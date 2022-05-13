const { expect } = require('chai');
const request = require('supertest');
const Pool = require('pg-pool');
const client = require('./poolClient');

describe('Note route', function () {
  let app;

  before('Connnection', async function () {
    const pool = new Pool({
      user: process.env.USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      port: process.env.DB_PORT,
      max: 1,
      idleTimeoutMillis: 0,
    });

    client.query = (text, values) => {
      return pool.query(text, values);
    };

    app = require('../../app');
  });

  beforeEach('Create temporary tables', async function () {
    await client.query(`CREATE TABLE IF NOT EXISTS tempplayers (        
      "username" VARCHAR(100) PRIMARY KEY ,
      "pwd" VARCHAR(32),
      "pincode" CHAR(6)
      );`);
    await client.query(`CREATE TABLE IF NOT EXISTS tempwallets (
        "username" VARCHAR(100) PRIMARY KEY REFERENCES tempplayers(username),
        "wallet_address" VARCHAR(42) NOT NULL,
        "currency" VARCHAR(100),
        "balance" VARCHAR(32)
      )`);
    await client.query(
      ` ALTER TABLE tempplayers
          \ ADD CONSTRAINT fk_uq1_tempplayers_temptwallets
          \ FOREIGN KEY (username)
          \ REFERENCES tempwallets (username)
          \ ON DELETE CASCADE`
    );
  });

  afterEach('Drop temporary tables', async function () {
    await client.query('DROP TABLE IF EXISTS tempplayers CASCADE');
  });

  describe('POST /players/create', function () {
    it('Should create a new player along with its wallet', async function () {
      const req = {
        username: 'tempuser_20',
        password: 'temppwd',
        pincode: '856974',
      };
      await postPlayer(req);

      const { rows } = await client.query(
        'SELECT * FROM tempplayers WHERE name = $1',
        [req.username]
      );
      expect(rows).lengthOf(1);
      expect(rows[0]).to.deep.equal(req);
    });

    it('Should fail if username already exists', async function () {
      const req = {
        username: 'tempuser_20',
        password: 'temppwd',
        pincode: '856974',
      };
      await postPlayer(req);
      await postPlayer(req, 400);
    });

    it('Should fail if request is missing required params', async function () {
      await postPlayer({ username: 'tempuser_20' }, 400);
      await postPlayer({ password: 'temppwd' }, 400);
      await postPlayer({ pincode: '856974' }, 400);
      await postPlayer({}, 400);
    });
  });

  async function postPlayer(req, status = 200) {
    const { body } = await request(app)
      .post('/players/create')
      .send(req)
      .expect(status);
    return body;
  }
});
