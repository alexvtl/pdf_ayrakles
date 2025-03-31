#!/usr/bin/env bash
set -o errexit

# Install dependencies
npm install

# Download Chrome
npx puppeteer browsers install chrome

# Récupère le chemin exact de Chrome et le sauvegarde dans un fichier .env
CHROME_PATH=$(npx puppeteer executable-path chrome)
echo "CHROME_PATH=$CHROME_PATH" > .chrome-path.env
echo "✅ Chrome installé ici : $CHROME_PATH"