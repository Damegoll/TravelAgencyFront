export function formatCLP(amount) {
  return '$' + amount.toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
