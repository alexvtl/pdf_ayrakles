const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route POST pour générer le PDF
app.post('/generate-pdf', async (req, res) => {
    console.log("📥 Body reçu :", req.body)
    const prestations = req.body.prestations || [];
  
    try {
        console.log("🚀 Lancement de Puppeteer...");
      const browser = await puppeteer.launch({
        headless: "new", // nécessaire parfois sur Render
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
  
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 40px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
              tr { page-break-inside: avoid; }
              thead { background: #f2f2f2; }
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
      console.log("📄 HTML généré :", html.slice(0, 200)); 
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();
  
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="prestations.pdf"',
      });
  
      res.send(pdfBuffer);
    } catch (err) {
      console.error('Erreur PDF :', err);
      res.status(500).send('Erreur lors de la génération du PDF');
    }
  });

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
}); 