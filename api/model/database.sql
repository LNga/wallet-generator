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
