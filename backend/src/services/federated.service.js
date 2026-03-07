const logger = require('../utils/logger');

exports.aggregateModels = async (round) => {
  try {
    // Simulation d'agrégation FedAvg
    logger.info(`Agrégation des modèles pour le round ${round.roundNumber}`);

    // Simuler le temps de calcul
    await new Promise(resolve => setTimeout(resolve, 5000));

    const accuracy = 85 + Math.random() * 10;
    const loss = 0.5 - Math.random() * 0.3;

    return {
      accuracy,
      loss,
      globalModel: {
        version: round.modelVersion,
        parameters: 15700000,
        layers: ['conv2d', 'dense', 'dropout']
      }
    };
  } catch (error) {
    logger.error('Erreur agrégation modèle:', error);
    throw error;
  }
};