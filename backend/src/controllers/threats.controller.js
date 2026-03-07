const { Threat, User, Alert } = require('../models/associations.js');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { io } = require('../../server');
const { analyzeThreat } = require('../services/ai.service');
const { sendAlert } = require('../services/notification.service');

exports.getThreats = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      level,
      status,
      country,
      city,
      startDate,
      endDate,
      search
    } = req.query;

    const where = {};

    if (level) where.level = level;
    if (status) where.status = status;
    if (country) where.country = country;
    if (city) where.city = city;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const threats = await Threat.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'detector',
          attributes: ['id', 'name', 'reputation']
        }
      ]
    });

    res.json({
      threats: threats.rows,
      total: threats.count,
      page: parseInt(page),
      totalPages: Math.ceil(threats.count / parseInt(limit))
    });

  } catch (error) {
    logger.error('Erreur récupération menaces:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des menaces' });
  }
};

exports.getThreatById = async (req, res) => {
  try {
    const threat = await Threat.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'detector',
          attributes: ['id', 'name', 'reputation']
        },
        {
          model: User,
          as: 'verifier',
          attributes: ['id', 'name', 'reputation']
        }
      ]
    });

    if (!threat) {
      return res.status(404).json({ error: 'Menace non trouvée' });
    }

    res.json({ threat });

  } catch (error) {
    logger.error('Erreur récupération menace:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la menace' });
  }
};

exports.createThreat = async (req, res) => {
  try {
    const threatData = {
      ...req.body,
      detectedBy: req.user.id,
      status: 'detected'
    };

    // Analyse IA
    const aiAnalysis = await analyzeThreat(threatData);
    threatData.aiAnalysis = aiAnalysis;
    threatData.confidence = aiAnalysis.confidence;
    threatData.level = aiAnalysis.level;

    const threat = await Threat.create(threatData);

    // Créer une alerte si niveau élevé
    if (threat.level === 'high' || threat.level === 'critical') {
      const alert = await Alert.create({
        title: `Nouvelle menace ${threat.level}`,
        message: threat.title,
        severity: threat.level === 'critical' ? 'critical' : 'warning',
        type: threat.type,
        country: threat.country,
        city: threat.city,
        threatId: threat.id
      });

      // Notifier les admins de la région
      const admins = await User.findAll({
        where: {
          role: 'national_admin',
          country: threat.country
        }
      });

      alert.recipients = admins.map(a => a.id);
      await alert.save();

      // Envoyer notifications en temps réel
      io.to(`threats-${threat.country}`).emit('new-threat', {
        threat,
        alert
      });

      // Envoyer emails/SMS
      await sendAlert(alert, admins);
    }

    logger.info(`Nouvelle menace créée: ${threat.id}`);

    res.status(201).json({ threat });

  } catch (error) {
    logger.error('Erreur création menace:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la menace' });
  }
};

exports.updateThreat = async (req, res) => {
  try {
    const threat = await Threat.findByPk(req.params.id);

    if (!threat) {
      return res.status(404).json({ error: 'Menace non trouvée' });
    }

    // Vérifier les permissions
    if (threat.detectedBy !== req.user.id && req.user.role !== 'national_admin') {
      return res.status(403).json({ error: 'Permission refusée' });
    }

    await threat.update(req.body);

    // Notifier les changements
    io.to(`threats-${threat.country}`).emit('threat-updated', threat);

    res.json({ threat });

  } catch (error) {
    logger.error('Erreur mise à jour menace:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

exports.verifyThreat = async (req, res) => {
  try {
    const threat = await Threat.findByPk(req.params.id);

    if (!threat) {
      return res.status(404).json({ error: 'Menace non trouvée' });
    }

    threat.status = 'verified';
    threat.verifiedBy = req.user.id;
    threat.verifiedAt = new Date();
    await threat.save();

    // Récompenser le détecteur
    const detector = await User.findByPk(threat.detectedBy);
    detector.verifiedReports += 1;
    detector.reputation += 10;
    await detector.save();

    io.to(`threats-${threat.country}`).emit('threat-verified', threat);

    res.json({ threat });

  } catch (error) {
    logger.error('Erreur vérification menace:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification' });
  }
};

exports.getHeatmapData = async (req, res) => {
  try {
    const { country, days = 7 } = req.query;

    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const threats = await Threat.findAll({
      where: {
        createdAt: { [Op.gte]: since },
        ...(country && { country })
      },
      attributes: ['id', 'location', 'level', 'type', 'city', 'country'],
      raw: true
    });

    // Formater pour la carte de chaleur
    const heatmapData = threats
      .filter(t => t.location && t.location.coordinates)
      .map(t => ({
        lat: t.location.coordinates[1],
        lng: t.location.coordinates[0],
        weight: t.level === 'critical' ? 3 : t.level === 'high' ? 2 : 1,
        type: t.type,
        city: t.city,
        country: t.country
      }));

    res.json({ heatmapData });

  } catch (error) {
    logger.error('Erreur données heatmap:', error);
    res.status(500).json({ error: 'Erreur lors de la génération de la heatmap' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { country, period = '24h' } = req.query;

    let timeFilter;
    const now = new Date();

    switch(period) {
      case '24h':
        timeFilter = new Date(now.setHours(now.getHours() - 24));
        break;
      case '7d':
        timeFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        timeFilter = new Date(now.setDate(now.getDate() - 30));
        break;
      default:
        timeFilter = new Date(now.setHours(now.getHours() - 24));
    }

    const where = {
      createdAt: { [Op.gte]: timeFilter },
      ...(country && { country })
    };

    const [
      total,
      byLevel,
      byType,
      byStatus,
      recent
    ] = await Promise.all([
      Threat.count({ where }),
      Threat.findAll({
        where,
        attributes: ['level', [sequelize.fn('COUNT', 'level'), 'count']],
        group: ['level']
      }),
      Threat.findAll({
        where,
        attributes: ['type', [sequelize.fn('COUNT', 'type'), 'count']],
        group: ['type']
      }),
      Threat.findAll({
        where,
        attributes: ['status', [sequelize.fn('COUNT', 'status'), 'count']],
        group: ['status']
      }),
      Threat.findAll({
        where,
        limit: 10,
        order: [['createdAt', 'DESC']]
      })
    ]);

    res.json({
      total,
      byLevel: byLevel.reduce((acc, item) => {
        acc[item.level] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      recent
    });

  } catch (error) {
    logger.error('Erreur stats menaces:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des stats' });
  }
};