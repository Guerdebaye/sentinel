const jwt = require('jsonwebtoken');
const { User } = require('../models/associations.js');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, country, city, phoneNumber } = req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      name,
      country,
      city,
      phoneNumber,
      lastLogin: new Date()
    });

    // Générer token
    const token = generateToken(user);

    logger.info(`Nouvel utilisateur inscrit: ${email}`);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        city: user.city,
        reputation: user.reputation
      }
    });

  } catch (error) {
    logger.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, deviceId } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Mettre à jour le deviceId si fourni
    if (deviceId) {
      user.deviceId = deviceId;
      await user.save();
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Générer token
    const token = generateToken(user);

    logger.info(`Connexion réussie: ${email}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        city: user.city,
        reputation: user.reputation,
        reportsCount: user.reportsCount,
        verifiedReports: user.verifiedReports
      }
    });

  } catch (error) {
    logger.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const newToken = generateToken(user);

    res.json({ token: newToken });

  } catch (error) {
    logger.error('Erreur refresh token:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Invalider le token côté client
    // Optionnel: ajouter à une blacklist Redis
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    logger.error('Erreur déconnexion:', error);
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ user });
  } catch (error) {
    logger.error('Erreur profile:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
};