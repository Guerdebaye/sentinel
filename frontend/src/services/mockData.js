// Types de menaces
const THREAT_TYPES = {
  high: [
    'DEEPFAKE VIDÉO',
    'DÉSINFORMATION ÉLECTION',
    'ARNAQUE FINANCIÈRE',
    'PHISHING AVANCÉ',
    'RANÇONGICIEL',
  ],
  medium: [
    'FAUX CONTENU',
    'MANIPULATION IMAGE',
    'BOT RÉSEAU',
    'SPAM CIBLÉ',
    'HAMEÇONNAGE',
  ],
  low: [
    'CONTENU SUSPECT',
    'LIEN DOUTEUX',
    'PROFIL SUSPECT',
    'PARTAGE VIRAL',
    'COMMENTAIRE SPAM',
  ],
};

const CITIES = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack',
  'Abidjan', 'Bamako', 'Conakry', 'Lomé', 'Cotonou',
  'Ouagadougou', 'Niamey', 'Nouakchott', 'Praia',
];

// Générer une menace aléatoire
export function generateThreat() {
  const levels = ['high', 'medium', 'low'];
  const weights = [0.15, 0.35, 0.5];
  const r = Math.random();
  let level = 'low';
  if (r < weights[0]) level = 'high';
  else if (r < weights[0] + weights[1]) level = 'medium';

  const types = THREAT_TYPES[level];
  
  return {
    id: Date.now() + Math.random(),
    level,
    type: types[Math.floor(Math.random() * types.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    time: new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

// Données des nœuds
export function getNodeData() {
  return [
    { id: 1, name: 'Dakar', country: 'SN', users: 12847, active: true, load: 87 },
    { id: 2, name: 'Abidjan', country: 'CI', users: 9231, active: true, load: 72 },
    { id: 3, name: 'Bamako', country: 'ML', users: 6104, active: true, load: 58 },
    { id: 4, name: 'Conakry', country: 'GN', users: 4892, active: false, load: 34 },
    { id: 5, name: 'Lomé', country: 'TG', users: 3571, active: true, load: 61 },
    { id: 6, name: 'Ouagadougou', country: 'BF', users: 5230, active: true, load: 45 },
  ];
}

// Statistiques initiales
export function getStats() {
  return {
    detected: 1284,
    blocked: 1156,
    accuracy: 94.2,
    nodes: 41872,
  };
}