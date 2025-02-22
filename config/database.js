const { Sequelize } = require('sequelize');

// 如果环境变量中存在云数据库连接字符串（例如 JAWSDB_URL 或 CLEARDB_DATABASE_URL），优先使用它；否则使用本地配置
const connectionString = process.env.JAWSDB_URL || process.env.CLEARDB_DATABASE_URL || 'mysql://root:linmeimei123@localhost/livehouse_db';

const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;