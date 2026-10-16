// Format amounts in Indian currency (e.g., ₹2,500.00 or -₹500.00)
export function formatCurrency(amount) {
  const numeric = Number(amount || 0);
  const formatted = Math.abs(numeric).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return numeric < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

// Return the current month in YYYY-MM format (e.g., "2026-10")
export function getCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

// Convert YYYY-MM into a readable month name (e.g., "Oct 2026" or "October 2026")
export function formatMonth(monthString, monthFormat = "short") {
  const [year, month] = monthString.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat("en-US", {
    month: monthFormat,
    year: "numeric",
  }).format(date);
}

// Move backward or forward by months
export function changeMonth(monthString, difference) {
  const [year, month] = monthString.split("-").map(Number);
  const date = new Date(year, month - 1 + difference, 1);

  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, "0");

  return `${newYear}-${newMonth}`;
}
