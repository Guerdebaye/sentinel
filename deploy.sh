#!/bin/bash

echo "🚀 Déploiement de Sentinel - L'Immunité Numérique Collective"
echo "============================================================"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
mkdir -p backend/uploads
mkdir -p backend/models
mkdir -p ssl

# Variables d'environnement
if [ ! -f .env ]; then
    echo "🔐 Création du fichier .env..."
    cat > .env << EOF
MAPBOX_TOKEN=pk.eyJ1Ijoic2VudGluZWwiLCJhIjoiY2xudDFoZzhnMDFrMzJrcXM5d2xwZ2V2YyJ9.xyz
EOF
fi

# Build et démarrage
echo "🏗️  Construction des images Docker..."
docker-compose build

echo "🚀 Démarrage des services..."
docker-compose up -d

# Vérification
echo "✅ Vérification des services..."
sleep 10
if curl -s http://localhost:5000/health | grep -q "OK"; then
    echo "✅ Backend opérationnel"
else
    echo "❌ Problème avec le backend"
fi

if curl -s http://localhost:3000 | grep -q "Sentinel"; then
    echo "✅ Frontend opérationnel"
else
    echo "❌ Problème avec le frontend"
fi

echo ""
echo "🌍 Sentinel est maintenant accessible :"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Documentation API: http://localhost:5000/api-docs"
echo ""
echo "📊 Identifiants de démonstration :"
echo "   Email: demo@sentinel.africa"
echo "   Mot de passe: sentinel2024"