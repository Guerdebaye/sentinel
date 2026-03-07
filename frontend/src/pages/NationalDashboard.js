import React, { useState, useEffect } from 'react';

export default function NationalDashboard() {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  const [nationalStats, setNationalStats] = useState({
    totalThreats: 15234,
    activeNodes: 128,
    coverage: '78%',
    responseRate: '4.2min',
    blockedThreats: 14231,
    atRisk: 2345,
  });

  const [regionalData, setRegionalData] = useState([
    { region: 'Dakar', threats: 342, critical: 23, nodes: 42, coverage: 95 },
    { region: 'Thiès', threats: 187, critical: 12, nodes: 18, coverage: 78 },
    { region: 'Saint-Louis', threats: 156, critical: 8, nodes: 15, coverage: 72 },
    { region: 'Ziguinchor', threats: 98, critical: 5, nodes: 12, coverage: 65 },
    { region: 'Kaolack', threats: 124, critical: 7, nodes: 14, coverage: 68 },
    { region: 'Autres', threats: 423, critical: 28, nodes: 27, coverage: 45 },
  ]);

  const [threatTypes, setThreatTypes] = useState([
    { type: 'Deepfake', count: 5234, trend: '+12%' },
    { type: 'Phishing', count: 4123, trend: '+8%' },
    { type: 'Désinformation', count: 3567, trend: '+15%' },
    { type: 'Arnaque', count: 2310, trend: '+5%' },
  ]);

  useEffect(() => {
    // Simuler des mises à jour
    const interval = setInterval(() => {
      setNationalStats(prev => ({
        ...prev,
        totalThreats: prev.totalThreats + Math.floor(Math.random() * 5),
        blockedThreats: prev.blockedThreats + Math.floor(Math.random() * 4),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="national-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard National · Sénégal</h1>
        <div className="header-controls">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="select-control">
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="select-control">
            <option value="all">Toutes les régions</option>
            <option value="dakar">Dakar</option>
            <option value="thies">Thiès</option>
            <option value="saint-louis">Saint-Louis</option>
          </select>
        </div>
      </div>

      <div className="national-grid">
        {/* KPIs Principaux */}
        <div className="panel kpi-panel">
          <div className="kpi-grid">
            <div className="kpi-item">
              <div className="kpi-value">{nationalStats.totalThreats.toLocaleString()}</div>
              <div className="kpi-label">Menaces détectées</div>
              <div className="kpi-trend positive">↑ 8% vs hier</div>
            </div>
            <div className="kpi-item">
              <div className="kpi-value">{nationalStats.blockedThreats.toLocaleString()}</div>
              <div className="kpi-label">Menaces bloquées</div>
              <div className="kpi-trend positive">↑ 12% vs hier</div>
            </div>
            <div className="kpi-item">
              <div className="kpi-value">{nationalStats.activeNodes}</div>
              <div className="kpi-label">Nœuds actifs</div>
              <div className="kpi-trend positive">+4 nouveaux</div>
            </div>
            <div className="kpi-item">
              <div className="kpi-value">{nationalStats.coverage}</div>
              <div className="kpi-label">Couverture nationale</div>
              <div className="kpi-trend">Objectif 85%</div>
            </div>
            <div className="kpi-item">
              <div className="kpi-value">{nationalStats.responseRate}</div>
              <div className="kpi-label">Temps de réponse</div>
              <div className="kpi-trend positive">-0.8min</div>
            </div>
            <div className="kpi-item">
              <div className="kpi-value">{nationalStats.atRisk.toLocaleString()}</div>
              <div className="kpi-label">Utilisateurs à risque</div>
              <div className="kpi-trend negative">↑ 3%</div>
            </div>
          </div>
        </div>

        {/* Carte des menaces */}
        <div className="panel map-panel large">
          <div className="panel-title">Carte de chaleur des menaces</div>
          <div className="heat-map">
            <svg viewBox="0 0 800 400">
              {/* Carte du Sénégal simplifiée */}
              <path d="M200,50 L600,50 L700,150 L750,250 L700,350 L600,350 L400,380 L200,350 L100,250 L150,150 L200,50" 
                    fill="rgba(0,40,60,0.6)" stroke="rgba(0,207,255,0.3)" strokeWidth="2"/>

              {/* Points chauds */}
              <circle cx="300" cy="200" r="40" fill="rgba(255,59,107,0.3)" stroke="#ff3b6b">
                <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="300" y="190" textAnchor="middle" fill="white" fontSize="12">Dakar (342)</text>

              <circle cx="400" cy="250" r="30" fill="rgba(255,107,59,0.3)" stroke="#ff6b3b">
                <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="400" y="240" textAnchor="middle" fill="white" fontSize="12">Thiès (187)</text>

              <circle cx="450" cy="150" r="25" fill="rgba(255,214,10,0.3)" stroke="#ffd60a">
                <animate attributeName="r" values="25;28;25" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="450" y="140" textAnchor="middle" fill="white" fontSize="12">Saint-Louis (156)</text>

              <circle cx="250" cy="300" r="20" fill="rgba(0,255,157,0.3)" stroke="#00ff9d">
                <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="250" y="290" textAnchor="middle" fill="white" fontSize="12">Ziguinchor (98)</text>
            </svg>
          </div>
        </div>

        {/* Données régionales */}
        <div className="panel regional-table">
          <div className="panel-title">Analyse par région</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Région</th>
                <th>Menaces</th>
                <th>Critiques</th>
                <th>Nœuds</th>
                <th>Couverture</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {regionalData.map(row => (
                <tr key={row.region}>
                  <td>{row.region}</td>
                  <td>{row.threats}</td>
                  <td className={row.critical > 10 ? 'danger' : 'warning'}>{row.critical}</td>
                  <td>{row.nodes}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-mini">
                        <div className="progress-mini-fill" style={{ width: `${row.coverage}%` }} />
                      </div>
                      <span>{row.coverage}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-dot ${row.coverage > 70 ? 'green' : row.coverage > 50 ? 'yellow' : 'red'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Types de menaces */}
        <div className="panel threats-pie">
          <div className="panel-title">Répartition des menaces</div>
          <div className="pie-chart-container">
            <svg viewBox="0 0 200 200" className="pie-chart">
              <circle cx="100" cy="100" r="80" fill="transparent" stroke="#ff3b6b" strokeWidth="30" 
                      strokeDasharray="176 502" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="80" fill="transparent" stroke="#ffd60a" strokeWidth="30" 
                      strokeDasharray="141 502" strokeDashoffset="-176" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="80" fill="transparent" stroke="#00ff9d" strokeWidth="30" 
                      strokeDasharray="120 502" strokeDashoffset="-317" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="80" fill="transparent" stroke="#00cfff" strokeWidth="30" 
                      strokeDasharray="78 502" strokeDashoffset="-437" transform="rotate(-90 100 100)" />
            </svg>
          </div>
          <div className="pie-legend">
            {threatTypes.map((t, i) => (
              <div key={i} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: ['#ff3b6b', '#ffd60a', '#00ff9d', '#00cfff'][i] }} />
                <span className="legend-label">{t.type}</span>
                <span className="legend-value">{t.count}</span>
                <span className={`legend-trend ${t.trend.startsWith('+') ? 'up' : 'down'}`}>{t.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions recommandées */}
        <div className="panel actions-panel">
          <div className="panel-title">Actions Recommandées</div>
          <div className="actions-list">
            <div className="action-item high">
              <span className="action-icon">🚨</span>
              <div className="action-content">
                <strong>Pic de deepfakes à Dakar</strong>
                <small>Augmentation de 45% - Renforcer la surveillance</small>
              </div>
              <button className="action-btn">Agir</button>
            </div>
            <div className="action-item medium">
              <span className="action-icon">⚠️</span>
              <div className="action-content">
                <strong>Couverture insuffisante à Kédougou</strong>
                <small>Déployer 3 nouveaux nœuds recommandé</small>
              </div>
              <button className="action-btn">Planifier</button>
            </div>
            <div className="action-item low">
              <span className="action-icon">📊</span>
              <div className="action-content">
                <strong>Rapport hebdomadaire disponible</strong>
                <small>Synthèse des menaces - Semaine 3</small>
              </div>
              <button className="action-btn">Télécharger</button>
            </div>
          </div>
        </div>

        {/* Alertes en temps réel */}
        <div className="panel alerts-panel">
          <div className="panel-title">Alertes en Temps Réel</div>
          <div className="alerts-feed">
            {[1, 2, 3].map(i => (
              <div key={i} className="alert-item">
                <span className="alert-time">{new Date().toLocaleTimeString()}</span>
                <span className="alert-message">
                  <strong>Campagne de désinformation</strong> détectée - Ciblant les élections
                </span>
                <span className="alert-severity critical">CRITIQUE</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}