// models/Event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const LiveHouse = require('./LiveHouse');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bands: {
    type: DataTypes.TEXT,  // 若要存 JSON 字符串或长文本
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  price_info: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ticket_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  poster_url: {        // 新增: 演出海报链接
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'events',  // 指定数据库表名
  timestamps: true,     // 默认 createdAt, updatedAt
});

// 建立关联：Event.belongsTo(LiveHouse)
Event.belongsTo(LiveHouse, { foreignKey: 'live_house_id' });
LiveHouse.hasMany(Event, { foreignKey: 'live_house_id' });

module.exports = Event;