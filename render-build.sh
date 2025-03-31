#!/usr/bin/env bash
set -o errexit

# Install dependencies
npm install

# Affiche version Puppeteer installée dans les logs Render
echo "🔍 Puppeteer version installée :"
node -e "console.log(require('puppeteer').version)"

# Supprime puppeteer-core si installé par erreur
npm uninstall puppeteer-core || true

