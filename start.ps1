# start.ps1
Write-Host "🚀 Démarrage de Sentinel" -ForegroundColor Green
Write-Host "========================"

# Vérifier si Docker est en cours
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "❌ Docker Desktop n'est pas en cours d'exécution" -ForegroundColor Red
    Write-Host "   Veuillez démarrer Docker Desktop et réessayer"
    exit 1
}

# Arrêter les conteneurs existants
Write-Host "🛑 Arrêt des anciens conteneurs..."
docker-compose down

# Nettoyer les images inutilisées (optionnel)
Write-Host "🧹 Nettoyage..."
docker system prune -f

# Démarrer les nouveaux conteneurs
Write-Host "🏗️  Construction et démarrage des conteneurs..."
docker-compose up -d --build

# Attendre que les services soient prêts
Write-Host "⏳ Attente du démarrage des services..."
Start-Sleep -Seconds 10

# Vérifier l'état
Write-Host "📊 État des conteneurs :"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Tester le backend
$healthCheck = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -ErrorAction SilentlyContinue
if ($healthCheck.StatusCode -eq 200) {
    Write-Host "✅ Backend opérationnel" -ForegroundColor Green
} else {
    Write-Host "❌ Backend non disponible" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌍 Sentinel est maintenant accessible :" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend API: http://localhost:5000"
Write-Host "   Health check: http://localhost:5000/health"
Write-Host ""
Write-Host "📊 Commandes utiles :"
Write-Host "   Voir les logs : docker-compose logs -f"
Write-Host "   Arrêter : docker-compose down"
Write-Host "   Redémarrer : docker-compose restart"