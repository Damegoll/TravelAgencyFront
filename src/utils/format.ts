/**
 * Format a number as Chilean Pesos (CLP).
 * CLP has no decimal places and uses dot as thousands separator.
 * Example: 450000 → "$450.000"
 */
export function formatCLP(amount: number): string {
  return '$' + amount.toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
