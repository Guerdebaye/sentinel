const User = require('./users.js');
const Threat = require('./threat.js');
const Node = require('./node.js');
const Report = require('./report.js');
const Alert = require('./alert.js');
const FederatedRound = require('./federatedRound');

// Associations
User.hasMany(Threat, { as: 'detectedThreats', foreignKey: 'detectedBy' });
User.hasMany(Threat, { as: 'verifiedThreats', foreignKey: 'verifiedBy' });
User.hasMany(Report, { foreignKey: 'userId' });
User.hasMany(Node, { foreignKey: 'userId' });
User.hasMany(Alert, { foreignKey: 'recipients' });

Threat.belongsTo(User, { as: 'detector', foreignKey: 'detectedBy' });
Threat.belongsTo(User, { as: 'verifier', foreignKey: 'verifiedBy' });
Threat.hasMany(Report, { foreignKey: 'threatId' });
Threat.hasMany(Alert, { foreignKey: 'threatId' });

Node.belongsTo(User, { foreignKey: 'userId' });

Report.belongsTo(User, { foreignKey: 'userId' });
Report.belongsTo(Threat, { foreignKey: 'threatId' });

Alert.belongsTo(Threat, { foreignKey: 'threatId' });

module.exports = {
  User,
  Threat,
  Node,
  Report,
  Alert,
  FederatedRound
};