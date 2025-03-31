#!/usr/bin/env bash
set -o errexit

# Install dependencies
npm install

# Download Chrome
npx puppeteer browsers install chrome

# Récupère le chemin exact de Chrome et le sauvegarde dans un fichier .env
echo "CHROME_PATH=$(npx puppeteer executable-path chrome)" > .chrome-path.env
cat .chrome-path.env