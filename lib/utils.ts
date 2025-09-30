import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}

export function validatePartyCode(code: string): boolean {
  const pattern = /^[\w-]{3}-[\w-]{3}-[\w-]{3}$/;
  return pattern.test(code);
}

export function validateRiotId(riotId: string): boolean {
  const pattern = /^[a-zA-Z0-9]+#[0-9]+$/;
  return pattern.test(riotId);
}

export function getRankColor(rank: string): string {
  const rankColors: { [key: string]: string } = {
    'Iron': 'text-gray-400',
    'Bronze': 'text-amber-600',
    'Silver': 'text-gray-300',
    'Gold': 'text-yellow-500',
    'Platinum': 'text-green-400',
    'Diamond': 'text-blue-400',
    'Immortal': 'text-purple-400',
    'Radiant': 'text-yellow-300',
  };
  return rankColors[rank] || 'text-gray-400';
}

export function getRankIcon(rank: string): string {
  const rankIcons: { [key: string]: string } = {
    'Iron': '⚔️',
    'Bronze': '🥉',
    'Silver': '🥈',
    'Gold': '🥇',
    'Platinum': '💎',
    'Diamond': '💠',
    'Immortal': '👑',
    'Radiant': '⭐',
  };
  return rankIcons[rank] || '⚔️';
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand('copy') ? resolve() : reject();
      textArea.remove();
    });
  }
}

// Prevent double-click on buttons
export const preventDoubleClick = (callback: () => void, delay: number = 1000) => {
  let isProcessing = false;
  
  return () => {
    if (isProcessing) return;
    
    isProcessing = true;
    callback();
    
    setTimeout(() => {
      isProcessing = false;
    }, delay);
  };
};

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
