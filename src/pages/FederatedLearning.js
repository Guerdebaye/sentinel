import React, { useState, useEffect } from 'react';

export default function FederatedLearning() {
  const [round, setRound] = useState(1247);
  const [accuracy, setAccuracy] = useState(94.2);
  const [participants, setParticipants] = useState(12478);
  const [globalModel, setGlobalModel] = useState({
    version: '2.4.0',
    parameters: 15700000,
    lastUpdated: '2024-01-15 14:23:45'
  });

  const [nodes, setNodes] = useState([
    { id: 1, name: 'Dakar-01', status: 'training', progress: 78, accuracy: 94.2, dataSamples: 1248 },
    { id: 2, name: 'Abidjan-03', status: 'idle', progress: 100, accuracy: 93.8, dataSamples: 982 },
    { id: 3, name: 'Bamako-02', status: 'training', progress: 45, accuracy: 92.5, dataSamples: 743 },
    { id: 4, name: 'Ouaga-01', status: 'syncing', progress: 89, accuracy: 93.1, dataSamples: 856 },
    { id: 5, name: 'Lomé-01', status: 'training', progress: 62, accuracy: 91.9, dataSamples: 523 },
    { id: 6, name: 'Conakry-02', status: 'idle', progress: 100, accuracy: 92.7, dataSamples: 634 },
  ]);

  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    // Simuler des données d'historique
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        round: i,
        accuracy: 85 + Math.sin(i / 5) * 5 + Math.random() * 3,
        participants: 8000 + i * 200 + Math.random() * 1000,
      });
    }
    setHistoryData(data);

    // Simuler des mises à jour
    const interval = setInterval(() => {
      setRound(r => r + 1);
      setAccuracy(a => Math.min(99.9, a + (Math.random() - 0.5) * 0.2));
      setParticipants(p => p + Math.floor(Math.random() * 10));
      
      setNodes(prev => prev.map(node => ({
        ...node,
        progress: node.status === 'training' ? Math.min(100, node.progress + Math.random() * 5) : node.progress,
        accuracy: node.accuracy + (Math.random() - 0.5) * 0.1,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="federated-page">
      <div className="page-header">
        <h1 className="page-title">Apprentissage Fédéré</h1>
        <div className="model-info">
          <span className="model-badge">Modèle Global v{globalModel.version}</span>
          <span className="model-badge">{globalModel.parameters.toLocaleString()} paramètres</span>
          <span className="model-badge">Mis à jour: {globalModel.lastUpdated}</span>
        </div>
      </div>

      <div className="fl-grid">
        <div className="panel fl-stats-panel">
          <div className="stats-row">
            <div className="fl-stat">
              <div className="fl-stat-value">{round}</div>
              <div className="fl-stat-label">Round actuel</div>
            </div>
            <div className="fl-stat">
              <div className="fl-stat-value">{accuracy.toFixed(1)}%</div>
              <div className="fl-stat-label">Précision globale</div>
            </div>
            <div className="fl-stat">
              <div className="fl-stat-value">{participants.toLocaleString()}</div>
              <div className="fl-stat-label">Participants</div>
            </div>
          </div>

          <div className="fl-progress">
            <div className="progress-label">
              <span>Progression du round</span>
              <span>78%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '78%' }} />
            </div>
          </div>
        </div>

        <div className="panel fl-visualization">
          <div className="panel-title">Architecture du Réseau Fédéré</div>
          <div className="network-viz">
            <svg viewBox="0 0 600 400">
              {/* Nœud central (modèle global) */}
              <circle cx="300" cy="200" r="50" fill="url(#globalGradient)" />
              <circle cx="300" cy="200" r="30" fill="#00ff9d" />
              <text x="300" y="210" textAnchor="middle" fill="black" fontSize="12">GLOBAL</text>

              {/* Nœuds participants */}
              {[
                { x: 150, y: 80, name: 'DAKAR' },
                { x: 450, y: 80, name: 'ABIDJAN' },
                { x: 100, y: 300, name: 'BAMAKO' },
                { x: 500, y: 300, name: 'OUAGA' },
                { x: 200, y: 350, name: 'LOMÉ' },
                { x: 400, y: 350, name: 'CONAKRY' },
              ].map((node, i) => (
                <g key={i}>
                  <circle cx={node.x} cy={node.y} r="25" fill="rgba(0,207,255,0.3)" />
                  <circle cx={node.x} cy={node.y} r="15" fill="#00cfff" />
                  <text x={node.x} y={node.y + 35} textAnchor="middle" fill="#c0e8ff" fontSize="10">
                    {node.name}
                  </text>
                  {/* Lignes de connexion */}
                  <line x1={300} y1={200} x2={node.x} y2={node.y} 
                        stroke="rgba(0,255,157,0.3)" strokeWidth="1" strokeDasharray="5,5">
                    <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite" />
                  </line>
                </g>
              ))}

              {/* Particules de données */}
              <circle cx="180" cy="120" r="3" fill="#00ff9d">
                <animateMotion path="M 0,0 L 120,80" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="420" cy="120" r="3" fill="#00ff9d">
                <animateMotion path="M 0,0 L -120,80" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>

        <div className="panel accuracy-chart">
          <div className="panel-title">Évolution de la Précision</div>
          <div className="chart-container">
            {historyData.map((point, i) => (
              <div key={i} className="chart-column" style={{ left: `${(i / historyData.length) * 100}%` }}>
                <div className="chart-dot" style={{ bottom: `${(point.accuracy - 80) * 5}px` }} />
                {i % 4 === 0 && (
                  <div className="chart-label">
                    <span>R{point.round}</span>
                    <span>{point.accuracy.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="panel nodes-table">
          <div className="panel-title">
            Nœuds Participants
            <span className="badge">{nodes.length} en ligne</span>
          </div>

          <table className="nodes-grid">
            <thead>
              <tr>
                <th>Nœud</th>
                <th>Statut</th>
                <th>Progression</th>
                <th>Précision</th>
                <th>Échantillons</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(node => (
                <tr key={node.id}>
                  <td>{node.name}</td>
                  <td>
                    <span className={`status-badge ${node.status}`}>
                      {node.status === 'training' ? '🏃 Entraînement' : 
                       node.status === 'syncing' ? '🔄 Synchronisation' : '⏸️ En attente'}
                    </span>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-mini">
                        <div className="progress-mini-fill" style={{ width: `${node.progress}%` }} />
                      </div>
                      <span>{node.progress}%</span>
                    </div>
                  </td>
                  <td>{node.accuracy.toFixed(1)}%</td>
                  <td>{node.dataSamples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel aggregation-panel">
          <div className="panel-title">Processus d'Agrégation (FedAvg)</div>
          
          <div className="aggregation-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Distribution du modèle</strong>
                <small>Modèle global v{globalModel.version} envoyé à {participants} nœuds</small>
              </div>
            </div>
            
            <div className="step active">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Entraînement local</strong>
                <small>{nodes.filter(n => n.status === 'training').length} nœuds en cours d'entraînement</small>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Agrégation sécurisée</strong>
                <small>Secure Aggregation · Chiffrement homomorphe</small>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <strong>Mise à jour globale</strong>
                <small>Prochaine aggregation dans 2 min 34s</small>
              </div>
            </div>
          </div>

          <div className="privacy-badge">
            <span className="icon">🔐</span>
            <span>Differential Privacy activée · ε = 2.0</span>
          </div>
        </div>

        <div className="panel model-parameters">
          <div className="panel-title">Paramètres du Modèle</div>
          
          <div className="params-grid">
            <div className="param-category">
              <h4>Vision par ordinateur</h4>
              <div className="param-item">
                <span>Détection deepfake</span>
                <span className="param-value">98.2%</span>
              </div>
              <div className="param-item">
                <span>Analyse faciale</span>
                <span className="param-value">94.7%</span>
              </div>
              <div className="param-item">
                <span>Détection artefacts</span>
                <span className="param-value">92.3%</span>
              </div>
            </div>

            <div className="param-category">
              <h4>Traitement du langage</h4>
              <div className="param-item">
                <span>Détection désinfo</span>
                <span className="param-value">91.8%</span>
              </div>
              <div className="param-item">
                <span>Analyse sentiment</span>
                <span className="param-value">88.4%</span>
              </div>
              <div className="param-item">
                <span>Classification texte</span>
                <span className="param-value">93.5%</span>
              </div>
            </div>

            <div className="param-category">
              <h4>Sécurité réseau</h4>
              <div className="param-item">
                <span>Détection phishing</span>
                <span className="param-value">95.1%</span>
              </div>
              <div className="param-item">
                <span>Analyse URL</span>
                <span className="param-value">92.6%</span>
              </div>
              <div className="param-item">
                <span>Détection malware</span>
                <span className="param-value">89.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}