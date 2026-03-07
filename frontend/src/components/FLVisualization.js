import React, { useEffect, useState } from 'react';

export default function FLVisualization() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Générer des particules pour la visualisation
    const newParticles = [];
    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: i,
        x: 140,
        y: 90,
        targetX: 50 + Math.random() * 200,
        targetY: 30 + Math.random() * 150,
        progress: Math.random(),
      });
    }
    setParticles(newParticles);

    // Animation des particules
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        progress: (p.progress + 0.02) % 1,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fl-viz">
      <svg viewBox="0 0 280 190" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="#00ff9d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00ff9d" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Lignes de connexion */}
        {particles.map(p => (
          <line
            key={`line-${p.id}`}
            x1="140"
            y1="90"
            x2={p.targetX}
            y2={p.targetY}
            stroke="rgba(0,255,157,0.2)"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        ))}

        {/* Particules */}
        {particles.map(p => {
          const currentX = 140 + (p.targetX - 140) * p.progress;
          const currentY = 90 + (p.targetY - 90) * p.progress;
          return (
            <circle
              key={`particle-${p.id}`}
              cx={currentX}
              cy={currentY}
              r="3"
              fill={p.id % 2 === 0 ? '#00ff9d' : '#00cfff'}
            >
              <animate
                attributeName="r"
                values="3;5;3"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Nœuds périphériques */}
        {[
          { x: 50, y: 30 },
          { x: 230, y: 30 },
          { x: 270, y: 100 },
          { x: 220, y: 160 },
          { x: 60, y: 160 },
          { x: 10, y: 100 },
        ].map((pos, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="8"
              fill="rgba(0,30,50,0.8)"
              stroke="rgba(0,207,255,0.5)"
              strokeWidth="1"
            />
            <circle cx={pos.x} cy={pos.y} r="4" fill="#00cfff" />
          </g>
        ))}

        {/* Nœud central */}
        <circle cx="140" cy="90" r="30" fill="url(#centerGlow)" />
        <circle cx="140" cy="90" r="15" fill="#00ff9d" />
      </svg>
    </div>
  );
}