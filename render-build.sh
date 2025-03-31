#!/usr/bin/env bash
set -o errexit

# Install dependencies
npm install

# Download Chrome
npx puppeteer browsers install chrome

# Récupère le chemin exact de Chrome et le sauvegarde dans un fichier .env
CHROME_PATH=$(node -e "require('puppeteer').executablePath().then(p => console.log(p))")
echo "CHROME_PATH=$CHROME_PATH"
echo "✅ Chrome installé ici : $CHROME_PATH"