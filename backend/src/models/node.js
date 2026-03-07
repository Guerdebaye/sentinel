const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Node = sequelize.define('Node', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('mobile', 'server', 'gateway'),
    defaultValue: 'mobile'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'syncing'),
    defaultValue: 'active'
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING(2)
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  metrics: {
    type: DataTypes.JSONB,
    defaultValue: {
      cpu: 0,
      memory: 0,
      storage: 0,
      uptime: 0,
      lastSeen: null
    }
  },
  performance: {
    type: DataTypes.JSONB,
    defaultValue: {
      accuracy: 0,
      latency: 0,
      samplesProcessed: 0
    }
  },
  modelVersion: {
    type: DataTypes.STRING
  },
  dataStats: {
    type: DataTypes.JSONB,
    defaultValue: {
      totalSamples: 0,
      contributedSamples: 0,
      lastContribution: null
    }
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      autoUpdate: true,
      trainingEnabled: true,
      privacyLevel: 'high'
    }
  },
  lastHeartbeat: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

module.exports = Node;