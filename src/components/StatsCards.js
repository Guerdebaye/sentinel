import React from 'react';

export default function StatsCards({ stats }) {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">🚨</div>
        <div className="stat-details">
          <div className="stat-value">{stats.detected.toLocaleString()}</div>
          <div className="stat-label">Menaces détectées</div>
        </div>
        <div className="stat-trend positive">↑ 12%</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🛡️</div>
        <div className="stat-details">
          <div className="stat-value">{stats.blocked.toLocaleString()}</div>
          <div className="stat-label">Menaces bloquées</div>
        </div>
        <div className="stat-trend positive">↑ 8%</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🎯</div>
        <div className="stat-details">
          <div className="stat-value">{stats.accuracy.toFixed(1)}%</div>
          <div className="stat-label">Précision IA</div>
        </div>
        <div className="stat-trend positive">+0.3%</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🌍</div>
        <div className="stat-details">
          <div className="stat-value">{stats.nodes.toLocaleString()}</div>
          <div className="stat-label">Utilisateurs protégés</div>
        </div>
        <div className="stat-trend positive">+124</div>
      </div>
    </div>
  );
}