const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  threatId: {
    type: DataTypes.UUID,
    references: {
      model: 'Threats',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.JSON
  },
  city: DataTypes.STRING,
  country: DataTypes.STRING(2),
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected', 'analyzing'),
    defaultValue: 'pending'
  },
  confidence: {
    type: DataTypes.FLOAT
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  aiAnalysis: {
    type: DataTypes.JSONB
  },
  votes: {
    type: DataTypes.JSONB,
    defaultValue: { up: 0, down: 0 }
  },
  comments: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSONB
  }
}, {
  timestamps: true
});

module.exports = Report;