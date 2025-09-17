function renderTableauBonCommande(data) {
  const items = Array.isArray(data.items) ? data.items : [];

  const header = `
    <table aria-label="Tableau des matériaux">
      <thead>
        <tr>
          <th class="text-left">RÉFÉRENCE</th>
          <th class="text-left">FOURNISSEUR</th>
          <th class="text-left">DESCRIPTION</th>
          <th class="text-center">QUANTITÉ</th>
          <th class="text-center">UNITÉ</th>
        </tr>
      </thead>
      <tbody>
  `;

  const rows = items
    .map((item) => {
      const quantity = Number(item.quantity) || 0;
      return `
        <tr>
          <td>${item.reference}</td>
          <td>${item.fournisseur}</td>
          <td>${item.description}</td>
          <td class="text-center">${quantity}</td>
          <td class="text-center">${item.unit}</td>
        </tr>
      `;
    })
    .join("");

  const footer = `
      </tbody>
    </table>
  `;

  return header + rows + footer;
}

module.exports = {
  renderTableauBonCommande,
};
