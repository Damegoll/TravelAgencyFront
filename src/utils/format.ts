
export function formatCLP(amount: number): string {
  return '$' + amount.toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
