// models/LiveHouse.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LiveHouse = sequelize.define('LiveHouse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lat: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
  },
  lng: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER,   // 或者 DataTypes.SMALLINT
    allowNull: true,           // 如果有些场地不确定容量，可允许为 null
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
}, {
  tableName: 'live_houses',  // 指定数据库表名
  timestamps: true,          // 默认会有 createdAt, updatedAt
});

module.exports = LiveHouse;
