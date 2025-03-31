#!/usr/bin/env bash
set -o errexit

# 📦 Installer les dépendances
echo "📦 Installation des dépendances npm..."
npm install

# 📁 Créer le dossier .cache si absent
echo "📁 Création du dossier .cache (si non existant)..."
mkdir -p .cache/puppeteer

# 🧭 Définir la variable d'environnement de cache
export PUPPETEER_CACHE_DIR="$(pwd)/.cache/puppeteer"
echo "📍 PUPPETEER_CACHE_DIR=$PUPPETEER_CACHE_DIR"

# 🧰 Installer Chrome pour Puppeteer
echo "🔽 Installation de Chrome via Puppeteer..."
npx puppeteer browsers install

# ✅ Terminé
echo "✅ browsers installés dans .cache/puppeteer"
