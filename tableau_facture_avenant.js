const table_facture_avenant = (Data) => {
  let tableau_facture_avenant = `
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

  Data.prestations.forEach((prestation) => {
    tableau_facture_avenant += `
    <tr>
              <td class="table__content"></td>
              <td id="section_table__table__designation" class="table__content">
                ${prestation.text}
              </td>
              <td class="table__content">${prestation.quantite}</td>
              <td class="table__content">${prestation.puht}</td>
              <td class="table__content">${prestation.total}</td>
            </tr>
      
    `;
  });
  tableau_facture_avenant += `</tbody>
    </table>`;
  return tableau_facture_avenant;
};

const tableau_total_avenant = (Data) => {
  let tableau_total_table_avenant = `
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
    let html_total_avenant = `
        <tr class="deuxieme_ligne">
                <td class="premiere_colonne">TVA ${tva.taux}</td>
                <td
                  class="deuxieme_colonne"
                  id="section_conditions_total__table__tva">
                  ${tva.montant}
                </td>
              </tr>`;
    tableau_total_table_avenant += html_total_avenant;
  });
  tableau_total_table_avenant += `
      <tr class="derniere_ligne">
                <td class="premiere_colonne">Total TTC</td>
                <td id="section_conditions_total__table__total_ttc">
                ${Data.totals.total_ttc}
                </td>
              </tr>
            </tbody>
          </table>`;

  return tableau_total_table_avenant;
};

module.exports = { table_facture_avenant, tableau_total_avenant };
