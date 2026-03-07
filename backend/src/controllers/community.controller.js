const { Report, User, Threat } = require('../models/associations.js');
const { Op } = require('sequelize');
const logger = require('../utils/logger');
const { io } = require('../../server');
const { analyzeReport } = require('../services/ai.service');

exports.createReport = async (req, res) => {
  try {
    const reportData = {
      ...req.body,
      userId: req.user.id,
      status: 'pending'
    };

    // Analyse IA du rapport
    const aiAnalysis = await analyzeReport(reportData);
    reportData.aiAnalysis = aiAnalysis;
    reportData.confidence = aiAnalysis.confidence;

    const report = await Report.create(reportData);

    // Si confiance élevée, créer automatiquement une menace
    if (aiAnalysis.confidence > 80) {
      const threat = await Threat.create({
        title: reportData.description.substring(0, 100),
        description: reportData.description,
        type: reportData.type,
        level: aiAnalysis.level || 'medium',
        location: reportData.location,
        city: reportData.city,
        country: reportData.country,
        detectedBy: req.user.id,
        aiAnalysis: aiAnalysis,
        confidence: aiAnalysis.confidence,
        source: { reportId: report.id }
      });

      report.threatId = threat.id;
      await report.save();

      // Notifier la communauté
      io.emit('new-threat', threat);
    }

    // Augmenter la réputation de l'utilisateur
    await req.user.increment('reportsCount');
    await req.user.increment('reputation', { by: 5 });

    logger.info(`Nouveau rapport créé: ${report.id}`);

    res.status(201).json({ report });

  } catch (error) {
    logger.error('Erreur création rapport:', error);
    res.status(500).json({ error: 'Erreur lors de la création du rapport' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      country,
      city
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (country) where.country = country;
    if (city) where.city = city;

    const reports = await Report.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'reputation']
        }
      ]
    });

    res.json({
      reports: reports.rows,
      total: reports.count,
      page: parseInt(page),
      totalPages: Math.ceil(reports.count / parseInt(limit))
    });

  } catch (error) {
    logger.error('Erreur récupération rapports:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des rapports' });
  }
};

exports.voteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'up' ou 'down'

    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ error: 'Rapport non trouvé' });
    }

    // Mettre à jour les votes
    const votes = report.votes || { up: 0, down: 0 };
    votes[vote] += 1;
    
    await report.update({ votes });

    // Si assez de votes positifs, vérifier le rapport
    if (votes.up >= 5 && report.status === 'pending') {
      report.status = 'verified';
      await report.save();

      // Récompenser l'auteur
      const author = await User.findByPk(report.userId);
      author.verifiedReports += 1;
      author.reputation += 20;
      await author.save();

      // Créer une menace si pas déjà fait
      if (!report.threatId) {
        const threat = await Threat.create({
          title: report.description.substring(0, 100),
          description: report.description,
          type: report.type,
          level: 'medium',
          location: report.location,
          city: report.city,
          country: report.country,
          detectedBy: report.userId,
          confidence: report.confidence,
          source: { reportId: report.id }
        });

        report.threatId = threat.id;
        await report.save();

        io.emit('new-threat', threat);
      }
    }

    io.emit('report-updated', report);

    res.json({ report });

  } catch (error) {
    logger.error('Erreur vote rapport:', error);
    res.status(500).json({ error: 'Erreur lors du vote' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ error: 'Rapport non trouvé' });
    }

    const comments = report.comments || [];
    comments.push({
      userId: req.user.id,
      userName: req.user.name,
      comment,
      createdAt: new Date()
    });

    await report.update({ comments });

    io.emit('new-comment', {
      reportId: id,
      comment: comments[comments.length - 1]
    });

    res.json({ report });

  } catch (error) {
    logger.error('Erreur ajout commentaire:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { period = 'all', limit = 10 } = req.query;

    let where = {};
    if (period === 'week') {
      where = {
        updatedAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      };
    } else if (period === 'month') {
      where = {
        updatedAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      };
    }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'country', 'reputation', 'reportsCount', 'verifiedReports'],
      order: [['reputation', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ leaderboard: users });

  } catch (error) {
    logger.error('Erreur leaderboard:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du leaderboard' });
  }
};