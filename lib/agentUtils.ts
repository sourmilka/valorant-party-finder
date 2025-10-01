import { ROLES, AGENTS, AGENT_ROLES } from './constants';

// Valorant agent roles and agents
export const agentRoles = {
  'Duelist': {
    name: 'Duelist',
    description: 'Entry fraggers and aggressive playmakers',
    color: 'text-red-400',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-500/50'
  },
  'Initiator': {
    name: 'Initiator',
    description: 'Support and information gatherers',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-500/50'
  },
  'Controller': {
    name: 'Controller',
    description: 'Map control and area denial',
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    borderColor: 'border-purple-500/50'
  },
  'Sentinel': {
    name: 'Sentinel',
    description: 'Defensive specialists and site anchors',
    color: 'text-green-400',
    bgColor: 'bg-green-900/20',
    borderColor: 'border-green-500/50'
  },
  'Flexible': {
    name: 'Flexible',
    description: 'Can play any role as needed',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-900/20',
    borderColor: 'border-yellow-500/50'
  }
};

// Generate agents object from constants
export const agents = ROLES.reduce((acc, role) => {
  if (role === 'Flexible') {
    acc[role] = AGENTS; // Flexible can play any agent
  } else {
    acc[role] = AGENTS.filter(agent => AGENT_ROLES[agent] === role);
  }
  return acc;
}, {} as Record<string, string[]>);

// Agent image mapping
export const getAgentImage = (agentName: string): string => {
  const imageMap: { [key: string]: string } = {
    'Jett': 'Jett_icon.webp',
    'Raze': 'Raze_icon.webp',
    'Phoenix': 'Phoenix_icon.webp',
    'Reyna': 'Reyna_icon.webp',
    'Yoru': 'Yoru_icon.webp',
    'Neon': 'Neon_icon.webp',
    'Iso': 'Iso_icon.webp',
    'Sova': 'Sova_icon.webp',
    'Breach': 'Breach_icon.webp',
    'Skye': 'Skye_icon.webp',
    'KAYO': 'KAYO_icon.webp',
    'Fade': 'Fade_icon.webp',
    'Gekko': 'Gekko_icon.webp',
    'Sage': 'Sage_icon.webp',
    'Cypher': 'Cypher_icon.webp',
    'Killjoy': 'Killjoy_icon.webp',
    'Chamber': 'Chamber_icon.webp',
    'Deadlock': 'Deadlock_icon.webp'
  };
  
  return `/agents/${imageMap[agentName] || 'Jett_icon.webp'}`;
};

// Get all agents as flat array
export const getAllAgents = (): string[] => {
  return Object.values(agents).flat();
};

// Get agent role
export const getAgentRole = (agentName: string): string | null => {
  return AGENT_ROLES[agentName] || null;
};

// Get agents by role
export const getAgentsByRole = (role: string): string[] => {
  return agents[role as keyof typeof agents] || [];
};

// Get all roles
export const getAllRoles = (): string[] => {
  return ROLES;
};

// Get role info
export const getRoleInfo = (role: string) => {
  return agentRoles[role as keyof typeof agentRoles];
};
