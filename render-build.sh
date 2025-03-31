#!/usr/bin/env bash
set -o errexit

# Install dependencies
npm install

# Log Puppeteer version depuis package.json
node -e "console.log('🔍 Puppeteer version déclarée :', require('./package.json').dependencies.puppeteer)"

# (Optionnel) Log version réelle de Chromium
node -e "require('puppeteer').launch({ headless: true, args: ['--no-sandbox'] }).then(async browser => { const v = await browser.version(); console.log('🔍 Chromium version :', v); await browser.close(); })"

# Nettoyage
npm uninstall puppeteer-core || true
