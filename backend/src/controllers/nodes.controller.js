const { Node, User } = require('../models/associations.js');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { io } = require('../../server');

exports.getNodes = async (req, res) => {
  try {
    const { status, country, city, active } = req.query;

    const where = {};
    if (status) where.status = status;
    if (country) where.country = country;
    if (city) where.city = city;
    if (active === 'true') where.status = 'active';

    const nodes = await Node.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'reputation']
        }
      ],
      order: [['lastHeartbeat', 'DESC']]
    });

    res.json({
      nodes: nodes.rows,
      total: nodes.count,
      active: nodes.rows.filter(n => n.status === 'active').length
    });

  } catch (error) {
    logger.error('Erreur récupération nœuds:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des nœuds' });
  }
};

exports.registerNode = async (req, res) => {
  try {
    const { name, type, location, city, country, deviceId } = req.body;

    // Vérifier si le nœud existe déjà
    let node = await Node.findOne({ where: { userId: req.user.id } });

    if (node) {
      // Mettre à jour le nœud existant
      await node.update({
        name,
        type,
        location,
        city,
        country,
        lastHeartbeat: new Date(),
        status: 'active'
      });
    } else {
      // Créer un nouveau nœud
      node = await Node.create({
        name,
        type,
        location,
        city,
        country,
        userId: req.user.id,
        lastHeartbeat: new Date(),
        status: 'active'
      });
    }

    logger.info(`Nœud enregistré: ${node.id} - ${name}`);

    res.status(201).json({ node });

  } catch (error) {
    logger.error('Erreur enregistrement nœud:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du nœud' });
  }
};

exports.updateNodeStatus = async (req, res) => {
  try {
    const node = await Node.findByPk(req.params.id);

    if (!node) {
      return res.status(404).json({ error: 'Nœud non trouvé' });
    }

    // Vérifier que l'utilisateur est propriétaire du nœud
    if (node.userId !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Permission refusée' });
    }

    const { status, metrics, performance, dataStats } = req.body;

    await node.update({
      status: status || node.status,
      metrics: metrics || node.metrics,
      performance: performance || node.performance,
      dataStats: dataStats || node.dataStats,
      lastHeartbeat: new Date()
    });

    // Notifier les administrateurs si le nœud devient inactif
    if (status === 'inactive' && node.status !== 'inactive') {
      io.emit('node-status-change', {
        nodeId: node.id,
        status: 'inactive',
        userId: node.userId
      });
    }

    res.json({ node });

  } catch (error) {
    logger.error('Erreur mise à jour nœud:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du nœud' });
  }
};

exports.getNodeMetrics = async (req, res) => {
  try {
    const { period = '24h' } = req.query;

    const nodes = await Node.findAll({
      where: {
        status: 'active',
        lastHeartbeat: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    const metrics = {
      total: nodes.length,
      byCountry: {},
      averageAccuracy: 0,
      totalSamples: 0,
      activeNodes: nodes.filter(n => n.status === 'active').length
    };

    nodes.forEach(node => {
      // Par pays
      if (!metrics.byCountry[node.country]) {
        metrics.byCountry[node.country] = 0;
      }
      metrics.byCountry[node.country]++;

      // Métriques cumulées
      metrics.averageAccuracy += node.performance?.accuracy || 0;
      metrics.totalSamples += node.dataStats?.totalSamples || 0;
    });

    if (nodes.length > 0) {
      metrics.averageAccuracy /= nodes.length;
    }

    res.json({ metrics });

  } catch (error) {
    logger.error('Erreur métriques nœuds:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des métriques' });
  }
};

exports.heartbeat = async (req, res) => {
  try {
    const node = await Node.findOne({
      where: { userId: req.user.id }
    });

    if (!node) {
      return res.status(404).json({ error: 'Nœud non trouvé' });
    }

    node.lastHeartbeat = new Date();
    node.metrics = {
      ...node.metrics,
      ...req.body.metrics
    };
    await node.save();

    res.json({ 
      status: 'ok',
      timestamp: new Date(),
      nextUpdate: Date.now() + 60000 // 1 minute
    });

  } catch (error) {
    logger.error('Erreur heartbeat:', error);
    res.status(500).json({ error: 'Erreur lors du heartbeat' });
  }
};