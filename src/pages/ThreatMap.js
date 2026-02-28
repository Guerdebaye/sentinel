import React, { useState, useEffect } from 'react';
import { generateThreat } from '../services/mockData';

export default function ThreatMap() {
  const [threats, setThreats] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('west-africa');
  const [timeRange, setTimeRange] = useState('24h');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setThreats(Array.from({ length: 25 }, () => generateThreat()));
  }, []);

  const regions = {
    'west-africa': { name: 'Afrique de l\'Ouest', countries: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Guinée', 'Burkina Faso', 'Togo', 'Bénin'] },
    'senegal': { name: 'Sénégal', cities: ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack'] },
    'civ': { name: 'Côte d\'Ivoire', cities: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro'] },
  };

  const hotspots = [
    { x: 30, y: 45, city: 'Dakar', country: 'Sénégal', threats: 24, level: 'high' },
    { x: 45, y: 55, city: 'Abidjan', country: 'Côte d\'Ivoire', threats: 18, level: 'high' },
    { x: 40, y: 40, city: 'Bamako', country: 'Mali', threats: 12, level: 'medium' },
    { x: 35, y: 50, city: 'Conakry', country: 'Guinée', threats: 8, level: 'medium' },
    { x: 50, y: 45, city: 'Ouagadougou', country: 'Burkina Faso', threats: 15, level: 'high' },
    { x: 48, y: 52, city: 'Lomé', country: 'Togo', threats: 6, level: 'low' },
    { x: 52, y: 50, city: 'Cotonou', country: 'Bénin', threats: 7, level: 'low' },
  ];

  const filteredThreats = threats.filter(t => {
    if (filter === 'all') return true;
    return t.level === filter;
  });

  return (
    <div className="threat-map-page">
      <div className="page-header">
        <h1 className="page-title">Carte Interactive des Menaces</h1>
        <div className="page-controls">
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="select-control">
            <option value="west-africa">Afrique de l'Ouest</option>
            <option value="senegal">Sénégal</option>
            <option value="civ">Côte d'Ivoire</option>
          </select>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="select-control">
            <option value="1h">Dernière heure</option>
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
        </div>
      </div>

      <div className="map-container">
        <div className="main-map">
          <svg viewBox="0 0 800 600" className="africa-map">
            {/* Fond de carte */}
            <path d="M200,100 L600,100 L700,200 L750,300 L700,400 L600,500 L400,550 L200,500 L100,400 L50,300 L100,200 L200,100" 
                  fill="rgba(0,40,60,0.6)" stroke="rgba(0,207,255,0.3)" strokeWidth="2"/>

            {/* Grille */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="50" y1={100 + i * 50} x2="750" y2={100 + i * 50} 
                    stroke="rgba(0,207,255,0.1)" strokeWidth="1" strokeDasharray="5,5"/>
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`v-${i}`} x1={50 + i * 50} y1="50" x2={50 + i * 50} y2="550" 
                    stroke="rgba(0,207,255,0.1)" strokeWidth="1" strokeDasharray="5,5"/>
            ))}

            {/* Hotspots */}
            {hotspots.map((spot, i) => (
              <g key={i} className="hotspot" onClick={() => console.log(`Selected: ${spot.city}`)}>
                <circle cx={spot.x * 10} cy={spot.y * 10} r={Math.min(30, 10 + spot.threats)} 
                        fill={spot.level === 'high' ? 'rgba(255,59,107,0.3)' : spot.level === 'medium' ? 'rgba(255,214,10,0.3)' : 'rgba(0,255,157,0.3)'}
                        stroke={spot.level === 'high' ? '#ff3b6b' : spot.level === 'medium' ? '#ffd60a' : '#00ff9d'}
                        strokeWidth="2"
                        className="pulse-circle"/>
                <circle cx={spot.x * 10} cy={spot.y * 10} r="6" 
                        fill={spot.level === 'high' ? '#ff3b6b' : spot.level === 'medium' ? '#ffd60a' : '#00ff9d'}/>
                <text x={spot.x * 10 + 10} y={spot.y * 10 - 10} fill="white" fontSize="10" fontFamily="'Share Tech Mono'">
                  {spot.city} ({spot.threats})
                </text>
              </g>
            ))}

            {/* Légende */}
            <g transform="translate(50, 500)">
              <rect width="200" height="80" fill="rgba(0,10,20,0.8)" stroke="rgba(0,207,255,0.3)" rx="4"/>
              <text x="10" y="20" fill="#00cfff" fontSize="12">Niveau de menace</text>
              <circle cx="20" cy="40" r="6" fill="#ff3b6b"/>
              <text x="35" y="45" fill="white" fontSize="10">Élevé</text>
              <circle cx="20" cy="60" r="6" fill="#ffd60a"/>
              <text x="35" y="65" fill="white" fontSize="10">Moyen</text>
              <circle cx="100" cy="40" r="6" fill="#00ff9d"/>
              <text x="115" y="45" fill="white" fontSize="10">Faible</text>
            </g>
          </svg>

          {/* Scanning overlay */}
          <div className="scanning-overlay" />
        </div>

        <div className="map-sidebar">
          <div className="stats-summary">
            <h3>Statistiques {regions[selectedRegion].name}</h3>
            <div className="stat-item">
              <span className="stat-label">Menaces totales</span>
              <span className="stat-value">{filteredThreats.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Critiques</span>
              <span className="stat-value danger">{threats.filter(t => t.level === 'high').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Moyennes</span>
              <span className="stat-value warning">{threats.filter(t => t.level === 'medium').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Faibles</span>
              <span className="stat-value safe">{threats.filter(t => t.level === 'low').length}</span>
            </div>
          </div>

          <div className="filter-controls">
            <h3>Filtrer par type</h3>
            <div className="filter-buttons">
              <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                Tous
              </button>
              <button className={`filter-btn danger ${filter === 'high' ? 'active' : ''}`} onClick={() => setFilter('high')}>
                Critiques
              </button>
              <button className={`filter-btn warning ${filter === 'medium' ? 'active' : ''}`} onClick={() => setFilter('medium')}>
                Moyens
              </button>
              <button className={`filter-btn safe ${filter === 'low' ? 'active' : ''}`} onClick={() => setFilter('low')}>
                Faibles
              </button>
            </div>
          </div>

          <div className="recent-alerts">
            <h3>Alertes récentes</h3>
            <div className="alert-list">
              {threats.slice(0, 5).map(threat => (
                <div key={threat.id} className={`alert-item ${threat.level}`}>
                  <span className="alert-time">{threat.time}</span>
                  <span className="alert-type">{threat.type}</span>
                  <span className="alert-location">{threat.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}