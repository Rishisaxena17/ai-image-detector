export function confidenceLabel(value: number): 'High' | 'Moderate' | 'Low' {
  if (value >= 0.75) return 'High'
  if (value >= 0.5) return 'Moderate'
  return 'Low'
}
