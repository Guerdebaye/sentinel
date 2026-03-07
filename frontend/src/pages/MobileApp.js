import React, { useState } from 'react';
import { generateThreat } from '../services/mockData';

export default function MobileApp() {
  const [selectedTab, setSelectedTab] = useState('features');
  const [downloadCount] = useState(15234);
  const [activeUsers] = useState(8723);
  const [rating] = useState(4.8);

  const features = [
    {
      icon: '📱',
      title: 'Analyse en temps réel',
      description: 'Scannez photos, vidéos et textes instantanément',
      demo: '🎬 0.3s'
    },
    {
      icon: '🔒',
      title: 'Traitement local',
      description: 'Toutes les analyses sur votre appareil - zéro envoi de données',
      demo: '🔐 100% privé'
    },
    {
      icon: '⚡',
      title: 'Détection deepfake',
      description: 'Identifiez les vidéos manipulées avec 94% de précision',
      demo: '🎯 94%'
    },
    {
      icon: '🌍',
      title: 'Réseau communautaire',
      description: 'Contribuez à protéger votre communauté',
      demo: '👥 15K+'
    },
    {
      icon: '📊',
      title: 'Alertes en direct',
      description: 'Notifications des menaces autour de vous',
      demo: '🚨 Temps réel'
    },
    {
      icon: '🏆',
      title: 'Système de récompenses',
      description: 'Gagnez des tokens pour vos signalements vérifiés',
      demo: '💰 500+ gagnants'
    }
  ];

  const screenshots = [
    { id: 1, name: 'Dashboard', image: '📱' },
    { id: 2, name: 'Scan', image: '🔍' },
    { id: 3, name: 'Alertes', image: '🚨' },
    { id: 4, name: 'Communauté', image: '👥' },
  ];

  const reviews = [
    { user: 'Moussa D.', rating: 5, comment: 'Application indispensable au Sénégal. J\'ai déjà détecté 3 deepfakes !', country: '🇸🇳' },
    { user: 'Aïssata K.', rating: 5, comment: 'Simple d\'utilisation et vraiment efficace. Bravo !', country: '🇨🇮' },
    { user: 'Ibrahim T.', rating: 4, comment: 'L\'analyse locale est impressionnante. Je me sens plus en sécurité.', country: '🇲🇱' },
  ];

  return (
    <div className="mobile-page">
      {/* Hero Section */}
      <div className="mobile-hero">
        <div className="hero-content">
          <span className="hero-badge">📱 Disponible sur iOS & Android (en cours de développement)</span>
          <h1 className="hero-title">Sentinel Mobile</h1>
          <p className="hero-subtitle">Votre garde du corps numérique,<br />directement dans votre poche</p>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{downloadCount.toLocaleString()}+</span>
              <span className="stat-label">Téléchargements</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{activeUsers.toLocaleString()}</span>
              <span className="stat-label">Utilisateurs actifs</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{rating} ★</span>
              <span className="stat-label">Note moyenne</span>
            </div>
          </div>

          <div className="hero-buttons">
            <button className="download-btn ios">
              <span className="btn-icon">🍎</span>
              <span className="btn-text">
                <small>Télécharger sur</small>
                <strong>App Store</strong>
              </span>
            </button>
            <button className="download-btn android">
              <span className="btn-icon">🤖</span>
              <span className="btn-text">
                <small>Disponible sur</small>
                <strong>Google Play</strong>
              </span>
            </button>
          </div>

          <div className="qr-code">
            <div className="qr-placeholder">📱</div>
            <span>Scanner pour télécharger</span>
          </div>
        </div>

        <div className="hero-mockup">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="mockup-header">
                <span className="time">14:23</span>
                <span className="battery">🔋 87%</span>
              </div>
              <div className="mockup-content">
                <div className="mockup-scan">
                  <div className="scan-animation">
                    <div className="scan-line"></div>
                  </div>
                  <div className="scan-result safe">
                    <span className="result-icon">✅</span>
                    <span>Contenu authentique</span>
                  </div>
                </div>
                <div className="mockup-stats">
                  <div className="mockup-stat">
                    <span className="stat-value">94%</span>
                    <span>Précision</span>
                  </div>
                  <div className="mockup-stat">
                    <span className="stat-value">0.3s</span>
                    <span>Analyse</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Tabs */}
      <div className="mobile-tabs">
        <button 
          className={`tab ${selectedTab === 'features' ? 'active' : ''}`}
          onClick={() => setSelectedTab('features')}
        >
          Fonctionnalités
        </button>
        <button 
          className={`tab ${selectedTab === 'demo' ? 'active' : ''}`}
          onClick={() => setSelectedTab('demo')}
        >
          Démo interactive
        </button>
        <button 
          className={`tab ${selectedTab === 'community' ? 'active' : ''}`}
          onClick={() => setSelectedTab('community')}
        >
          Communauté
        </button>
      </div>

      {selectedTab === 'features' && (
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-demo">{feature.demo}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'demo' && (
        <div className="demo-section">
          <div className="demo-panel">
            <h3>Essayez la détection en direct</h3>
            <div className="demo-upload">
              <div className="demo-zone">
                <span className="demo-icon">📸</span>
                <span className="demo-text">Prenez une photo ou une vidéo</span>
                <button className="demo-camera-btn">Ouvrir la caméra</button>
              </div>
              <div className="demo-gallery">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="demo-thumbnail">
                    <span className="thumb-icon">🎬</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="demo-result">
              <div className="result-header">
                <span className="result-title">Résultat de l'analyse</span>
                <span className="result-badge">Démonstration</span>
              </div>
              <div className="result-content">
                <div className="result-indicator safe">
                  <span className="indicator-icon">✓</span>
                </div>
                <div className="result-details">
                  <strong>Contenu authentique</strong>
                  <span>Confiance: 97%</span>
                  <div className="result-progress">
                    <div className="progress-bar" style={{ width: '97%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="demo-features">
            <h4>Autres fonctionnalités disponibles :</h4>
            <ul className="demo-list">
              <li>🔍 Scan de texte / URL</li>
              <li>📊 Historique des analyses</li>
              <li>🚨 Alertes personnalisées</li>
              <li>🌍 Carte des menaces locales</li>
            </ul>
          </div>
        </div>
      )}

      {selectedTab === 'community' && (
        <div className="community-section">
          <div className="community-stats">
            <div className="community-stat-card">
              <span className="stat-icon">👥</span>
              <span className="stat-value">15,234</span>
              <span className="stat-label">Membres actifs</span>
            </div>
            <div className="community-stat-card">
              <span className="stat-icon">🚨</span>
              <span className="stat-value">8,921</span>
              <span className="stat-label">Signalements</span>
            </div>
            <div className="community-stat-card">
              <span className="stat-icon">✓</span>
              <span className="stat-value">6,547</span>
              <span className="stat-label">Vérifiés</span>
            </div>
          </div>

          <div className="leaderboard-section">
            <h4>Top contributeurs cette semaine</h4>
            <div className="leaderboard">
              {[
                { rank: 1, name: 'Dakar_Lion', points: 1234, country: '🇸🇳' },
                { rank: 2, name: 'Abidjan_Eagle', points: 987, country: '🇨🇮' },
                { rank: 3, name: 'Bamako_Fox', points: 856, country: '🇲🇱' },
                { rank: 4, name: 'Ouaga_Watch', points: 743, country: '🇧🇫' },
                { rank: 5, name: 'Lome_Guard', points: 621, country: '🇹�' },
              ].map(user => (
                <div key={user.rank} className="leaderboard-item">
                  <span className="rank">#{user.rank}</span>
                  <span className="country">{user.country}</span>
                  <span className="name">{user.name}</span>
                  <span className="points">{user.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reviews-section">
            <h4>Ce que disent les utilisateurs</h4>
            <div className="reviews-grid">
              {reviews.map((review, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{review.user}</span>
                    <span className="review-country">{review.country}</span>
                  </div>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="review-comment">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Download Section */}
      <div className="download-section">
        <h2>Prêt à rejoindre la communauté ?</h2>
        <p>Téléchargez l'application et commencez à protéger votre entourage</p>
        <div className="download-buttons">
          <button className="download-btn ios large">
            <span className="btn-icon">🍎</span>
            <span className="btn-text">
              <small>Télécharger sur</small>
              <strong>App Store</strong>
            </span>
          </button>
          <button className="download-btn android large">
            <span className="btn-icon">🤖</span>
            <span className="btn-text">
              <small>Disponible sur</small>
              <strong>Google Play</strong>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
