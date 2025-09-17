function formatCurrencyEUR(value) {
  if (typeof value !== "number") return value;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function escapeHtml(text) {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
          <td>${escapeHtml(item.reference)}</td>
          <td>${escapeHtml(item.fournisseur)}</td>
          <td>${escapeHtml(item.description)}</td>
          <td class="text-center">${quantity}</td>
          <td class="text-center">${escapeHtml(item.unit)}</td>
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

function computeTotals(data) {
  const items = Array.isArray(data.items) ? data.items : [];
  const subtotal = items.reduce((sum, it) => {
    const q = Number(it.quantity) || 0;
    const u = Number(it.unitPrice) || 0;
    return sum + q * u;
  }, 0);
  const vatRate = typeof data.vatRate === "number" ? data.vatRate : 0.2;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;
  return { subtotal, vatRate, vatAmount, total };
}

module.exports = {
  renderTableauBonCommande,
  computeTotals,
  formatCurrencyEUR,
};
