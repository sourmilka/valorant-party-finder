export interface User {
  _id: string;
  email: string;
  riotId: string;
  bio?: string;
  verified: boolean;
  blocked: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PartyInvite {
  _id: string;
  userId: string | User;
  size: 'Solo' | 'Duo' | 'Trio' | 'FourStack';
  server: string;
  rank: string;
  mode: 'Ranked' | 'Unrated' | 'Spike Rush' | 'Deathmatch' | 'Escalation' | 'Replication';
  code: string;
  description: string;
  tags: string[];
  inGameName: string;
  preferredRoles: string[];
  preferredAgents: string[];
  lookingForRoles: string[];
  createdAt: Date;
  expiresAt: Date;
  views: number;
  status: 'Active' | 'Expired' | 'Cancelled';
}

export interface LFGRequest {
  _id: string;
  userId: string | User;
  username: string;
  server: string;
  rank: string;
  playstyle: string[];
  availability: string;
  description: string;
  tags: string[];
  inGameName: string;
  createdAt: Date;
  expiresAt: Date;
  views: number;
  status: 'Active' | 'Expired' | 'Cancelled';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FilterOptions {
  size?: string[];
  server?: string[];
  rank?: string[];
  mode?: string[];
  playstyle?: string[];
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'mostViewed';
}

export interface CreatePartyData {
  size: string;
  server: string;
  rank: string;
  mode: string;
  code: string;
  description: string;
  tags: string[];
  preferredRoles: string[];
  preferredAgents: string[];
  lookingForRoles: string[];
}

export interface CreateLFGData {
  username: string;
  server: string;
  rank: string;
  playstyle: string[];
  availability: string;
  description: string;
  tags: string[];
}

export interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  activePosts: number;
  expiredPosts: number;
}
