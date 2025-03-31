
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
    const prestations = req.body.prestations || [];
    console.log(prestations);
    
   
     try {
       const browser = await puppeteer.launch();
   
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
   
       await page.setContent(html);
       const pdf = await page.pdf({ format: 'A4', printBackground: true , path: './files/prestations.pdf'});
   res.set({'Content-Type':'application/pdf'});
        //   res.write(pdf);
        //   res.end();
        res.end(pdf);

      await browser.close();
     } catch (err) {
       console.error('Erreur PDF :', err);
       res.status(500).send('Erreur lors de la génération du PDF');
     }
   });

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

// const fs = require('fs');
// const path = require('path');
// const express = require('express');


// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// // app.set("Port", PORT);
// app.get('/generate-pdf', async (req, res) => {

//     const filePath = path.join(__dirname, 'files', 'prestations.pdf');
//     console.log(filePath);
//     const file= fs.readFileSync(filePath);
//     res.set({
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'inline; filename=prestations.pdf'
//       });
//       res.send(file);
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
// });