import React, { useState, useEffect } from 'react';
import ThreatFeed from '../components/ThreatFeed';
import StatsCards from '../components/StatsCards';
import FLVisualization from '../components/FLVisualization';
import { generateThreat, getNodeData, getStats } from '../services/mockData';

export default function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState(getStats());
  const [nodes, setNodes] = useState(getNodeData());
  const [activeNode, setActiveNode] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [tab, setTab] = useState('deepfake');

  useEffect(() => {
    // Initial threats
    setThreats(Array.from({ length: 8 }, () => generateThreat()));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setThreats(prev => [generateThreat(), ...prev].slice(0, 20));
      setStats(prev => ({
        ...prev,
        detected: prev.detected + Math.floor(Math.random() * 3),
        blocked: prev.blocked + Math.floor(Math.random() * 3),
        accuracy: Math.min(99.9, prev.accuracy + (Math.random() - 0.49) * 0.1),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runScan = () => {
    setScanning(true);
    setScanResult(null);
    
    setTimeout(() => {
      const r = Math.random();
      if (r < 0.35) {
        setScanResult({
          verdict: "DEEPFAKE DÉTECTÉ",
          level: "danger",
          score: 78 + Math.random() * 20,
          conf: "HAUTE",
          details: {
            artifacts: 92,
            metadata: 78,
            temporal: 84
          }
        });
      } else if (r < 0.55) {
        setScanResult({
          verdict: "SUSPECT — VÉRIFIER",
          level: "warning",
          score: 35 + Math.random() * 30,
          conf: "MOYENNE",
          details: {
            artifacts: 45,
            metadata: 38,
            temporal: 42
          }
        });
      } else {
        setScanResult({
          verdict: "CONTENU AUTHENTIQUE",
          level: "safe",
          score: Math.random() * 20,
          conf: "HAUTE",
          details: {
            artifacts: 12,
            metadata: 8,
            temporal: 15
          }
        });
      }
      setScanning(false);
    }, 2500);
  };

  return (
    <div className="dashboard-page">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column - Nodes */}
        <div className="panel nodes-panel">
          <div className="panel-title">
            <span>Nœuds Fédérés Actifs</span>
            <span className="badge">{nodes.filter(n => n.active).length} en ligne</span>
          </div>
          <div className="node-list">
            {nodes.map(node => (
              <div
                key={node.id}
                className={`node-item ${activeNode === node.id ? 'active' : ''}`}
                onClick={() => setActiveNode(node.id)}
              >
                <div className="node-info">
                  <div className="node-name">
                    {node.name} <span className="country">{node.country}</span>
                  </div>
                  <div className="node-metrics">
                    <span className="users">{node.users.toLocaleString()} utilisateurs</span>
                    <span className={`status ${node.active ? 'online' : 'offline'}`}>
                      {node.active ? '●' : '○'}
                    </span>
                  </div>
                  <div className="node-bar">
                    <div className="node-bar-fill" style={{ width: `${node.load}%` }} />
                  </div>
                </div>
                <div className="node-stats">
                  <div className="stat small">{node.load}%</div>
                  <div className="stat-label">charge</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column - Detection & Map */}
        <div className="center-col">
          {/* Mini Map */}
          <div className="panel map-panel">
            <div className="panel-title">Aperçu des Menaces - Afrique de l'Ouest</div>
            <div className="mini-map">
              {/* Map visualization simplified */}
              <div className="map-placeholder">
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className="map-dot"
                    style={{
                      left: `${20 + node.id * 15}%`,
                      top: `${30 + node.id * 8}%`,
                      backgroundColor: node.active ? '#00ff9d' : '#ff3b6b'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Detection Tool */}
          <div className="panel detection-panel">
            <div className="tabs">
              {['deepfake', 'texte', 'url'].map(t => (
                <button
                  key={t}
                  className={`tab ${tab === t ? 'active' : ''}`}
                  onClick={() => {
                    setTab(t);
                    setScanResult(null);
                  }}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="detection-zone">
              <div className={`upload-zone ${scanning ? 'scanning' : ''}`}>
                {scanning && <div className="scanning-line" />}
                <div className="upload-icon">
                  {tab === 'deepfake' ? '🎬' : tab === 'texte' ? '📄' : '🔗'}
                </div>
                <div className="upload-text">
                  {scanning
                    ? "ANALYSE EN COURS..."
                    : `Déposer ${tab === 'deepfake' ? 'une vidéo/image' : tab === 'texte' ? 'un texte' : 'une URL'} à analyser`}
                </div>
              </div>
              <button
                className="analyze-btn"
                onClick={runScan}
                disabled={scanning}
              >
                {scanning ? '⏳ ANALYSE...' : '⚡ ANALYSER'}
              </button>
            </div>

            {scanResult && (
              <div className="result-container">
                <div className="result-header">
                  <span className="result-label">RÉSULTAT D'ANALYSE</span>
                  <span className="timestamp">{new Date().toLocaleTimeString()}</span>
                </div>
                
                <div className="result-bar-wrap">
                  <div className={`result-bar-fill ${scanResult.level}`} style={{ width: `${scanResult.score}%` }}>
                    <span className="result-percent">{scanResult.score.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="result-verdict">
                  <span className={`verdict-text ${scanResult.level}`}>
                    {scanResult.verdict}
                  </span>
                  <span className={`confidence-tag ${scanResult.level}`}>
                    CONFIANCE {scanResult.conf}
                  </span>
                </div>

                <div className="result-details">
                  {Object.entries(scanResult.details).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <div className="detail-label">{key}</div>
                      <div className="detail-value">{value}%</div>
                      <div className="detail-bar">
                        <div className="detail-bar-fill" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Threat Feed */}
        <div className="right-col">
          <ThreatFeed threats={threats} />
          
          <div className="panel fl-panel">
            <div className="panel-title">Apprentissage Fédéré</div>
            <FLVisualization />
          </div>
        </div>
      </div>
    </div>
  );
}