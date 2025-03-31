const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');




const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
  const prestations = req.body.prestations || [];

  console.log("📥 Body reçu :", req.body);
  console.log("🚀 Lancement de Puppeteer...");

  try {
    const chromePath = await puppeteer.executablePath(); // 👈 récupère le bon chemin dynamiquement
    console.log("✅ Chrome path utilisé :", chromePath);
    try {
        const exists = fs.existsSync(chromePath);
        console.log("✅ Chrome présent :", exists);
      } catch (e) {
        console.error("❌ Erreur lors de la vérification de Chrome :", e);
      }

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          thead { background-color: #f0f0f0; }
          tr { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <h1>Liste des prestations</h1>
        <table>
          <thead>
            <tr>
              <th>Prestation</th>
              <th>Description</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            ${prestations.map(p => `
              <tr>
                <td>${p.nom}</td>
                <td>${p.description}</td>
                <td>${p.prix} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

    await page.setContent(html);
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf' });
    res.send(pdf);
  } catch (err) {
    console.error("❌ Erreur PDF :", err);
    res.status(500).send("Erreur PDF");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
