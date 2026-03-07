import React, { useState, useEffect } from 'react';
import { generateThreat } from '../services/mockData';

export default function CommunityDetection() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    activeUsers: 1247,
    totalReports: 15234,
    verifiedThreats: 8921,
    responseTime: '4.2 min'
  });
  const [newReport, setNewReport] = useState({
    type: 'deepfake',
    description: '',
    location: '',
    confidence: 70,
    fileLink: '',
    uploadedFile: null
  });

  useEffect(() => {
    // Simuler des rapports communautaires
    setReports(Array.from({ length: 15 }, (_, i) => ({
      id: i,
      user: `User${Math.floor(Math.random() * 1000)}`,
      type: ['deepfake', 'phishing', 'misinformation', 'scam'][Math.floor(Math.random() * 4)],
      description: 'Contenu suspect détecté...',
      location: ['Dakar', 'Abidjan', 'Bamako', 'Ouagadougou'][Math.floor(Math.random() * 4)],
      time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
      verified: Math.random() > 0.3,
      votes: Math.floor(Math.random() * 50),
      confidence: 50 + Math.random() * 40
    })));
  }, []);

  const submitReport = () => {
    const report = {
      ...newReport,
      id: Date.now(),
      user: 'Vous',
      time: new Date().toLocaleTimeString(),
      verified: false,
      votes: 0
    };
    setReports([report, ...reports]);
    setStats(prev => ({
      ...prev,
      totalReports: prev.totalReports + 1
    }));
    // Réinitialiser le formulaire
    setNewReport({
      type: 'deepfake',
      description: '',
      location: '',
      confidence: 70,
      fileLink: '',
      uploadedFile: null
    });
  };

  const voteReport = (id, increment) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, votes: r.votes + (increment ? 1 : -1) } : r
    ));
  };

  return (
    <div className="community-page">
      <div className="page-header">
        <h1 className="page-title">Détection Communautaire</h1>
        <div className="community-stats">
          <div className="stat-badge">
            <span className="stat-icon">👥</span>
            <span className="stat-number">{stats.activeUsers.toLocaleString()}</span>
            <span className="stat-label">détecteurs actifs</span>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">📊</span>
            <span className="stat-number">{stats.totalReports.toLocaleString()}</span>
            <span className="stat-label">signalements</span>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">✅</span>
            <span className="stat-number">{stats.verifiedThreats.toLocaleString()}</span>
            <span className="stat-label">vérifiés</span>
          </div>
        </div>
      </div>

      <div className="community-grid">
        <div className="panel report-form-panel">
          <div className="panel-title">Signaler un contenu suspect</div>
          
          <div className="form-group">
            <label>Type de menace</label>
            <select 
              value={newReport.type}
              onChange={(e) => setNewReport({...newReport, type: e.target.value})}
              className="form-control"
            >
              <option value="deepfake">Deepfake / Vidéo manipulée</option>
              <option value="phishing">Phishing / Hameçonnage</option>
              <option value="misinformation">Désinformation / Fake news</option>
              <option value="scam">Arnaque / Fraude</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newReport.description}
              onChange={(e) => setNewReport({...newReport, description: e.target.value})}
              placeholder="Décrivez le contenu suspect..."
              rows="4"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Localisation (si applicable)</label>
            <input
              type="text"
              value={newReport.location}
              onChange={(e) => setNewReport({...newReport, location: e.target.value})}
              placeholder="Ville, région..."
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Lien vers le contenu suspect</label>
            <input
              type="url"
              value={newReport.fileLink}
              onChange={(e) => setNewReport({...newReport, fileLink: e.target.value})}
              placeholder="https://exemple.com/..."
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Téléverser un fichier ou une capture d'écran</label>
            <input
              type="file"
              onChange={(e) => setNewReport({...newReport, uploadedFile: e.target.files[0]})}
              className="form-control"
              accept=".jpg,.jpeg,.png,.pdf,.mp4,.txt"
            />
            {newReport.uploadedFile && (
              <small className="file-info">
                📄 {newReport.uploadedFile.name} ({(newReport.uploadedFile.size / 1024).toFixed(2)} KB)
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Niveau de confiance: {newReport.confidence}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={newReport.confidence}
              onChange={(e) => setNewReport({...newReport, confidence: parseInt(e.target.value)})}
              className="slider"
            />
          </div>

          <button onClick={submitReport} className="submit-btn">
            SIGNALER CE CONTENU
          </button>

          <div className="privacy-note">
            <span className="icon">🔒</span>
            <span>Analyse locale uniquement · Aucune donnée partagée</span>
          </div>
        </div>

        <div className="panel reports-feed">
          <div className="panel-title">
            Signalements récents
            <span className="badge">{reports.length} signalements</span>
          </div>

          <div className="reports-list">
            {reports.map(report => (
              <div key={report.id} className="report-item">
                <div className="report-header">
                  <span className={`report-type ${report.type}`}>
                    {report.type.toUpperCase()}
                  </span>
                  <span className="report-time">{report.time}</span>
                </div>

                <div className="report-description">
                  {report.description}
                </div>

                <div className="report-meta">
                  <span className="report-user">👤 {report.user}</span>
                  <span className="report-location">📍 {report.location}</span>
                  {report.verified && (
                    <span className="report-verified">✓ Vérifié par IA</span>
                  )}
                </div>

                <div className="report-confidence">
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${report.confidence}%` }} />
                  </div>
                  <span className="confidence-value">{report.confidence.toFixed(0)}% fiable</span>
                </div>

                <div className="report-actions">
                  <button 
                    className="vote-btn"
                    onClick={() => voteReport(report.id, true)}
                  >
                    👍 {report.votes > 0 ? report.votes : ''}
                  </button>
                  <button 
                    className="vote-btn"
                    onClick={() => voteReport(report.id, false)}
                  >
                    👎
                  </button>
                  <button className="share-btn">Partager</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel community-stats-panel">
          <div className="panel-title">Impact Communautaire</div>

          <div className="impact-stats">
            <div className="impact-item">
              <div className="impact-value">{stats.verifiedThreats.toLocaleString()}</div>
              <div className="impact-label">Menaces neutralisées</div>
            </div>
            <div className="impact-item">
              <div className="impact-value">{stats.responseTime}</div>
              <div className="impact-label">Temps de réponse</div>
            </div>
            <div className="impact-item">
              <div className="impact-value">94%</div>
              <div className="impact-label">Précision collective</div>
            </div>
          </div>

          <div className="leaderboard">
            <h4>Top contributeurs</h4>
            {[
              { name: 'Dakar_Lion', reports: 234, accuracy: 98 },
              { name: 'Abidjan_Watcher', reports: 189, accuracy: 96 },
              { name: 'Bamako_Guard', reports: 156, accuracy: 95 },
              { name: 'Saint_Louis', reports: 142, accuracy: 97 },
              { name: 'Thies_Detect', reports: 128, accuracy: 94 },
            ].map((user, i) => (
              <div key={i} className="leaderboard-item">
                <span className="rank">{i + 1}</span>
                <span className="name">{user.name}</span>
                <span className="reports">{user.reports}</span>
                <span className="accuracy">{user.accuracy}%</span>
              </div>
            ))}
          </div>

          <div className="reward-badge">
            <span className="reward-icon">🏆</span>
            <div className="reward-text">
              <strong>Programme de récompenses</strong>
              <small>Gagnez des tokens pour vos signalements vérifiés</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
