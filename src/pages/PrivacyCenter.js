import React, { useState } from 'react';

export default function PrivacyCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [consentGiven, setConsentGiven] = useState({
    localTraining: true,
    parameterSharing: true,
    differentialPrivacy: true,
    dataRetention: false,
  });

  const [dataStats, setDataStats] = useState({
    localSamples: 1247,
    contributions: 892,
    lastContribution: '2024-01-15 14:23',
    privacyBudget: 2.0,
  });

  return (
    <div className="privacy-page">
      <div className="page-header">
        <h1 className="page-title">Centre de Vie Privée</h1>
        <div className="privacy-badge">
          <span className="icon">🔒</span>
          <span>RGPD & Loi Informatique et Libertés compliant</span>
        </div>
      </div>

      <div className="privacy-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Vue d'ensemble
        </button>
        <button className={`tab ${activeTab === 'controls' ? 'active' : ''}`} onClick={() => setActiveTab('controls')}>
          Contrôles
        </button>
        <button className={`tab ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
          Mes données
        </button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Historique
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="privacy-overview">
          <div className="panel principles-panel">
            <h3>Principes fondamentaux</h3>
            <div className="principles-grid">
              <div className="principle-card">
                <span className="principle-icon">📱</span>
                <h4>Traitement local</h4>
                <p>Toutes les analyses sont effectuées sur votre appareil. Aucune donnée brute n'est transférée.</p>
              </div>
              <div className="principle-card">
                <span className="principle-icon">🔄</span>
                <h4>Apprentissage fédéré</h4>
                <p>Seuls les paramètres du modèle sont partagés, jamais vos données personnelles.</p>
              </div>
              <div className="principle-card">
                <span className="principle-icon">🔐</span>
                <h4>Chiffrement homomorphe</h4>
                <p>Les calculs sont effectués sur des données chiffrées, garantissant une confidentialité absolue.</p>
              </div>
              <div className="principle-card">
                <span className="principle-icon">🎯</span>
                <h4>Differential Privacy</h4>
                <p>Du bruit statistique est ajouté pour empêcher toute ré-identification.</p>
              </div>
            </div>
          </div>

          <div className="panel stats-panel">
            <h3>Statistiques de confidentialité</h3>
            <div className="privacy-stats">
              <div className="stat-item">
                <div className="stat-value">{dataStats.localSamples}</div>
                <div className="stat-label">Échantillons analysés localement</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{dataStats.contributions}</div>
                <div className="stat-label">Contributions au modèle global</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">ε = {dataStats.privacyBudget}</div>
                <div className="stat-label">Budget de confidentialité</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">100%</div>
                <div className="stat-label">Données jamais partagées</div>
              </div>
            </div>
          </div>

          <div className="panel guarantees-panel">
            <h3>Garanties légales</h3>
            <div className="guarantees-list">
              {[
                'Conformité RGPD (Règlement Général sur la Protection des Données)',
                'Respect de la loi sénégalaise n°2008-12 sur la protection des données',
                'Droit à l\'oubli et à l\'effacement des données',
                'Portabilité des données',
                'Droit d\'opposition au traitement',
                'Délégation à la protection des données (DPO) disponible',
              ].map((guarantee, i) => (
                <div key={i} className="guarantee-item">
                  <span className="check">✓</span>
                  <span>{guarantee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'controls' && (
        <div className="privacy-controls">
          <div className="panel">
            <h3>Préférences de confidentialité</h3>
            
            <div className="control-group">
              <div className="control-item">
                <div className="control-info">
                  <h4>Entraînement local</h4>
                  <p>Autoriser l'IA à s'entraîner sur vos données localement</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={consentGiven.localTraining} 
                         onChange={(e) => setConsentGiven({...consentGiven, localTraining: e.target.checked})} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="control-item">
                <div className="control-info">
                  <h4>Partage des paramètres</h4>
                  <p>Contribuer à l'amélioration du modèle global (anonyme)</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={consentGiven.parameterSharing} 
                         onChange={(e) => setConsentGiven({...consentGiven, parameterSharing: e.target.checked})} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="control-item">
                <div className="control-info">
                  <h4>Differential Privacy</h4>
                  <p>Ajouter du bruit pour renforcer l'anonymat</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={consentGiven.differentialPrivacy} 
                         onChange={(e) => setConsentGiven({...consentGiven, differentialPrivacy: e.target.checked})} />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="control-item">
                <div className="control-info">
                  <h4>Conservation des données</h4>
                  <p>Garder un historique local des analyses</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={consentGiven.dataRetention} 
                         onChange={(e) => setConsentGiven({...consentGiven, dataRetention: e.target.checked})} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="control-actions">
              <button className="save-btn">Enregistrer les préférences</button>
              <button className="reset-btn">Réinitialiser</button>
            </div>
          </div>

          <div className="panel">
            <h3>Budget de confidentialité</h3>
            <div className="budget-visualization">
              <div className="budget-bar">
                <div className="budget-used" style={{ width: `${(dataStats.privacyBudget / 10) * 100}%` }} />
              </div>
              <div className="budget-info">
                <span>Utilisé: ε = {dataStats.privacyBudget}</span>
                <span>Limite: ε = 10.0</span>
              </div>
            </div>
            <p className="budget-explanation">
              Le budget de confidentialité (ε) mesure la perte de privacy. Plus il est bas, plus vos données sont protégées. 
              Sentinel utilise ε = 2.0 par défaut, garantissant un excellent niveau de protection.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="data-management">
          <div className="panel">
            <h3>Gérer mes données</h3>
            
            <div className="data-actions">
              <button className="data-action">
                <span className="action-icon">📥</span>
                <span className="action-text">Télécharger mes données</span>
                <small>Format JSON · Conforme RGPD</small>
              </button>

              <button className="data-action">
                <span className="action-icon">🔄</span>
                <span className="action-text">Transférer mes données</span>
                <small>Portabilité vers un autre service</small>
              </button>

              <button className="data-action warning">
                <span className="action-icon">🗑️</span>
                <span className="action-text">Supprimer mes données</span>
                <small>Action irréversible</small>
              </button>

              <button className="data-action">
                <span className="action-icon">✏️</span>
                <span className="action-text">Rectifier mes données</span>
                <small>Corriger des informations</small>
              </button>
            </div>
          </div>

          <div className="panel">
            <h3>Dernières activités</h3>
            <div className="data-log">
              {[
                { action: 'Analyse deepfake', date: '2024-01-15 14:23:45', type: 'locale' },
                { action: 'Contribution modèle', date: '2024-01-15 12:10:22', type: 'parametres' },
                { action: 'Signalement communauté', date: '2024-01-15 09:45:33', type: 'anonyme' },
                { action: 'Mise à jour modèle local', date: '2024-01-14 23:12:18', type: 'systeme' },
              ].map((entry, i) => (
                <div key={i} className="log-entry">
                  <span className="log-action">{entry.action}</span>
                  <span className="log-date">{entry.date}</span>
                  <span className={`log-type ${entry.type}`}>{entry.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}