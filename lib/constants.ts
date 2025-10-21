// Game Constants
export const RANKS = [
  'Iron 1', 'Iron 2', 'Iron 3',
  'Bronze 1', 'Bronze 2', 'Bronze 3',
  'Silver 1', 'Silver 2', 'Silver 3',
  'Gold 1', 'Gold 2', 'Gold 3',
  'Platinum 1', 'Platinum 2', 'Platinum 3',
  'Diamond 1', 'Diamond 2', 'Diamond 3',
  'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
  'Immortal 1', 'Immortal 2', 'Immortal 3',
  'Radiant'
] as const;

export const SERVERS = [
  'North America', 'Europe', 'Asia Pacific', 'Korea', 'Brazil', 'Latin America', 'Turkey', 'Russia'
] as const;

export const GAME_MODES = [
  'Ranked', 'Unrated', 'Spike Rush', 'Deathmatch', 'Escalation', 'Replication'
] as const;

export const PARTY_SIZES = [
  'Solo', 'Duo', 'Trio', 'FourStack'
] as const;

export const ROLES = [
  'Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flexible'
] as const;

export const AGENTS = [
  'Jett', 'Raze', 'Breach', 'Omen', 'Brimstone', 'Phoenix', 'Sage', 'Sova', 'Viper', 'Cypher',
  'Reyna', 'Killjoy', 'Skye', 'Yoru', 'Astra', 'KAY/O', 'Chamber', 'Neon', 'Fade', 'Harbor',
  'Gekko', 'Deadlock', 'Iso', 'Clove', 'Vyse', 'Tejo', 'Waylay'
] as const;

export const PLAYSTYLES = [
  'Competitive', 'Casual', 'Learning', 'Warm-up', 'Grinding', 'Fun', 'Serious', 'Chill'
] as const;

export const AVAILABILITY_OPTIONS = [
  'Now', 'In 30 minutes', 'In 1 hour', 'In 2 hours', 'In 4 hours', 'Later today', 'Tomorrow'
] as const;

export const DURATION_OPTIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
  { value: 480, label: '8 hours' },
  { value: 720, label: '12 hours' },
  { value: 1440, label: '24 hours' }
] as const;

export const REQUIREMENT_TAGS = [
  'Mic Required', 'English Required', 'Discord Required', '18+ Only', 'Experienced Players Only',
  'Beginner Friendly', 'No Toxicity', 'Team Player', 'Good Communication', 'Flexible Roles'
] as const;

export const PREFERENCE_TAGS = [
  'Chill Vibes', 'Competitive', 'Learning', 'Fun', 'Serious', 'Team Player', 'Good Communication',
  'Flexible', 'Experienced', 'Beginner Friendly', 'No Toxicity', 'English Speaking'
] as const;

// Agent Role Mapping
export const AGENT_ROLES: Record<string, string> = {
  'Jett': 'Duelist',
  'Raze': 'Duelist',
  'Phoenix': 'Duelist',
  'Reyna': 'Duelist',
  'Yoru': 'Duelist',
  'Neon': 'Duelist',
  'Iso': 'Duelist',
  'Tejo': 'Duelist',
  'Sova': 'Initiator',
  'Breach': 'Initiator',
  'Skye': 'Initiator',
  'KAY/O': 'Initiator',
  'Fade': 'Initiator',
  'Gekko': 'Initiator',
  'Sage': 'Sentinel',
  'Cypher': 'Sentinel',
  'Killjoy': 'Sentinel',
  'Chamber': 'Sentinel',
  'Deadlock': 'Sentinel',
  'Omen': 'Controller',
  'Viper': 'Controller',
  'Brimstone': 'Controller',
  'Astra': 'Controller',
  'Harbor': 'Controller',
  'Clove': 'Controller',
  'Vyse': 'Controller',
  'Waylay': 'Controller'
};

// Type definitions for better type safety
export type Rank = typeof RANKS[number];
export type Server = typeof SERVERS[number];
export type GameMode = typeof GAME_MODES[number];
export type PartySize = typeof PARTY_SIZES[number];
export type Role = typeof ROLES[number];
export type Agent = typeof AGENTS[number];
export type Playstyle = typeof PLAYSTYLES[number];
export type Availability = typeof AVAILABILITY_OPTIONS[number];
export type RequirementTag = typeof REQUIREMENT_TAGS[number];
export type PreferenceTag = typeof PREFERENCE_TAGS[number];
