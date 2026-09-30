export interface ChatItem {
  sender: 'in' | 'out';
  text: string;
  time?: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TrustBadgeItem {
  text: string;
  icon?: string;
}

export interface FloatingCardItem {
  icon: string;
  title: string;
  desc: string;
}
