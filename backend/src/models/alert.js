const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  threatId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Threats',
      key: 'id'
    }
  },
  recipients: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  severity: {
    type: DataTypes.ENUM('info', 'warning', 'critical'),
    defaultValue: 'info'
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'Alerts'
});

module.exports = Alert;
