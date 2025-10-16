const renderTableaux_avenant = (Data) => {
  let tableaux = `
 <table class="tableau_prestations">
 <colgroup>
  <col style="width:auto">     <!-- Description -->
  <col style="width:6ch">      <!-- Quantité -->
  <col style="width:5ch">      <!-- Unité -->
  <col style="width:10ch">     <!-- PU HT -->
  <col style="width:6ch">      <!-- TVA -->
  <col style="width:12ch">   
  </colgroup>
    <tr class="tableau_prestations__header">
      <th id="description" class="tableau_prestations__header__libelle">Description</th>
      <th>Qté</th>
      <th>U</th>
      <th>PU HT</th>
      <th>TVA</th>
      <th class="bold tableau_prestations__header__total">Total HT</th>
    </tr>
     <tr class="row-spacer-piece"><td colspan="6"></td></tr>
    <tr class="tableau_prestations__header_separator"><td colspan="6"></td></tr>
     <tr class="row-spacer-piece"><td colspan="6"></td></tr>
    `;

  Data.lots.forEach((lot) => {
    let html = `
     <tr class="row-spacer-piece"><td colspan="6"></td></tr>
     <tr class="section__lot">
      <td colspan="3" class="section__lot__name td_padding">${lot.name}</td>
      <td colspan="3" class="section__lot__total td_padding total">${lot.lots_sum}</td>
    </tr>
     <tr class="row-spacer"><td colspan="6"></td></tr>
    `;

    lot.pieces.forEach((piece) => {
      html += `
    <tr class="section__piece">
      <td colspan="3" class="section__piece__name">${piece.name}</td>
      <td colspan="3" class="section__piece__price">${piece.pieces_sum}</td>
    </tr>
    <tr class="row-spacer-piece"><td colspan="6"></td></tr>
      `;

      piece.prestations.forEach((presta) => {
        html += `
        <tr class="row-spacer"><td colspan="6"></td></tr>
        <tr class="row-spacer"><td colspan="6"></td></tr>
          <tr class="section__prestation">
            <td colspan="1" class="section__prestation__info td_padding">
              <div class="section__prestation__info__name">${presta.name}</div>
              <div class="section__prestation__info__description">${
                presta.description || ""
              }</div>
            </td>
            <td class="section__prestation__quantity td_padding">${
              presta.quantity
            }</td>
            <td class="section__prestation__unit td_padding">${
              presta.unite
            }</td>
            <td class="section__prestation__price_uht td_padding">${
              presta.puht
            }</td>
            <td class="section__prestation__remise td_padding">${
              presta.tva
            }</td>
            <td class="section__prestation__price td_padding">${
              presta.ptht
            }</td>
          </tr>
          <tr class="row-spacer"><td colspan="6"></td></tr>
        `;
      });
    });
    tableaux += html;
  });

  if (Data.lots_option.length > 0) {
    Data.lots_option.forEach((lot) => {
      let html_option = `
       <tr class="row-spacer-piece"><td colspan="6"></td></tr>
     <tr class="section__lot">
      <td colspan="3" class="section__lot__name td_padding">${lot.name} (Option)</td>
      <td colspan="3" class="section__lot__total td_padding total">${lot.lots_sum}</td>
    </tr> 
     <tr class="row-spacer"><td colspan="6"></td></tr>
    `;

      lot.pieces.forEach((piece) => {
        html_option += `
    <tr class="section__piece">
      <td colspan="3" class="section__piece__name">${piece.name} (Option)</td>
      <td colspan="3" class="section__piece__price">${piece.pieces_sum}</td>
    </tr>
     <tr class="row-spacer-piece"><td colspan="6"></td></tr>
      `;

        piece.prestations.forEach((presta) => {
          html_option += `
          <tr class="row-spacer"><td colspan="6"></td></tr>
          <tr class="row-spacer"><td colspan="6"></td></tr>
          <tr class="section__prestation">
            <td colspan="1" class="section__prestation__info td_padding">
              <div class="section__prestation__info__name">${presta.name}</div>
              <div class="section__prestation__info__description">${
                presta.description || ""
              }</div>
            </td>
            <td class="section__prestation__quantity td_padding">${
              presta.quantity
            }</td>
            <td class="section__prestation__unit td_padding">${
              presta.unite
            }</td>
            <td class="section__prestation__price_uht td_padding">${
              presta.puht
            }</td>
            <td class="section__prestation__remise td_padding">${
              presta.tva
            }</td>
            <td class="section__prestation__price td_padding">${
              presta.ptht
            }</td>
          </tr>
          <tr class="row-spacer"><td colspan="6"></td></tr>
        `;
        });
      });
      tableaux += html_option;
    });
    tableaux += `</table>`;
  } else {
    tableaux += `</table>`;
  }
  let recap_card = `
  <div class="totals-summary">
    <div class="totals-card">
      <div class="totals-card__grid">
        <div class="totals-card__cell totals-card__cell--blue">Total HT (hors options)</div>
        <div class="totals-card__cell totals-card__cell--blue totals-card__cell--right totals-card__cell--medium">${
          Data.totaux.hors_option.montant_ht
        } €</div>
        ${Data.totaux.hors_option.tva
          .map(
            (tva) => `
        <div class="totals-card__cell totals-card__cell--muted">TVA ${tva.taux} %</div>
        <div class="totals-card__cell totals-card__cell--muted totals-card__cell--right">${tva.montant} €</div>`
          )
          .join("")}
        <div class="totals-card__cell totals-card__cell--blue">Total TTC (hors options)</div>
        <div class="totals-card__cell totals-card__cell--blue totals-card__cell--right totals-card__cell--medium">${
          Data.totaux.hors_option.montant_ttc
        } €</div>
        ${
          Data.totaux?.option?.montant_ht
            ? `
        <div class="totals-card__cell totals-card__cell--blue-light">Total HT (options)</div>
        <div class="totals-card__cell totals-card__cell--blue-light totals-card__cell--right totals-card__cell--medium">${
          Data.totaux.option.montant_ht
        } €</div>
        ${Data.totaux.option.tva
          .map(
            (tva) => `
        <div class="totals-card__cell totals-card__cell--muted">TVA ${tva.taux} %</div>
        <div class="totals-card__cell totals-card__cell--muted totals-card__cell--right">${tva.montant} €</div>`
          )
          .join("")}
        <div class="totals-card__cell totals-card__cell--blue-light">Total TTC (options)</div>
        <div class="totals-card__cell totals-card__cell--blue-light totals-card__cell--right totals-card__cell--medium">${
          Data.totaux.option.montant_ttc
        } €</div>
        `
            : ""
        }
        ${
          Data.date_demarrage
            ? `
        <div class="totals-card__cell totals-card__cell--top-border">Délai de démarrage</div>
        <div class="totals-card__cell totals-card__cell--top-border totals-card__cell--right">${
          Data.date_demarrage || ""
        }</div>
        `
            : ""
        }
        ${
          Data.date_duree
            ? `
        <div class="totals-card__cell totals-card__cell--top-border">Durée des travaux estimée</div>
        <div class="totals-card__cell totals-card__cell--top-border totals-card__cell--right totals-card__cell--italic-gray">${
          Data.date_duree || ""
        }</div> `
            : ""
        }
        ${
          Data.remarque
            ? `
        <div class="totals-card__cell totals-card__cell--top-border" style="grid-column: 1 / -1;">
          <div>Remarque :</div>
          <div class="totals-card__cell--italic-gray">${
            Data.remarque || ""
          }</div>
        </div>
        `
            : ""
        }
      </div>
    </div>
  </div>`;
  tableaux += recap_card;

  return tableaux;
};

module.exports = { renderTableaux_avenant };
