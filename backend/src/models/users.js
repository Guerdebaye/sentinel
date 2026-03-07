const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'validator', 'national_admin', 'super_admin'),
    defaultValue: 'user'
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  profilePicture: {
    type: DataTypes.STRING
  },
  phoneNumber: {
    type: DataTypes.STRING
  },
  reputation: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reportsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  verifiedReports: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  privacySettings: {
    type: DataTypes.JSONB,
    defaultValue: {
      shareLocation: false,
      showProfile: true,
      receiveNotifications: true
    }
  },
  deviceId: {
    type: DataTypes.STRING,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;