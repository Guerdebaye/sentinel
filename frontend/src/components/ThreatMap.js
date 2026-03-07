// frontend/src/components/ThreatMap.js
import React, { useState, useEffect, useRef } from 'react';
import Map, { 
  Source, 
  Layer, 
  Marker, 
  Popup,
  NavigationControl,
  GeolocateControl,
  FullscreenControl
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2VudGluZWwiLCJhIjoiY2xudDFoZzhnMDFrMzJrcXM5d2xwZ2V2YyJ9.xyz';

export default function ThreatMap() {
  const [viewState, setViewState] = useState({
    longitude: -17.4677,
    latitude: 14.7167,
    zoom: 5
  });
  
  const [threats, setThreats] = useState([]);
  const [heatmapData, setHeatmapData] = useState(null);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: 'all',
    type: 'all',
    days: 7
  });

  const mapRef = useRef();

  useEffect(() => {
    loadThreats();
    
    // WebSocket pour mises à jour en temps réel
    const ws = new WebSocket('ws://localhost:5000');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new-threat') {
        setThreats(prev => [data.threat, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    loadHeatmap();
  }, [filters]);

  const loadThreats = async () => {
    try {
      const response = await axios.get('/api/threats', {
        params: { limit: 100 }
      });
      setThreats(response.data.threats);
    } catch (error) {
      console.error('Erreur chargement menaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHeatmap = async () => {
    try {
      const response = await axios.get('/api/threats/heatmap', {
        params: {
          days: filters.days
        }
      });
      
      setHeatmapData({
        type: 'FeatureCollection',
        features: response.data.heatmapData.map(point => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          },
          properties: {
            weight: point.weight,
            type: point.type,
            city: point.city
          }
        }))
      });
    } catch (error) {
      console.error('Erreur chargement heatmap:', error);
    }
  };

  const getMarkerColor = (level) => {
    switch(level) {
      case 'critical': return '#ff3b6b';
      case 'high': return '#ff6b3b';
      case 'medium': return '#ffd60a';
      case 'low': return '#00ff9d';
      default: return '#00cfff';
    }
  };

  return (
    <div className="threat-map-container">
      <div className="map-filters">
        <select 
          value={filters.level} 
          onChange={(e) => setFilters({...filters, level: e.target.value})}
        >
          <option value="all">Tous niveaux</option>
          <option value="critical">Critique</option>
          <option value="high">Élevé</option>
          <option value="medium">Moyen</option>
          <option value="low">Faible</option>
        </select>

        <select 
          value={filters.type} 
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="all">Tous types</option>
          <option value="deepfake">Deepfake</option>
          <option value="phishing">Phishing</option>
          <option value="misinformation">Désinformation</option>
          <option value="scam">Arnaque</option>
        </select>

        <select 
          value={filters.days} 
          onChange={(e) => setFilters({...filters, days: e.target.value})}
        >
          <option value="1">24h</option>
          <option value="7">7 jours</option>
          <option value="30">30 jours</option>
          <option value="90">90 jours</option>
        </select>
      </div>

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '600px' }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Heatmap Layer */}
        {heatmapData && (
          <Source id="heatmap" type="geojson" data={heatmapData}>
            <Layer
              id="heatmap-layer"
              type="heatmap"
              paint={{
                'heatmap-weight': ['get', 'weight'],
                'heatmap-intensity': 1,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0, 255, 157, 0)',
                  0.2, '#00ff9d',
                  0.4, '#ffd60a',
                  0.6, '#ff6b3b',
                  0.8, '#ff3b6b'
                ],
                'heatmap-radius': 30
              }}
            />
          </Source>
        )}

        {/* Markers */}
        {threats
          .filter(t => filters.level === 'all' || t.level === filters.level)
          .filter(t => filters.type === 'all' || t.type === filters.type)
          .map(threat => (
            <Marker
              key={threat.id}
              longitude={threat.location?.coordinates[0] || -17.4677}
              latitude={threat.location?.coordinates[1] || 14.7167}
              onClick={() => setSelectedThreat(threat)}
            >
              <div 
                className="threat-marker"
                style={{ backgroundColor: getMarkerColor(threat.level) }}
              >
                <span className="marker-pulse"></span>
              </div>
            </Marker>
          ))}

        {/* Popup */}
        {selectedThreat && (
          <Popup
            longitude={selectedThreat.location?.coordinates[0] || -17.4677}
            latitude={selectedThreat.location?.coordinates[1] || 14.7167}
            onClose={() => setSelectedThreat(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="threat-popup">
              <h3>{selectedThreat.title}</h3>
              <div className={`threat-level ${selectedThreat.level}`}>
                {selectedThreat.level.toUpperCase()}
              </div>
              <p>{selectedThreat.description}</p>
              <div className="popup-meta">
                <span>📍 {selectedThreat.city}, {selectedThreat.country}</span>
                <span>🕐 {new Date(selectedThreat.createdAt).toLocaleString()}</span>
                <span>🎯 Confiance: {selectedThreat.confidence?.toFixed(1)}%</span>
              </div>
              <button 
                className="view-details"
                onClick={() => window.location.href = `/threats/${selectedThreat.id}`}
              >
                Voir détails
              </button>
            </div>
          </Popup>
        )}
      </Map>

      {loading && (
        <div className="map-loading">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      )}
    </div>
  );
}