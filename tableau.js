const renderTableaux = (Data) => {
  let tableaux = `
 <table class="tableau_prestations">
 <colgroup>
    <col style="width: 9cm">
    <col style="width: 2cm">
    <col style="width: 1cm">
    <col style="width: 2.5cm">
    <col style="width: 0.5cm">
    <col style="width: 3cm">
  </colgroup>
    <tr class="tableau_prestations__header">
      <th class="tableau_prestations__header__libelle">Libellé</th>
      <th>Quantité</th>
      <th>Unité</th>
      <th>PU HT</th>
      <th>TVA</th>
      <th class="bold tableau_prestations__header__total">Total HT</th>
    </tr>`;

  Data.lots.forEach((lot) => {
    let html = `
     <tr class="section__lot">
      <td colspan="5" class="section__lot__name td_padding">${lot.name}</td>
      <td class="section__lot__total td_padding total">${lot.lots_sum}</td>
    </tr>
      
    `;

    lot.pieces.forEach((piece) => {
      html += `
    <tr class="section__piece">
      <td colspan="5" class="section__piece__name">${piece.name}</td>
      <td class="section__piece__price">${piece.pieces_sum}</td>
    </tr>
      `;

      piece.prestations.forEach((presta) => {
        html += `
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
        `;
      });
    });
    tableaux += html;
  });
  tableaux += `</table>`;

  let tableaux_totaux = `
 
  <table class="table_totaux__hors_option">
   <colgroup>
    <col style="width: 8cm">
    <col style="width: 3cm">
  </colgroup>
   <thead>
    <tr>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
  <tr class="table_totaux__hors_option__total_ht">
      <td colspan="1" class="table_totaux__hors_option__total_ht__text td_padding green first_column">Total HT (hors options)</td>
      <td class="table_totaux__hors_option__total_ht__montant td_padding second_column">${Data.totaux.hors_option.montant_ht} €</td>
  </tr> 
  `;
  Data.totaux.hors_option.tva.forEach((tva) => {
    tableaux_totaux += `
    <tr class="table_totaux__hors_option__tva">
      <td colspan="1" class="table_totaux__hors_option__tva__text td_padding green first_column">TVA ${tva.taux} %</td>
      <td class="table_totaux__hors_option__tva__montant td_padding second_column">${tva.montant} €</td>
    </tr>
    `;
  });
  tableaux_totaux += `
  <tr class="table_totaux__hors_option__total_ttc">
    <td colspan="1" class="table_totaux__hors_option__total_ttc__text green td_padding first_column">Total ttc (hors options)</td>
    <td class="table_totaux__hors_option__total_ttc__montant td_padding second_column yellow">${Data.totaux.hors_option.montant_ttc} €</td>
  </tr>
  </tbody>
  </table>
  `;
  if (Data.totaux.option.montant_ht) {
    tableaux_totaux += `
  <table class="table_totaux__option">
  <colgroup>
    <col style="width: 8cm">
    <col style="width: 3cm">
  </colgroup>
  <thead>
    <tr>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr class="table_totaux__option__total_ht">
      <td colspan="1" class="table_totaux__option__total_ht__text green td_padding first_column">Total HT (options)</td>
      <td class="table_totaux__option__total_ht__montant td_padding second_column">${Data.totaux.option.montant_ht} €</td>
    </tr>
    `;
    Data.totaux.option.tva.forEach((tva) => {
      tableaux_totaux += `
      <tr class="table_totaux__option__tva">
        <td colspan="1" class="table_totaux__option__tva__text green td_padding first_column">TVA ${tva.taux} %</td>
        <td class="table_totaux__option__tva__montant second_column">${tva.montant} €</td>
      </tr>
      `;
    });
    tableaux_totaux += `
    <tr class="table_totaux__option__total_ttc">
      <td colspan="1" class="table_totaux__option__total_ttc__text green td_padding first_column">Total ttc (options)</td>
      <td class="table_totaux__option__total_ttc__montant second_column yellow">${Data.totaux.option.montant_ttc} €</td>
    </tr>
    </tbody>
    </table>`;
  } else {
    null;
  }
  tableaux_totaux += `
  <table class="table_date">
  <colgroup>
    <col style="width: 8cm">
    <col style="width: 3cm">
  </colgroup>
  <thead>
    <tr>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr class="table_date__date_demarrage">
      <td colspan="1" class="table_date__date_demarrage__text green td_padding first_column">Date de démarrage envisagée</td>
      <td class="table_date__date_demarrage__date td_padding second_column">${Data.date_demarrage}</td>
    </tr>
    <tr class="table_date__date_duree">
      <td colspan="1" class="table_date__date_duree__text green td_padding first_column">Durée des travaux estimée</td>
      <td class="table_date__date_duree__montant td_padding second_column">${Data.date_duree}</td>
    </tr>
  </tbody>
  </table>
  `;
  tableaux_totaux += `
  <section class="section__acompte">
  <div class="section__acompte__title">
  Conditions de paiement
  </div>
  <table class="table_acompte">
  <colgroup>
    <col style="width: 15cm">
    <col style="width: 3cm">
    <col style="width: 3cm">
      
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;
  Data.acompte.forEach((acompte) => {
    tableaux_totaux += `
        <tr class="table_acompte__acompte_tr">
          <td colspan="1" class="table_acompte__acompte_tr__text ">${acompte.nom}</td>
          <td class="table_acompte__acompte_tr__tva ">${acompte.taux} %</td>  
          <td class="table_acompte__acompte_tr__montant second_column_acompte">${acompte.montant} ttc</td>
        </tr>
      `;
  });
  tableaux_totaux += `
  </tbody>
  </table>
   
  </section>
  `;

  tableaux += `<div class="table_totaux">${tableaux_totaux}</div>`;

  return tableaux;
};

module.exports = { renderTableaux };
