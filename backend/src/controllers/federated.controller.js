const { FederatedRound, Node } = require('../models/associations.js');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { io } = require('../../server');
const { aggregateModels } = require('../services/federated.service');

exports.getCurrentRound = async (req, res) => {
  try {
    const currentRound = await FederatedRound.findOne({
      where: {
        status: {
          [Op.in]: ['pending', 'in_progress', 'aggregating']
        }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!currentRound) {
      return res.status(404).json({ error: 'Aucun round en cours' });
    }

    res.json({ round: currentRound });

  } catch (error) {
    logger.error('Erreur récupération round:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du round' });
  }
};

exports.getRounds = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const where = {};
    if (status) where.status = status;

    const rounds = await FederatedRound.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['roundNumber', 'DESC']]
    });

    res.json({
      rounds: rounds.rows,
      total: rounds.count,
      page: parseInt(page),
      totalPages: Math.ceil(rounds.count / parseInt(limit))
    });

  } catch (error) {
    logger.error('Erreur récupération rounds:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des rounds' });
  }
};

exports.startNewRound = async (req, res) => {
  try {
    // Vérifier les permissions (admin seulement)
    if (req.user.role !== 'super_admin' && req.user.role !== 'national_admin') {
      return res.status(403).json({ error: 'Permission refusée' });
    }

    // Compter les nœuds actifs
    const activeNodes = await Node.count({
      where: { status: 'active' }
    });

    const lastRound = await FederatedRound.findOne({
      order: [['roundNumber', 'DESC']]
    });

    const round = await FederatedRound.create({
      roundNumber: (lastRound?.roundNumber || 0) + 1,
      status: 'pending',
      participants: activeNodes,
      modelVersion: `2.4.${(lastRound?.roundNumber || 0) + 1}`,
      startTime: new Date()
    });

    // Notifier tous les nœuds
    io.emit('new-round', {
      roundId: round.id,
      roundNumber: round.roundNumber,
      modelVersion: round.modelVersion
    });

    logger.info(`Nouveau round démarré: ${round.roundNumber}`);

    res.status(201).json({ round });

  } catch (error) {
    logger.error('Erreur démarrage round:', error);
    res.status(500).json({ error: 'Erreur lors du démarrage du round' });
  }
};

exports.submitContribution = async (req, res) => {
  try {
    const { roundId } = req.params;
    const { modelUpdates, metrics } = req.body;

    const round = await FederatedRound.findByPk(roundId);

    if (!round || round.status !== 'in_progress') {
      return res.status(400).json({ error: 'Round non disponible' });
    }

    // Trouver le nœud de l'utilisateur
    const node = await Node.findOne({
      where: { userId: req.user.id }
    });

    if (!node) {
      return res.status(404).json({ error: 'Nœud non trouvé' });
    }

    // Enregistrer la contribution
    const contributions = round.contributions || [];
    contributions.push({
      nodeId: node.id,
      userId: req.user.id,
      modelUpdates,
      metrics,
      timestamp: new Date()
    });

    await round.update({ contributions });

    // Mettre à jour les stats du nœud
    node.dataStats = {
      ...node.dataStats,
      contributedSamples: (node.dataStats.contributedSamples || 0) + 1,
      lastContribution: new Date()
    };
    await node.save();

    logger.info(`Contribution reçue pour round ${round.roundNumber} du nœud ${node.id}`);

    res.json({ 
      success: true,
      message: 'Contribution enregistrée'
    });

  } catch (error) {
    logger.error('Erreur soumission contribution:', error);
    res.status(500).json({ error: 'Erreur lors de la soumission' });
  }
};

exports.aggregateRound = async (req, res) => {
  try {
    const { roundId } = req.params;

    const round = await FederatedRound.findByPk(roundId);

    if (!round || round.status !== 'in_progress') {
      return res.status(400).json({ error: 'Round non disponible pour agrégation' });
    }

    // Mettre à jour le statut
    await round.update({ status: 'aggregating' });

    // Lancer l'agrégation (asynchrone)
    aggregateModels(round).then(async (result) => {
      await round.update({
        status: 'completed',
        accuracy: result.accuracy,
        loss: result.loss,
        globalModel: result.globalModel,
        endTime: new Date()
      });

      // Notifier tous les nœuds
      io.emit('round-completed', {
        roundId: round.id,
        roundNumber: round.roundNumber,
        accuracy: result.accuracy
      });

      logger.info(`Round ${round.roundNumber} complété avec précision ${result.accuracy}`);
    }).catch(error => {
      logger.error('Erreur agrégation:', error);
      round.update({ status: 'failed' });
    });

    res.json({ 
      message: 'Agrégation démarrée',
      round
    });

  } catch (error) {
    logger.error('Erreur agrégation round:', error);
    res.status(500).json({ error: 'Erreur lors de l\'agrégation' });
  }
};

exports.getModelMetrics = async (req, res) => {
  try {
    const rounds = await FederatedRound.findAll({
      where: { status: 'completed' },
      order: [['roundNumber', 'ASC']],
      limit: 30
    });

    const metrics = {
      accuracy: rounds.map(r => ({
        round: r.roundNumber,
        value: r.accuracy
      })),
      loss: rounds.map(r => ({
        round: r.roundNumber,
        value: r.loss
      })),
      participants: rounds.map(r => ({
        round: r.roundNumber,
        value: r.participants
      }))
    };

    res.json({ metrics });

  } catch (error) {
    logger.error('Erreur métriques modèle:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des métriques' });
  }
};

exports.getRoundDetails = async (req, res) => {
  try {
    const { roundId } = req.params;

    const round = await FederatedRound.findByPk(roundId, {
      include: [
        {
          model: Node,
          as: 'participatingNodes',
          through: { attributes: ['contribution', 'metrics'] }
        }
      ]
    });

    if (!round) {
      return res.status(404).json({ error: 'Round non trouvé' });
    }

    res.json({ round });

  } catch (error) {
    logger.error('Erreur récupération détails round:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des détails' });
  }
};