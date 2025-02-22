// config/database.js
const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
// 替换下面的 user, password, database, host 为你实际的配置
const sequelize = new Sequelize('livehouse_db', 'root', 'linmeimei123', {
  host: 'localhost',
  dialect: 'mysql',
  // 是否在命令行里打印SQL
  logging: false,
});

module.exports = sequelize;
