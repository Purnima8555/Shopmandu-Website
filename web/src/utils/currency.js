// Place at: src/utils/currency.js
// Central place for currency formatting so every page (product list, cart,
// checkout, wishlist) renders the same "Rs. 1,200" style instead of each
// component doing its own toFixed(2)/"$" string.

/**
 * Formats a number as Nepali Rupees, e.g. formatCurrency(1234.5) -> "Rs. 1,234.50"
 * Falls back to "Rs. 0.00" for null/undefined/NaN so a bad price never renders "Rs. NaN".
 */
export const formatCurrency = (amount) => {
  const value = Number(amount);
  const safeValue = Number.isFinite(value) ? value : 0;

  return `Rs. ${safeValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
