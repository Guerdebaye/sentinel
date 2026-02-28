import React from 'react';

export default function ThreatFeed({ threats }) {
  return (
    <div className="panel threat-feed">
      <div className="panel-title">
        Flux de Menaces en Direct
        <span className="badge">{threats.length} actives</span>
      </div>
      
      <div className="feed-list">
        {threats.map(threat => (
          <div key={threat.id} className={`feed-item ${threat.level}`}>
            <div className="feed-time">{threat.time}</div>
            <div className="feed-content">
              <div className={`feed-type ${threat.level}`}>
                {threat.type}
                <span className="feed-level">[{threat.level}]</span>
              </div>
              <div className="feed-loc">📍 {threat.city}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="feed-footer">
        <button className="view-all-btn">Voir toutes les menaces →</button>
      </div>
    </div>
  );
}