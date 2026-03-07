const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Threat = sequelize.define('Threat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('deepfake', 'phishing', 'misinformation', 'scam', 'malware', 'other'),
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'low'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
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
  status: {
    type: DataTypes.ENUM('detected', 'analyzing', 'verified', 'blocked', 'false_positive'),
    defaultValue: 'detected'
  },
  confidence: {
    type: DataTypes.FLOAT,
    validate: {
      min: 0,
      max: 100
    }
  },
  source: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  detectedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  verifiedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  verifiedAt: {
    type: DataTypes.DATE
  },
  aiAnalysis: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  communityVotes: {
    type: DataTypes.JSONB,
    defaultValue: {
      up: 0,
      down: 0
    }
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['status', 'level']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Threat;        
