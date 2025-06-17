const tableau_facture = (Data) => {
  let tableau = `
   <table id="section_table__table">
<thead id="table__header">
            <tr>
              <th id="section_table__table__1" class="table__title">Art</th>
              <th id="section_table__table__2" class="table__title">
                Designation
              </th>
              <th id="section_table__table__3" class="table__title">
                Quantité
              </th>
              <th id="section_table__table__4" class="table__title">PU HT</th>
              <th id="section_table__table__5" class="table__title">
                Montant HT
              </th>
            </tr>
          </thead>
          <tbody>`;

  Data.acomptes.forEach((acompte) => {
    tableau += `
    <tr>
              <td class="table__content"></td>
              <td id="section_table__table__designation" class="table__content">
                ${acompte.text}
              </td>
              <td class="table__content">${acompte.quantite}</td>
              <td class="table__content">${acompte.puht}</td>
              <td class="table__content">${acompte.total}</td>
            </tr>
      
    `;
  });
  tableau += `</tbody>
    </table>`;
  return tableau;
};

const tableau_total = (Data) => {
  let tableau_total_table = `
    <table id="section_conditions_total__total__table">
            <thead>
              <tr>
                <th
                  id="section_conditions_total__total__table__premiere_colonne"></th>
                <th
                  id="section_conditions_total__total__table__deuxieme_colonne"></th>
              </tr>
            </thead>
            <tbody>
              <tr class="premiere_ligne">
                <td class="premiere_colonne">Montant HT</td>
                <td id="section_conditions_total__table__montant_ht">
                 ${Data.totals.total_ht}
                </td>
              </tr>`;

  Data.totals.tva.forEach((tva) => {
    let html_total = `
        <tr class="deuxieme_ligne">
                <td class="premiere_colonne">TVA ${tva.taux}</td>
                <td
                  class="deuxieme_colonne"
                  id="section_conditions_total__table__tva">
                  ${tva.montant}
                </td>
              </tr>`;
    tableau_total_table += html_total;
  });
  tableau_total_table += `
      <tr class="derniere_ligne">
                <td class="premiere_colonne">Total TTC</td>
                <td id="section_conditions_total__table__total_ttc">
                ${Data.totals.total_ttc}
                </td>
              </tr>
            </tbody>
          </table>`;

  if (Data.facture_solde == "true" && Data.recap_acomptes.length > 0) {
    tableau_total_table += `
      <table id="section_conditions_total__table__recap_acomptes">
            <thead>
              <tr>
                <th colspan="2" id="section_conditions_total__table__recap_acomptes__premier_colonne">
                Recapitulatif acomptes
                </th>
            
              </tr>
            </thead>
            <tbody>`;
    Data.recap_acomptes.forEach((acompte_recap) => {
      tableau_total_table += `
        <tr class="deuxieme_ligne">
                <td class="premiere_colonne">${acompte_recap.date_facturation}</td>
                <td
                  class="deuxieme_colonne"
                  id="section_conditions_total__table__recap_acomptes__montant">
                  ${acompte_recap.total_ttc}
                </td>
              </tr>`;
    });
    tableau_total_table += `</tbody></table>`;
  }
  return tableau_total_table;
};

module.exports = { tableau_facture, tableau_total };
