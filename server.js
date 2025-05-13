const express = require("express");
const puppeteer = require("puppeteer");
const { renderTableaux } = require("./tableau_devis.js");
const { tableau_total, tableau_facture } = require("./tableau_facture.js");
const { renderTableaux_avenant } = require("./tableau_avenant.js");
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

app.post("/generate-pdf/devis", async (req, res) => {
  const data = req.body || [];
  // créer tableaux
  const table = renderTableaux(data);
  // créer image logo
  const imageslogo = `<img style="object-fit: cover;height: 4cm;max-width:9cm;" src="data:image/${data.logo_type};base64,${data.logo}" />`;
  // 📁 Lire le HTML brut
  const htmlPath = path.join(__dirname, "./front_template_devis/index.html");
  let html = fs.readFileSync(htmlPath, "utf-8");
  // 🆔 Générer un UUID pour le nom du fichier
  const uuid = uuidv4();

  // const filePath = path.join(__dirname, "files", `${uuid}.pdf`);
  // 🎨 Lire et injecter le CSS dans un <style>
  const cssPath = path.join(__dirname, "./front_template_devis/style.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  // 🖼️ Remplacer {{table}} par le tableau HTML
  const htmlPage = html
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
    const pdfbuffer = await page.pdf({
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
            SIREN ${data.siren} – DECENNALE ${data.assurance_nom} N° CONTRAT : ${data.contrat_decennale} –
            EMAIL : ${data.email_entreprise} / TEL : ${data.telephone_entreprise}
          </span>
          <span style="-webkit-print-color-adjust: exact; font-size:16px ;font-weight:bold ;color: #296b77" class="pageNumber"></span>
          </div>
        `,
      margin: { top: "60px", bottom: "4cm" },
    });

    res.set({
      "Content-Type": "application/pdf",
    });
    console.log(` Pdf genéré par : ${data.user_id} pdf_id : ${uuid}`);

    res.end(pdfbuffer);

    await browser.close();
  } catch (err) {
    console.error("Erreur PDF :", err);
    res.status(500).send("Erreur lors de la génération du PDF");
  }
});

app.post("/generate-pdf/facture", async (req, res) => {
  const data = req.body || [];
  // créer tableaux
  const table_facture = tableau_facture(data);
  const table_totals_facture = tableau_total(data);
  // créer image logo
  const imageslogo_facture = `<img id="section_header__logo" style="object-fit: cover;height: 4cm;width:150px; max-width:9cm;" src="data:image/${data.logo_type};base64,${data.logo}" />`;
  // 📁 Lire le HTML brut
  const htmlPath = path.join(__dirname, "./front_template_facture/index.html");
  let html = fs.readFileSync(htmlPath, "utf-8");
  // 🆔 Générer un UUID pour le nom du fichier
  const uuid = uuidv4();

  // const filePath = path.join(__dirname, "files", `${uuid}.pdf`);
  // 🎨 Lire et injecter le CSS dans un <style>
  const cssPath = path.join(__dirname, "./front_template_facture/style.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  // 🖼️ Remplacer {{table}} par le tableau HTML
  const htmlPage = html
    .replace("</head>", `<style>${css}</style></head>`)
    .replace("{{image_logo}}", imageslogo_facture)
    .replace("{{client_nom}}", data.client_name)
    .replace("{{client_adresse_1}}", data.client_adresse_1)
    .replace("{{client_adresse_2}}", data.client_adresse_2)
    .replace("{{reference}}", data.reference)
    .replace("{{date_limite_1}}", data.date_limite)
    .replace("{{date_limite_2}}", data.date_limite)
    .replace("{{communication}}", data.communication)
    .replace("{{entreprise_nom}}", data.entreprise_nom)
    .replace("{{entreprise_adresse_1}}", data.entreprise_adresse_1)
    .replace("{{entreprise_adresse_2}}", data.entreprise_adresse_2)
    .replace("{{entreprise_siren}}", data.entreprise_siren)
    .replace("{{entreprise_siret}}", data.entreprise_siret)
    .replace("{{entreprise_iban}}", data.entreprise_iban)
    .replace("{{entreprise_ape}}", data.entreprise_ape)
    .replace("{{entreprise_bic}}", data.entreprise_bic)
    .replace("{{entreprise_tva}}", data.entreprise_tva)
    .replace("{{entreprise_assurance}}", data.entreprise_assurance)
    .replace("{{date}}", data.date)
    .replace("{{nom_chantier}}", data.nom_chantier)
    .replace("{{adresse_chantier}}", data.adresse_chantier)
    .replace("{{table_facture}}", table_facture)
    .replace("{{table_total}}", table_totals_facture)
    .replace("{{imagelogo}}", imageslogo_facture);

  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.setContent(htmlPage, { waitUntil: "networkidle0" });
    const pdfbuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style=" position:absolute; top:1cm; left:1cm; width:19cm; margin:0cm  0cm 0cm 0cm; display:flex; justify-content:space-between;">
        
       </div>`,

      footerTemplate: `
          <div style=" position:absolute; bottom: 0.5cm; left:0cm; margin:0 0.5cm;display: flex;font-size:13px;flex-direction: column;justify-content: center; width: 20cm;">
          <span style="-webkit-print-color-adjust: exact; color:black;align-self: center; margin: 0;text-align: center;width: 90%;margin: auto;">
          ${data.entreprise_nom} - ${data.entreprise_adresse_1} -
          ${data.entreprise_adresse_2} - Capital de ${data.entreprise_capital_social} €
          SIREN ${data.entreprise_siren} - contrat d’assurance :
          ${data.entreprise_assurance}
        </span>
        <span style="-webkit-print-color-adjust: exact;font-size:13px; align-self: flex-end;" class="pageNumber"></span>
      </div>
        `,
      margin: { top: "0.5cm", bottom: "0.5cm", left: "0.5cm", right: "0.5cm" },
    });

    res.set({
      "Content-Type": "application/pdf",
    });
    console.log(` Pdf genéré par : ${data.user_id} pdf_id : ${uuid}`);

    res.end(pdfbuffer);

    await browser.close();
  } catch (err) {
    console.error("Erreur PDF :", err);
    res.status(500).send("Erreur lors de la génération du PDF");
  }
});

app.post("/generate-pdf/avenant", async (req, res) => {
  const data = req.body || [];
  // créer tableaux
  const table_avenant = renderTableaux_avenant(data);
  // créer image logo
  const imageslogo_avenant = `<img style="object-fit: cover;height: 4cm;max-width:9cm;" src="data:image/${data.logo_type};base64,${data.logo}" />`;
  // 📁 Lire le HTML brut
  const htmlPath_avenant = path.join(
    __dirname,
    "./front_template_avenant/index.html"
  );
  let html_avenant = fs.readFileSync(htmlPath_avenant, "utf-8");
  // 🆔 Générer un UUID pour le nom du fichier
  const uuid_avenant = uuidv4();

  // const filePath = path.join(__dirname, "files", `${uuid}.pdf`);
  // 🎨 Lire et injecter le CSS dans un <style>
  const cssPath_avenant = path.join(
    __dirname,
    "./front_template_avenant/style.css"
  );
  const css_avenant = fs.readFileSync(cssPath_avenant, "utf-8");

  // 🖼️ Remplacer {{table}} par le tableau HTML
  const htmlPage_avenant = html_avenant
    .replace("</head>", `<style>${css_avenant}</style></head>`)
    .replace("{{client_name}}", data.client_name)
    .replace("{{client_adresse_1}}", data.client_adresse_1)
    .replace("{{client_adresse_2}}", data.client_adresse_2)
    .replace("{{date}}", data.date)
    .replace("{{type_projet}}", data.type_projet)
    .replace("{{bien_lieu}}", data.bien_lieu)
    .replace("{{table}}", table_avenant)
    .replace("{{imagelogo}}", imageslogo_avenant);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlPage_avenant, { waitUntil: "networkidle0" });
    const pdfbuffer_avenant = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style=" position:absolute; top:1cm; left:1cm; width:19cm; margin:0cm  0cm 0cm 0cm; display:flex; justify-content:space-between;">
        <span style="-webkit-print-color-adjust: exact; font-size: 22px; color: #eccc8c;font-weight: bold;">AVENANT</span>
        <span style=" font-size: 12px; color: #296b77;font-weight: bold;">Avenant n°${data.numero_devis}</span>
       </div>`,

      footerTemplate: `
          <div style=" position:absolute; bottom:2.2cm;  width:15cm; margin:0; left: 50%;transform: translateX(-50%);
        right: 50%;  display:flex; justify-content:space-between; align-items:center;">
          <span style="-webkit-print-color-adjust: exact; font-size:13px;color:rgb(168, 168, 168); max-width:65%">${data.nom_entreprise}, ${data.adresse_entreprise} – ${data.forme_juridique} – CAPITAL SOCIAL ${data.capital_social} –
            SIREN ${data.siren} – DECENNALE ${data.assurance_nom} N° CONTRAT : ${data.contrat_decennale} –
            EMAIL : ${data.email_entreprise} / TEL : ${data.telephone_entreprise}
          </span>
          <span style="-webkit-print-color-adjust: exact; font-size:16px ;font-weight:bold ;color: #296b77" class="pageNumber"></span>
          </div>
        `,
      margin: { top: "60px", bottom: "4cm" },
    });

    res.set({
      "Content-Type": "application/pdf",
    });
    console.log(` Pdf genéré par : ${data.user_id} pdf_id : ${uuid_avenant}`);

    res.end(pdfbuffer_avenant);

    await browser.close();
  } catch (err) {
    console.error("Erreur PDF :", err);
    res.status(500).send("Erreur lors de la génération du PDF");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
