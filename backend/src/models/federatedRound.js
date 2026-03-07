const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FederatedRound = sequelize.define('FederatedRound', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  roundNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'aggregating', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  modelVersion: {
    type: DataTypes.STRING
  },
  participants: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  accuracy: {
    type: DataTypes.FLOAT
  },
  loss: {
    type: DataTypes.FLOAT
  },
  parameters: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  aggregationMethod: {
    type: DataTypes.STRING,
    defaultValue: 'fed_avg'
  },
  startTime: {
    type: DataTypes.DATE
  },
  endTime: {
    type: DataTypes.DATE
  },
  metrics: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  contributions: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  globalModel: {
    type: DataTypes.JSONB
  }
}, {
  timestamps: true
});

module.exports = FederatedRound;