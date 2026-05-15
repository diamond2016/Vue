export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}