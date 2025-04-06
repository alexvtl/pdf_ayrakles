const express = require("express");
const puppeteer = require("puppeteer");
const { renderTableaux } = require("./tableau.js");
const { getImageBase64 } = require("./imagesBase64.js");
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

app.use(express.json());

app.get("/pdf/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  const filePath = path.join(__dirname, "files", `${uuid}.pdf`);

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${uuid}.pdf`);
    res.sendFile(filePath);
  } else {
    res.status(404).send("PDF introuvable");
  }
});

app.post("/generate-pdf", async (req, res) => {
  const data = req.body || [];
  // créer tableaux
  const table = renderTableaux(data);
  // créer image logo
  const imageslogo = `<img style="object-fit: cover;height: 4cm;width=100%;" src="data:image/png;base64,${data.logo}" />`;
  // 📁 Lire le HTML brut
  const htmlPath = path.join(__dirname, "./front_template_devis/index.html");
  let html = fs.readFileSync(htmlPath, "utf-8");
  // 🆔 Générer un UUID pour le nom du fichier
  const uuid = uuidv4();

  const filePath = path.join(__dirname, "files", `${uuid}.pdf`);
  // 🎨 Lire et injecter le CSS dans un <style>
  const cssPath = path.join(__dirname, "./front_template_devis/style.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  // 🖼️ Remplacer {{table}} par le tableau HTML
  htmlPage = html
    .replace("</head>", `<style>${css}</style></head>`)
    .replace("{{client_name}}", data.client_name)
    .replace("{{client_adresse_1}}", data.client_adresse_1)
    .replace("{{client_adresse_2}}", data.client_adresse_2)
    .replace("{{date}}", data.date)
    .replace("{{type_projet}}", data.type_projet)
    .replace("{{bien_lieu}}", data.bien_lieu)
    .replace("{{table}}", table)
    .replace("{{imagelogo}}", imageslogo);

  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setContent(htmlPage, { waitUntil: "networkidle0" });
    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style=" position:absolute; top:1cm; left:1cm; width:19cm; margin:0cm  0cm 0cm 0cm; display:flex; justify-content:space-between;">
        <span style="-webkit-print-color-adjust: exact; font-size: 22px; color: #eccc8c;font-weight: bold;">DEVIS</span>
        <span style=" font-size: 12px; color: #296b77;font-weight: bold;">Devis n°${data.numero_devis}</span>
       </div>`,

      footerTemplate: `
          <div style=" position:absolute; bottom:2.2cm;  width:15cm; margin:0; left: 50%;transform: translateX(-50%);
        right: 50%;  display:flex; justify-content:space-between; align-items:center;">
          <span style="-webkit-print-color-adjust: exact; font-size:13px;color:rgb(168, 168, 168); max-width:65%">${data.nom_entreprise}, ${data.adresse_entreprise} – ${data.forme_juridique} – CAPITAL SOCIAL ${data.capital_social} –
            SIREN ${data.siren}} – DECENNALE ${data.assurance_nom} N° CONTRAT : ${data.contrat_decennale} –
            EMAIL : ${data.email_entreprise} / TEL : ${data.telephone_entreprise}
          </span>
          <span style="-webkit-print-color-adjust: exact; font-size:16px ;font-weight:bold ;color: #296b77" class="pageNumber"></span>
          </div>
        `,
      margin: { top: "60px", bottom: "4cm" },
    });

    res.set({ "Content-Type": "application/json" });
    const json = { "message": "PDF généré", "pdf_id": uuid };
    console.log(` Pdf genéré par : ${data.user_id} pdf_id : ${uuid}`);

    res.json(json);

    await browser.close();
  } catch (err) {
    console.error("Erreur PDF :", err);
    res.status(500).send("Erreur lors de la génération du PDF");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
