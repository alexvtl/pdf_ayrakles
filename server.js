const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route POST pour générer le PDF
app.post('/generate-pdf', async (req, res) => {
  try {
    const data = req.body;
    
    // Lancer le navigateur
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Créer le contenu HTML avec les données reçues
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <h1>${data.title || 'Document PDF'}</h1>
          <div>
            ${Object.entries(data).map(([key, value]) => 
              `<p><strong>${key}:</strong> ${value}</p>`
            ).join('')}
          </div>
        </body>
      </html>
    `;

    // Définir le contenu HTML de la page
    await page.setContent(htmlContent);

    // Générer le PDF
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    // Fermer le navigateur
    await browser.close();

    // Envoyer le PDF en réponse
    res.contentType('application/pdf');
    res.send(pdf);

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
}); 