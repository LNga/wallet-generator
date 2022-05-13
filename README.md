# Blockchain Backend Test

Hello and thank you for spending your precious time working on this assessment test!

Although this is just a simple coding exercise, it will tell us a lot about you, your experiences and the way you work. So please do it as if you're working on a real project that will be deployed to production.

It is expected to take no more than 6 hours to complete, but please tell us if you need more time.

Once you've completed the test, please share it with us privately via email, and don't push it to a public repository.

Thank you and hope that you'll have a good time working on it!

## System requirements

Suppose that we're building a backend web service that will allow mobile games's client to perform some operations on the blockchain, such as creating wallets, minting NFTs, or transfering tokens between wallets, etc.

In this test, you only need to implement 1 single `HTTP/gRPC` API that will receive and process a request to create a new player account together with his/her blockchain wallet at once.

1. The player must provide a `username`, `password`, and a `pin code` to protect his/her blockchain wallet.

- The player's `username` must be unique.
- The `username` must be a string of 3-100 characters, and must contain only lowercase English letters (a-z), digits (0-9) or underscore (\_).
- The `password` must be a string of 6-32 characters.
- And `pin code` must be a string of exactly 6 digits (0-9).

2. The API should call an external service to create a wallet for the player on the blockchain.

- Note that we're not giving you a real service in this test, so you will have to mock it in your implementation.
- Basically, you will have to send a HTTP `POST` request to this endpoint: `https://{BLOCKCHAIN_SERVICE_URL}/wallets/create`
- It expects a `JSON` body with these parameters:
  ```json
  {
    "blockchain": "ethereum", // the name of the blockchain, let's say we're only using ethereum for now
    "pin_code": "" // the player's provided pin code
  }
  ```
- For authenticating with the service, you also need to provide an API key string in the `X-API-KEY` header of the request. This API key should be kept as a secret when deploy to production.
- In case of success, the service will respond `200 OK` status code with this `JSON` body:
  ```json
  {
    "wallet_address": "", // the address of the created wallet on the blockchain
    "currency_code": "", // the currency of the blockchain, such as ETH
    "currency_balance": "" // the currency balance of the wallet
  }
  ```
- In case of failure, the service will respond other status codes with an error message in its body:
  ```json
  {
    "error": "" // the error message
  }
  ```

3. If the wallet is successfully created on the blockchain, its information should be stored in a `wallets` table in our database, and the player's account should be created and stored in another `players` table at the same time.

- You should think of a way to design these 2 tables so that we can easily figure out which wallet belongs to which player. Let's say, to make it simple, we only allow 1 player to have exactly 1 blockchain wallet.
- You must make sure that there should be no wallets created without a player, or a player created without wallet. This is very important to ensure the consistency of our database.

4. Once the `player` and `wallet` records have been successfully stored in the database, the API should send a successful response to the client with all the necessary information about the player and wallet.

- It's up to you to decide the schema of the database, and the structure of the request/response.
- Please explain your choice in the next section of this README file.

5. We're gonna use `PostgreSQL` for the database, and we expect to see a good implementation with a well-written set of unit tests.

- We prefer the service to be developed using `Go`, but you can also use another programming language if you're not familiar with it.
- You can serve requests with either `gRPC` or `HTTP`, or both (on 2 different ports).
- It would be great if there's a swagger documentation of the service as well.
- We also want to be able to run your code with 1 single `docker compose up` command.

## Explain your DB design and API implementation

- DB Design: I chose to create 2 tables `players`and `wallets`. Players primary key is "username" (as its unique and not null) which is also the primary key of `wallets` as these tables have a one-to-one relationship. To make impossible to create a wallet with no players related or to delete a player without its wallet, along with the `wallets` primary key I have added a constraint on foreign key on `players` as you can see below :

CREATE TABLE IF NOT EXISTS players (  
"username" VARCHAR(100) PRIMARY KEY ,
"pwd" VARCHAR(32),
"pincode" CHAR(6)
);

CREATE TABLE IF NOT EXISTS wallets (
"username" VARCHAR(100) PRIMARY KEY REFERENCES players(username),
"wallet_address" VARCHAR(42) NOT NULL,
"currency" VARCHAR(100),
"balance" VARCHAR(32)
);

ALTER TABLE players
ADD CONSTRAINT fk_uq1_players_wallets
FOREIGN KEY (username)
REFERENCES wallets (username)
ON UPDATE CASCADE
ON DELETE CASCADE
DEFERRABLE INITIALLY DEFERRED;

- Structure of the response (when a client sends a post request to create a new user):

```json
{
  "username": "",
  "wallet_address": "0xa-----------------------------------",
  "currency_code": "ETH",
  "balance": "0",
  "pwd": "xxxxxxx",
  "pin_code": "------"
}
```

- API implementation
  NodeJS API. 3 main folders: 1.api (nodeJS & express) 2. tests (nock and mocha) 3. wallet_generator (web3js and ganache)
  To launch and try this API:
  `docker-compose up -d`
  Open a tab on your browser and go to : `localhost:3000/api-docs` (swagger ui)
  Try it out (Post request)

- Ethereum wallet generator: Access from http://localhost:5000/voodoo.blockchain.com/wallets/create'. Everytime a player account is created, a 42 characters length ethereum address is randomly generated. The eth.accounts.wallet.create() method from web3js library allows to create a new wallet along with (at least) one account. This account address is unique.

- Looking forward to read your feedback ! :)
