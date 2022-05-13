module.exports = (sequelize, Sequelize) => {
  const Wallet = sequelize.define('wallets', {
    wallet_adress: { type: Sequelize.STRING, allowNull: false },
    currency_code: { type: Sequelize.STRING, allowNull: false },
    currency_balance: { type: Sequelize.INTEGER, allowNull: false },
  });
  return Wallet;
};
