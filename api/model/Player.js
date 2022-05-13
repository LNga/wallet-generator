module.exports = (sequelize, Sequelize) => {
  const Player = sequelize.define('players', {
    username: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
    pwd: { type: Sequelize.STRING, allowNull: false },
    pin_code: { type: Sequelize.STRING, allowNull: false },
  });
  return Player;
};
