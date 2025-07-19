export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercentage(num: number): string {
  return `${(num * 100).toFixed(1)}%`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function getPartyColor(party: string): string {
  const partyColors: Record<string, string> = {
    'democratic': '#1976d2',
    'republican': '#d32f2f',
    'independent': '#388e3c',
    'green': '#4caf50',
    'libertarian': '#ff9800',
  };
  
  return partyColors[party.toLowerCase()] || '#757575';
}
