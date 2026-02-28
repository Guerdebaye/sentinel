# 🛡️ SENTINEL — L'Immunité Numérique Collective par IA Fédérée

**Le système immunitaire d'internet pour l'Afrique**

## 🧠 Le Concept Core

SENTINEL est un réseau d'IA décentralisé et communautaire où chaque utilisateur devient un nœud de défense contre :
- 🤖 Les **deepfakes** et la désinformation
- 🚨 Les **cybermenaces** en temps réel
- 🔓 L'**exploitation de données** personnelles

**Spécificité révolutionnaire :** Quand un utilisateur à Dakar détecte un deepfake, le modèle IA s'améliore instantanément pour tous les utilisateurs en Afrique de l'Ouest — grâce au **Federated Learning** (apprentissage fédéré).

**Le contrat central :** L'intelligence est collective. La vie privée est totale. Personne ne voit les données de personne.

## ⚙️ Les 3 Couches Technologiques

### 🔷 Couche 1 — Détection Communautaire
Une **application mobile** où les citoyens "signalent" des contenus suspects.
- L'IA analyse **localement sur le téléphone** (on-device AI)
- Aucun contenu n'est envoyé vers un serveur centralisé
- Chaque citoyen devient contributeur à la détection

### 🔶 Couche 2 — Apprentissage Fédéré
Les modèles IA collaborent sans jamais partager les données brutes.
- Chaque appareil entraîne localement ses modèles
- Seuls les **paramètres appris** sont partagés (pas les données)
- Le modèle global devient plus intelligent à chaque signal
- La sécurité et la confidentialité sont guaranties par architecture

### 🔵 Couche 3 — Tableau de Bord Souverain
Un dashboard national pour la gouvernance numérique.
- **Visualisation en temps réel** des menaces numériques sur le territoire
- Un **radar de cybersécurité nationale** pour la prise de décision
- Insights souverains sans dépendance envers des tiers étrangers

## 📋 Fonctionnalités Principales

- **Détection de menaces en temps réel** via des modèles d'IA avancés
- **Intelligence sur les menaces** avec flux de menaces actualisés
- **Apprentissage fédéré** pour l'amélioration collaborative des modèles sans partage de données
- **Tableau de bord national** pour la surveillance au niveau du pays
- **Centre de confidentialité** pour la gestion des données et de la vie privée
- **Détection de communautés** pour identifier les clusters de menaces

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

### Installation

1. **Clonez ou entrez dans le répertoire du projet**
   ```bash
   cd sentinel-app
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Lancez l'application en mode développement**
   ```bash
   npm start
   ```

4. **Accédez à l'application**
   Ouvrez votre navigateur et allez à http://localhost:3000

## 📁 Structure du projet

```
sentinel-app/
├── public/                  # Fichiers statiques
│   └── index.html          # Fichier HTML principal
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── FLVisualization.js
│   │   ├── Header.js
│   │   ├── ProtectedRoute.js
│   │   ├── Sidebar.js
│   │   ├── StatsCards.js
│   │   └── ThreatFeed.js
│   ├── contexts/           # Contextes React
│   │   └── AuthContext.js
│   ├── pages/              # Pages de l'application
│   │   ├── About.js
│   │   ├── CommunityDetection.js
│   │   ├── Dashboard.js
│   │   ├── FederatedLearning.js
│   │   ├── Login.js
│   │   ├── MobileApp.js
│   │   ├── NationalDashboard.js
│   │   ├── PrivacyCenter.js
│   │   └── ThreatMap.js
│   ├── services/           # Services API et données
│   │   ├── api.js
│   │   └── mockData.js
│   ├── styles/             # Styles CSS globaux
│   │   └── global.css
│   ├── App.js              # Composant principal
│   └── index.js            # Point d'entrée
└── package.json            # Dépendances du projet
```

## 🔧 Scripts disponibles

### `npm start`
Lance l'application en mode développement sur http://localhost:3000

### `npm build`
Crée une version optimisée pour la production dans le dossier `build`

### `npm test`
Lance les tests unitaires en mode interactif

### `npm eject`
⚠️ Cette opération est irréversible. Éjecte tous les fichiers de configuration.

## 📦 Dépendances principales

- **React** (^18.2.0) - Bibliothèque UI
- **React Router DOM** (^6.0.0) - Navigation et routage
- **Axios** (^1.4.0) - Client HTTP
- **Chart.js** (^4.0.0) - Visualisation de données
- **React ChartJS 2** (^5.0.0) - Intégration Chart.js avec React
- **React Scripts** (^5.0.1) - Scripts de build et développement

## 🔐 Authentification

L'application inclut un système d'authentification avec :
- Contexte d'authentification (`AuthContext.js`)
- Page de connexion sécurisée
- Routes protégées pour les utilisateurs autorisés

## 📊 Fonctionnalités principales

### Tableau de bord
Visualisation en temps réel des menaces et statistiques de sécurité

### Carte des menaces
Localisation géographique des événements de sécurité détectés

### Apprentissage fédéré
Collaboration sur l'amélioration des modèles d'IA sans partager les données sensibles

### Détection de communautés
Identification des groupes de menaces correlées

### Centre de confidentialité
Gestion et contrôle des données personnelles et sensibles

## 🛠️ Développement

L'application utilise :
- **ESLint** pour la qualité du code
- **React Hot Reload** pour le développement rapide
- **Webpack** pour le bundling

## 📝 Notes

L'application affiche des avertissements ESLint concernant certaines variables non utilisées. Ces avertissements n'affectent pas le fonctionnement de l'application.

## 📄 Licence

Propriétaire - Tous droits réservés

## 👥 Support

Pour plus d'informations ou des problèmes, consultez la documentation ou contactez l'équipe de développement.
