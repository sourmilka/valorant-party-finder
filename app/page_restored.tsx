'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Users, 
  Search, 
  Plus, 
  X,
  Copy,
  Clock, 
  MapPin,
  Gamepad2,
  UserPlus,
  Filter,
  RefreshCw,
  Mic,
  Headphones,
  MessageSquare,
  Globe,
  Shield,
  Heart,
  Target,
  MessageCircle,
  Sword,
  Zap,
  Eye,
  Lock,
  ChevronDown
} from 'lucide-react';
import { PartyInvite, LFGRequest, CreatePartyData, CreateLFGData } from '@/types';
import PartyCard from '@/components/PartyCard';
import LFGCard from '@/components/LFGCard';
import CreatePartyForm from '@/components/CreatePartyForm';
import { getServerLatency, getPingColor, getPingStatus } from '@/lib/pingUtils';
import { agentRoles, agents, getAgentsByRole, getAllRoles, getRoleInfo, getAgentImage, getAllAgents, getAgentRole } from '@/lib/agentUtils';
import { GAME_MODES, PARTY_SIZES, PLAYSTYLES, AVAILABILITY_OPTIONS, DURATION_OPTIONS, REQUIREMENT_TAGS, PREFERENCE_TAGS } from '@/lib/constants';

export default function HomePage() {
  const [recentParties, setRecentParties] = useState<PartyInvite[]>([]);
  const [recentLFG, setRecentLFG] = useState<LFGRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'create-party' | 'create-lfg'>('browse');
  const [activeFilter, setActiveFilter] = useState<'all' | 'parties' | 'lfg'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(12); // Show 12 items per page
  
  // Filter states
  const [filters, setFilters] = useState({
    rank: '',
    server: '',
    mode: '',
    timeLeft: '',
    type: 'all' // 'all', 'parties', 'lfg'
  });

  // In-game name state
  const [riotName, setRiotName] = useState('');
  const [riotTag, setRiotTag] = useState('');

  // Form states
  const [partyForm, setPartyForm] = useState<CreatePartyData>({
    size: 'Duo',
    server: 'Chicago, IL (USA)',
    rank: 'Gold 1',
    mode: 'Ranked',
    code: '',
    description: '',
    tags: [],
    preferredRoles: [],
    preferredAgents: [],
    lookingForRoles: []
  });

  const [discordLink, setDiscordLink] = useState('');
  const [isCreatingParty, setIsCreatingParty] = useState(false);
  const [isCreatingLfg, setIsCreatingLfg] = useState(false);

  const [lfgForm, setLfgForm] = useState<CreateLFGData>({
    username: '',
    server: '',
    rank: '',
    playstyle: [],
    availability: '',
    description: '',
    tags: []
  });

  useEffect(() => {
    fetchRecentPosts();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchRecentPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchRecentPosts(1);
  }, [filters]);

  const fetchRecentPosts = async (page: number = currentPage) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      // Add filters to query params
      if (filters.rank) params.append('rank', filters.rank);
      if (filters.server) params.append('server', filters.server);
      if (filters.mode) params.append('mode', filters.mode);

      const [partiesResponse, lfgResponse] = await Promise.all([
        fetch(`/api/parties?${params.toString()}`),
        fetch(`/api/lfg?${params.toString()}`)
      ]);

      let allParties: PartyInvite[] = [];
      let allLFG: LFGRequest[] = [];
      let totalParties = 0;
      let totalLFG = 0;

      if (partiesResponse.ok) {
      const partiesData = await partiesResponse.json();
      if (partiesData.success) {
          allParties = partiesData.data.parties;
          totalParties = partiesData.data.pagination.total;
        }
      }

      if (lfgResponse.ok) {
        const lfgData = await lfgResponse.json();
      if (lfgData.success) {
          allLFG = lfgData.data.lfgRequests;
          totalLFG = lfgData.data.pagination.total;
        }
      }

      // Combine and sort by creation time
      const allPosts = [...allParties, ...allLFG].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Apply client-side filters
      const filteredPosts = allPosts.filter(post => {
        // Type filter
        if (filters.type === 'parties' && !('code' in post)) return false;
        if (filters.type === 'lfg' && 'code' in post) return false;

        // Time left filter
        if (filters.timeLeft) {
          const now = new Date();
          const expiresAt = new Date(post.expiresAt);
          const timeLeft = expiresAt.getTime() - now.getTime();
          const minutesLeft = Math.ceil(timeLeft / (1000 * 60));
          
          switch (filters.timeLeft) {
            case '5min':
              if (minutesLeft > 5) return false;
              break;
            case '15min':
              if (minutesLeft > 15) return false;
              break;
            case '30min':
              if (minutesLeft > 30) return false;
              break;
            case '1hour':
              if (minutesLeft > 60) return false;
              break;
          }
        }

        return true;
      });

      // Split back into parties and LFG
      const filteredParties = filteredPosts.filter(post => 'code' in post) as PartyInvite[];
      const filteredLFG = filteredPosts.filter(post => !('code' in post)) as LFGRequest[];

      setRecentParties(filteredParties);
      setRecentLFG(filteredLFG);
      
      // Update pagination info
      const totalFiltered = filteredPosts.length;
      setTotalItems(totalFiltered);
      setTotalPages(Math.ceil(totalFiltered / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      // Set empty arrays on error so the UI can still render
      setRecentParties([]);
      setRecentLFG([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };


  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingParty(true);
      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...partyForm,
          inGameName: riotName && riotTag ? `${riotName}#${riotTag}` : '',
          durationMinutes: (partyForm as any).durationMinutes || 30,
          discordLink
        })
      });
      
      if (response.ok) {
        setActiveTab('browse');
        fetchRecentPosts();
        // Reset form
        setPartyForm({
          size: 'Duo',
          server: 'Chicago, IL (USA)',
          rank: 'Gold 1',
          mode: 'Ranked',
          code: '',
          description: '',
          tags: [],
          preferredRoles: [],
          preferredAgents: [],
          lookingForRoles: []
        });
        setRiotName('');
        setRiotTag('');
        setDiscordLink('');
      } else {
        const errorData = await response.json();
        console.error('Failed to create party:', response.status, errorData);
        alert(`Failed to create party: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating party:', error);
      alert('Error creating party. Please check your connection and try again.');
    } finally {
      setIsCreatingParty(false);
    }
  };

  const handleCreateLFG = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingLfg(true);
      const response = await fetch('/api/lfg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lfgForm,
          username: riotName && riotTag ? `${riotName}#${riotTag}` : lfgForm.username,
          inGameName: riotName && riotTag ? `${riotName}#${riotTag}` : ''
        })
      });
      
      if (response.ok) {
        setActiveTab('browse');
        fetchRecentPosts();
        // Reset form
        setLfgForm({
          username: '',
          server: '',
          rank: '',
          playstyle: [],
          availability: '',
          description: '',
          tags: []
        });
        setRiotName('');
        setRiotTag('');
      } else {
        const errorData = await response.json();
        console.error('Failed to create LFG:', response.status, errorData);
        alert(`Failed to create LFG request: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating LFG:', error);
      alert('Error creating LFG request. Please check your connection and try again.');
    } finally {
      setIsCreatingLfg(false);
    }
  };

  const filteredData = () => {
    let allData = [...recentParties, ...recentLFG];
    
    // Apply type filter
    if (filters.type === 'parties') allData = recentParties;
    else if (filters.type === 'lfg') allData = recentLFG;
    
    // Apply other filters
    return allData.filter((item) => {
      // Rank filter
      if (filters.rank && item.rank !== filters.rank) return false;
      
      // Server filter
      if (filters.server && item.server !== filters.server) return false;
      
      // Mode filter (only for parties)
      if (filters.mode && 'mode' in item && item.mode !== filters.mode) return false;
      
      // Time left filter
      if (filters.timeLeft) {
        const now = new Date();
        const expiresAt = new Date(item.expiresAt);
        const timeLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60)); // minutes
        
        switch (filters.timeLeft) {
          case 'expired':
            return timeLeft <= 0;
          case '5min':
            return timeLeft > 0 && timeLeft <= 5;
          case '15min':
            return timeLeft > 5 && timeLeft <= 15;
          case '30min':
            return timeLeft > 15 && timeLeft <= 30;
          case '1hour':
            return timeLeft > 30 && timeLeft <= 60;
          case '2hours':
            return timeLeft > 60 && timeLeft <= 120;
          case '4hours':
            return timeLeft > 120 && timeLeft <= 240;
          case '8hours':
            return timeLeft > 240 && timeLeft <= 480;
          case '24hours':
            return timeLeft > 480 && timeLeft <= 1440;
          default:
            return true;
        }
      }
      
      return true;
    }).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const gameModes: { key: string; label: string; icon: string }[] = [
    { key: 'Ranked', label: 'Competitive', icon: '/gamemode/Competetrive.webp' },
    { key: 'Premier', label: 'Premier', icon: '/gamemode/Premier.webp' },
    { key: 'Unrated', label: 'Unrated', icon: '/gamemode/Unrated.webp' },
    { key: 'Spike Rush', label: 'Spike Rush', icon: '/gamemode/SpikeRush.webp' },
    { key: 'Deathmatch', label: 'Deathmatch', icon: '/gamemode/Deathmatch.webp' },
    { key: 'Escalation', label: 'Escalation', icon: '/gamemode/Escalation.webp' },
    { key: 'Replication', label: 'Replication', icon: '/gamemode/Replication.webp' }
  ].filter(mode => GAME_MODES.includes(mode.key as any));

  // Common tag options for LFG (mirrors Create Party vibe)
  const lfgTagOptions: string[] = [...PREFERENCE_TAGS];

  const isLfgFormValid = 
    riotName.trim().length > 0 &&
    riotTag.trim().length > 0 &&
    lfgForm.rank.trim().length > 0 &&
    lfgForm.server.trim().length > 0 &&
    lfgForm.availability.trim().length > 0;

  const handleLfgDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value.slice(0, 300);
    setLfgForm({ ...lfgForm, description: next });
  };

  return (
    <div className="min-h-screen bg-valorant-dark relative overflow-hidden">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-valorant-red focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-valorant-red/50"
      >
        Skip to main content
      </a>
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-valorant-red/5 via-transparent to-valorant-blue/10" />
        <div className="absolute inset-0 bg-[url('/patterns/valorant-bg.svg')] opacity-[0.03] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="border-b border-valorant-gray/20 bg-valorant-dark/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-valorant-gray/30">
                  <Image src="/logo.webp" alt="Logo" fill sizes="40px" className="object-cover" unoptimized />
                </div>
                <h1 className="text-2xl font-bold text-white">Valorant LFG</h1>
        </div>

              {/* Navigation Tabs */}
              <div className="flex bg-valorant-dark/50 rounded-xl p-1 border border-valorant-gray/20">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    activeTab === 'browse'
                      ? 'bg-valorant-red text-white shadow-lg'
                      : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  <Search className="w-4 h-4 mr-2 inline" />
                  Browse
                </button>
                <button
                  onClick={() => setActiveTab('create-party')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    activeTab === 'create-party'
                      ? 'bg-valorant-red text-white shadow-lg'
                      : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  <span className="relative inline-flex items-center">
                    <span className="relative w-4 h-4 mr-2 inline-block">
                      <Image src="/partyicons/CreateParty.webp" alt="Create Party" fill sizes="16px" className="object-contain" unoptimized />
                    </span>
                  Create Party
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('create-lfg')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    activeTab === 'create-lfg'
                      ? 'bg-valorant-red text-white shadow-lg'
                      : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  <UserPlus className="w-4 h-4 mr-2 inline" />
                  Post LFG
                </button>
          </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchRecentPosts}
                  className="p-2 text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50"
                  disabled={loading}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                </div>
          </div>
        </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'browse' && (
          <motion.div
                key="browse"
            initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
          {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex bg-valorant-dark/50 rounded-xl p-1 border border-valorant-gray/20">
                <button
                  onClick={() => setFilters({ ...filters, type: 'all' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    filters.type === 'all'
                          ? 'bg-valorant-red text-white shadow-lg'
                          : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  All Activity
                </button>
                <button
                  onClick={() => setFilters({ ...filters, type: 'parties' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    filters.type === 'parties'
                          ? 'bg-valorant-red text-white shadow-lg'
                          : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2 inline" />
                  Parties
                </button>
                <button
                  onClick={() => setFilters({ ...filters, type: 'lfg' })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    filters.type === 'lfg'
                          ? 'bg-valorant-red text-white shadow-lg'
                          : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                      <UserPlus className="w-4 h-4 mr-2 inline" />
                      LFG
                </button>
              </div>

                  <div className="text-valorant-light/60 text-sm">
                    {loading ? 'Loading...' : `${totalItems} active ${filters.type === 'all' ? 'posts' : filters.type}`}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                  showFilters
                    ? 'bg-valorant-red text-white shadow-lg'
                    : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                }`}
              >
                <Filter className="w-4 h-4 mr-2 inline" />
                {showFilters ? 'Hide Filters' : 'Advanced Filters'}
              </button>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-valorant-dark/30 rounded-xl p-4 border border-valorant-gray/20 space-y-4"
              >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label htmlFor="filter-type" className="block text-xs font-semibold text-white mb-2">Type</label>
                  <select
                    id="filter-type"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white text-sm focus:border-valorant-red focus:ring-1 focus:ring-valorant-red"
                  >
                    <option value="all">All</option>
                    <option value="parties">Parties</option>
                    <option value="lfg">LFG</option>
                  </select>
                </div>
                
                {/* Rank Filter */}
                <div>
                  <label htmlFor="filter-rank" className="block text-xs font-semibold text-white mb-2">Rank</label>
                  <select
                    id="filter-rank"
                    value={filters.rank}
                    onChange={(e) => setFilters({ ...filters, rank: e.target.value })}
                    className="w-full px-3 py-2 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white text-sm focus:border-valorant-red focus:ring-1 focus:ring-valorant-red"
                  >
                    <option value="">Any Rank</option>
                    {allRanks.map((rank) => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>
                
                {/* Server Filter */}
                <div>
                  <label htmlFor="filter-server" className="block text-xs font-semibold text-white mb-2">Server</label>
                  <select
                    id="filter-server"
                    value={filters.server}
                    onChange={(e) => setFilters({ ...filters, server: e.target.value })}
                    className="w-full px-3 py-2 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white text-sm focus:border-valorant-red focus:ring-1 focus:ring-valorant-red"
                  >
                    <option value="">Any Server</option>
                    {allServers.map((server) => (
                      <option key={server} value={server}>{server}</option>
                    ))}
                  </select>
                </div>
                
                {/* Mode Filter */}
                <div>
                  <label htmlFor="filter-mode" className="block text-xs font-semibold text-white mb-2">Mode</label>
                  <select
                    id="filter-mode"
                    value={filters.mode}
                    onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                    className="w-full px-3 py-2 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white text-sm focus:border-valorant-red focus:ring-1 focus:ring-valorant-red"
                  >
                    <option value="">Any Mode</option>
                    {GAME_MODES.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time Left Filter */}
                <div>
                  <label htmlFor="filter-time-left" className="block text-xs font-semibold text-white mb-2">Time Left</label>
                  <select
                    id="filter-time-left"
                    value={filters.timeLeft}
                    onChange={(e) => setFilters({ ...filters, timeLeft: e.target.value })}
                    className="w-full px-3 py-2 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white text-sm focus:border-valorant-red focus:ring-1 focus:ring-valorant-red"
                  >
                    <option value="">Any Time</option>
                    <option value="expired">Expired</option>
                    <option value="5min">Γëñ 5 minutes</option>
                    <option value="15min">Γëñ 15 minutes</option>
                    <option value="30min">Γëñ 30 minutes</option>
                    <option value="1hour">Γëñ 1 hour</option>
                    <option value="2hours">Γëñ 2 hours</option>
                    <option value="4hours">Γëñ 4 hours</option>
                    <option value="8hours">Γëñ 8 hours</option>
                    <option value="24hours">Γëñ 24 hours</option>
                  </select>
                </div>
                
                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ rank: '', server: '', mode: '', timeLeft: '', type: 'all' })}
                    className="w-full px-4 py-2 bg-valorant-gray/20 hover:bg-valorant-gray/30 border border-valorant-gray/30 rounded-lg text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              </motion.div>
            )}

                {/* Activity Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {loading ? (
              <div className="grid gap-4">
                      {[...Array(8)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                          <div className="flex items-center justify-between p-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gray-600 rounded-lg"></div>
                        <div>
                                <div className="h-5 bg-gray-600 rounded w-40 mb-2"></div>
                                <div className="h-4 bg-gray-600 rounded w-32"></div>
                        </div>
                      </div>
                            <div className="h-10 bg-gray-600 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
                  ) : (recentParties.length > 0 || recentLFG.length > 0) ? (
                    [...recentParties, ...recentLFG].sort((a, b) => 
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ).map((item) => (
                      'code' in item ? (
                        <PartyCard key={item._id} party={item} onCopy={handleCopy} copied={copiedItem === item._id} />
                      ) : (
                        <LFGCard key={item._id} lfg={item} onCopy={handleCopy} copied={copiedItem === item._id} />
                      )
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 xl:col-span-4 w-full text-center py-16 px-6 rounded-2xl border border-valorant-gray/20 bg-gradient-to-b from-black/20 to-transparent">
                      <div className="text-valorant-light/60 mb-6">
                        {filters.type === 'all' && <Search className="w-16 h-16 mx-auto mb-4" />}
                        {filters.type === 'parties' && <Users className="w-16 h-16 mx-auto mb-4" />}
                        {filters.type === 'lfg' && <UserPlus className="w-16 h-16 mx-auto mb-4" />}
                    </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                      No {filters.type === 'all' ? 'activity' : filters.type} found
                      </h3>
                      <p className="text-valorant-light/60 mb-6">
                        Be the first to create a {filters.type === 'all' ? 'post' : filters.type === 'parties' ? 'party' : 'LFG request'}!
                      </p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <button
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      setCurrentPage(newPage);
                      fetchRecentPosts(newPage);
                    }}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 bg-valorant-dark/50 border border-valorant-gray/30 text-valorant-light rounded-lg hover:bg-valorant-dark transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === currentPage;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            fetchRecentPosts(pageNum);
                          }}
                          disabled={loading}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                            isActive
                              ? 'bg-valorant-red text-white'
                              : 'bg-valorant-dark/50 border border-valorant-gray/30 text-valorant-light hover:bg-valorant-dark'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(newPage);
                      fetchRecentPosts(newPage);
                    }}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 bg-valorant-dark/50 border border-valorant-gray/30 text-valorant-light rounded-lg hover:bg-valorant-dark transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              {totalItems > 0 && (
                <div className="text-center mt-4 text-valorant-light/60 text-sm">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} posts
                </div>
              )}
              </motion.div>
            )}

            {activeTab === 'create-party' && (
          <motion.div
                key="create-party"
            initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="card">
                  <div className="p-6 md:p-8">
                    
                    {/* Header Section */}
                    <div className="text-center mb-6 md:mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center">
                        <span className="relative w-8 h-8 mr-3 inline-block">
                          <Image src="/partyicons/CreateParty.webp" alt="Create Party" fill sizes="32px" className="object-contain" unoptimized />
                        </span>
                        Create Party
                      </h2>
                      <p className="text-valorant-light/70 text-sm md:text-base max-w-2xl mx-auto">
                        Share your party code and find teammates who match your skill level and playstyle. 
                        Your party will appear in the live feed for other players to join.
                      </p>
                    </div>
                    
                    <CreatePartyForm 
                      onSubmit={handleCreateParty} 
                      isCreating={isCreatingParty}
                    />

                        {/* Identity Row: Your In-Game Name ΓÇö Your Rank */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                          {/* Riot ID split: name # tag */}
                          <div>
                            <label htmlFor="riot-name" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                              Your In-Game Name
                            </label>
                            <div className="flex items-center gap-2">
                            <input
                              id="riot-name"
                              type="text"
                                placeholder="Tardic"
                                value={riotName}
                                onChange={(e) => setRiotName(e.target.value)}
                                className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              />
                              <div className="px-3 h-11 md:h-12 flex items-center bg-valorant-dark/60 border border-valorant-gray/30 rounded-lg text-valorant-light/80 font-semibold select-none" aria-hidden="true">#</div>
                              <input
                                id="riot-tag"
                                type="text"
                                placeholder="6969"
                                value={riotTag}
                                onChange={(e) => setRiotTag(e.target.value)}
                                className="w-28 h-11 md:h-12 px-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                                maxLength={5}
                              />
                            </div>

                          </div>

                          {/* Your Rank */}
                          <div>
                            <label htmlFor="party-rank" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                              Your Rank
                            </label>
                            <div className="relative">
                            <div className="relative">
                              <select
                                id="party-rank"
                                value={partyForm.rank}
                                onChange={(e) => setPartyForm({...partyForm, rank: e.target.value})}
                                  className="w-full h-11 md:h-12 pl-12 pr-10 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:border-valorant-red focus:ring-2 focus:ring-valorant-red/20 transition-all appearance-none"
                              >
                                {allRanks.map(rank => (
                                  <option key={rank} value={rank}>{rank}</option>
                                ))}
                              </select>
                                <ChevronDown className="w-4 h-4 text-valorant-light/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6">
                                  <Image src={getRankImage(partyForm.rank)} alt={partyForm.rank} fill sizes="24px" className="object-contain" />
                  </div>
                            </div>
                            </div>
                          </div>
                        </div>

                        {/* Connection Row: Server Location ΓÇö Discord Link */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                          {/* Server Location */}
                          <div>
                            <label htmlFor="party-server" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Server Location</label>
                            <div className="relative">
                            <select
                                id="party-server"
                              value={partyForm.server}
                              onChange={(e) => setPartyForm({...partyForm, server: e.target.value})}
                                className="w-full h-11 md:h-12 pl-4 pr-10 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:border-valorant-red focus:ring-2 focus:ring-valorant-red/20 transition-all appearance-none"
                            >
                              {Object.entries(serverOptions).map(([region, servers]) => (
                                <optgroup key={region} label={region}>
                                  {servers.map(server => {
                                    const ping = getServerLatency(server);
                                    return (
                                        <option key={server} value={server}>{server} - {ping}ms</option>
                                    );
                                  })}
                                </optgroup>
                              ))}
                            </select>
                              <ChevronDown className="w-4 h-4 text-valorant-light/70 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                    </div>

                          {/* Discord Link */}
                          <div>
                            <label htmlFor="discord-link" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Discord Link (optional)</label>
                            <input
                              id="discord-link"
                              type="url"
                              value={discordLink}
                              onChange={(e) => setDiscordLink(e.target.value)}
                              placeholder="https://discord.gg/4VVf2UJsxa"
                              className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Party Code + Active For */}
                      <div className="bg-valorant-dark/30 rounded-xl p-5 md:p-6 border border-valorant-gray/20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-6">
                      {/* Party Code */}
                          <div className="h-full flex flex-col">
                            <label htmlFor="party-code" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Party Code</label>
                            <div className="flex flex-col gap-2">
                        <input
                          id="party-code"
                          type="text"
                          value={partyForm.code}
                                onChange={(e) => setPartyForm({ ...partyForm, code: e.target.value.toUpperCase() })}
                          placeholder="Enter your 6-character party code"
                          maxLength={6}
                                className="w-full h-11 md:h-12 px-6 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:border-valorant-red focus:ring-2 focus:ring-valorant-red/20 transition-all font-mono text-lg md:text-xl tracking-widest text-center shadow-inner placeholder:uppercase placeholder:tracking-widest placeholder:text-valorant-light/40"
                          required
                        />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      const text = await navigator.clipboard.readText();
                                      const cleaned = (text || '').replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);
                                      if (cleaned) setPartyForm({ ...partyForm, code: cleaned });
                                    } catch (err) {
                                      alert('Unable to read clipboard. Please paste manually (Ctrl/Cmd+V).');
                                    }
                                  }}
                                  className="h-10 md:h-11 px-4 bg-valorant-dark/50 border border-valorant-red/50 text-white rounded-lg hover:bg-valorant-dark transition-all font-semibold shadow w-full md:w-auto"
                                  title="Paste from clipboard"
                                >
                                  Paste
                                </button>
                                <span className="text-[11px] md:text-xs text-valorant-light/60">
                                  Reads your clipboard and auto-fills a 6ΓÇæcharacter party code (AΓÇôZ, 0ΓÇô9). Your
                                  clipboard is never uploaded; if permission is blocked, paste with Ctrl/Cmd+V.
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Active For (segmented chips) */}
                          <div className="h-full flex flex-col">
                            <label id="active-for-label" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Active For</label>
                            <div className="grid grid-cols-4 gap-2 flex-1 content-start" role="group" aria-labelledby="active-for-label">
                              {DURATION_OPTIONS.map((option) => {
                                const active = ((partyForm as any).durationMinutes || 30) === option.value;
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setPartyForm({ ...partyForm, ...( { durationMinutes: option.value } as any) })}
                                    className={`h-10 rounded-lg text-xs font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${active ? 'bg-valorant-red/20 text-white border-valorant-red shadow' : 'bg-valorant-dark/50 text-valorant-light border-valorant-gray/30 hover:bg-valorant-dark'}`}
                                    title={option.label}
                                  >
                                    {option.value} min
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                    </div>

                      {/* Team Preferences */}
                      <div className="bg-valorant-dark/30 rounded-xl p-5 md:p-6 border border-valorant-gray/20 space-y-5 md:space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold text-base md:text-lg">Team Preferences</h3>
                          <div className="h-px flex-1 ml-4 bg-valorant-gray/20" />
                        </div>
                        {/* Looking For */}
                        <div>
                          <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                            Looking For (What roles you need teammates to play)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                            {[
                              { role: 'Duelist', icon: '/roles/DuelistClassSymbol.png' },
                              { role: 'Initiator', icon: '/roles/InitiatorClassSymbol.png' },
                              { role: 'Controller', icon: '/roles/ControllerClassSymbol.png' },
                              { role: 'Sentinel', icon: '/roles/SentinelClassSymbol.png' }
                            ].map(({ role, icon }) => {
                              const isSelected = partyForm.lookingForRoles.includes(role);
                              return (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() => {
                                    const newRoles = isSelected
                                      ? partyForm.lookingForRoles.filter(r => r !== role)
                                      : [...partyForm.lookingForRoles, role];
                                    setPartyForm({...partyForm, lookingForRoles: newRoles});
                                  }}
                                  className={`w-full flex items-center justify-center gap-2 h-11 md:h-12 px-3 rounded-lg text-sm font-medium transition-all border focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                                    isSelected
                                       ? 'bg-valorant-red/20 text-white border-valorant-red shadow'
                                       : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border-valorant-gray/30'
                                  }`}
                                >
                                    <Image
                                      src={icon}
                                      alt={`${role} icon`}
                                    width={18}
                                    height={18}
                                    className="object-contain shrink-0"
                                  />
                                  <span className="leading-none">{role}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Agent Selection - Only show if roles are selected */}
                          {partyForm.lookingForRoles.length > 0 && (
                            <div className="mt-4">
                              <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                                Your Preferred Agents
                              </label>
                              <div className="space-y-3">
                                {partyForm.lookingForRoles.map(role => {
                                  const roleAgents = getAgentsByRole(role);
                                  const selectedAgents = partyForm.preferredAgents.filter(agent => 
                                    roleAgents.includes(agent)
                                  );
                                  
                                  return (
                                    <div key={role} className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 relative">
                                          <Image
                                            src={`/roles/${role}ClassSymbol.png`}
                                            alt={`${role} icon`}
                                            fill
                                            sizes="16px"
                                            className="object-contain"
                                          />
                                        </div>
                                        <span className="text-xs md:text-sm font-medium text-valorant-light">
                                          {role}s
                                        </span>
                                        <span className="text-[10px] md:text-xs text-valorant-light/60">
                                          ({selectedAgents.length}/{roleAgents.length})
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-6 md:grid-cols-8 gap-1">
                                        {roleAgents.map(agent => {
                                          const isSelected = partyForm.preferredAgents.includes(agent);
                                          return (
                                            <button
                                              key={`${role}-${agent}`}
                                              type="button"
                                              onClick={() => {
                                                const newAgents = isSelected
                                                  ? partyForm.preferredAgents.filter(a => a !== agent)
                                                  : [...partyForm.preferredAgents, agent];
                                                setPartyForm({...partyForm, preferredAgents: newAgents});
                                              }}
                                              className={`flex flex-col items-center p-1.5 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                                                isSelected
                                                  ? 'bg-valorant-red/20 border border-valorant-red text-white'
                                                  : 'bg-valorant-dark/30 border border-valorant-gray/20 text-valorant-light hover:bg-valorant-dark/50'
                                              }`}
                                              title={agent}
                                            >
                                                <Image
                                                  src={getAgentImage(agent)}
                                                  alt={agent}
                                                width={24}
                                                height={24}
                                                className="object-contain mb-1 rounded"
                                              />
                                              <span className="text-[10px] md:text-xs font-medium truncate w-full text-center">
                                                {agent.length > 6 ? agent.substring(0, 5) + '..' : agent}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-3 p-2 bg-valorant-dark/20 rounded-lg border border-valorant-gray/10">
                                <p className="text-[11px] md:text-xs text-valorant-light/70 flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  Select agents from roles you're looking for
                                </p>
                    </div>
              </div>
            )}
                          
                          {/* Player Requirements */}
                          <div className="mt-4">
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                              Player Requirements
                            </label>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                              {REQUIREMENT_TAGS.map((tag) => {
                                const iconMap: { [key: string]: any } = {
                                  'Mic Required': Mic,
                                  'Discord Required': MessageSquare,
                                  'English Required': Globe,
                                  '18+ Only': Shield,
                                  'No Toxicity': Heart,
                                  'Experienced Players Only': Target,
                                  'Beginner Friendly': Heart,
                                  'Team Player': MessageCircle,
                                  'Good Communication': MessageCircle,
                                  'Flexible Roles': Users
                                };
                                const Icon = iconMap[tag] || Users;
                                const id = tag;
                                const isSelected = partyForm.tags.includes(id);
                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() => {
                                      const newTags = isSelected
                                        ? partyForm.tags.filter(t => t !== id)
                                        : [...partyForm.tags, id];
                                      setPartyForm({...partyForm, tags: newTags});
                                    }}
                                     className={`w-full h-11 md:h-12 px-3 rounded-lg text-xs font-medium transition-all border flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                                      isSelected
                                         ? 'bg-valorant-red/20 text-white border-valorant-red shadow'
                                         : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border-valorant-gray/30'
                                    }`}
                                  >
                                     <Icon className="w-4 h-4 shrink-0" />
                                     <span className="leading-none text-center">{id.replace(' Required', '')}</span>
                                  </button>
                                );
                              })}
              </div>
                          </div>
                        </div>

                        
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col md:flex-row md:items-center gap-4 pt-6 justify-between">
                        <div className="flex-1">
                          <h4 className="text-white text-lg md:text-2xl font-bold leading-tight">
                            Find teammates fast. Create a party and share your code.
                          </h4>
                          <p className="text-valorant-light/70 text-sm md:text-base mt-1">
                            Competitive-ready design with clean roles, ranks, and Discord support.
                          </p>
        </div>
                        <div className="flex gap-3 md:gap-4 md:justify-end">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          </motion.div>
            )}

            {activeTab === 'create-lfg' && (
          <motion.div
                key="create-lfg"
            initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="card">
                  <div className="p-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
                        <UserPlus className="w-8 h-8 mr-3 text-valorant-red" />
                        Post LFG Request
            </h2>
                      <p className="text-valorant-light/80 text-lg max-w-2xl mx-auto">
                        Looking for a group? Post your LFG request and let parties find you. 
                        Share your playstyle and availability to connect with the right teammates.
                      </p>
                </div>
                    
                    <form onSubmit={handleCreateLFG} className="space-y-8">
                      {/* Player Information */}
                      <div className="bg-valorant-dark/30 rounded-xl p-6 border border-valorant-gray/20">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <UserPlus className="w-5 h-5 mr-2 text-valorant-red" />
                          Player Information
                </h3>
                        {/* Row 1: Riot ID split + Rank */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="lfg-riot-name" className="block text-sm font-medium text-valorant-light mb-2">Your In-Game Name</label>
                            <div className="flex items-center gap-2">
                            <input
                              id="lfg-riot-name"
                              type="text"
                                value={riotName}
                                onChange={(e) => setRiotName(e.target.value)}
                                placeholder="Name"
                                className="w-full px-4 py-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              />
                              <span className="px-3 py-3 bg-valorant-dark/60 border border-valorant-gray/30 rounded-lg text-valorant-light/70" aria-hidden="true">#</span>
                            <input
                              id="lfg-riot-tag"
                              type="text"
                                value={riotTag}
                                onChange={(e) => setRiotTag(e.target.value)}
                                placeholder="Tag"
                                className="w-32 px-4 py-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              />
                          </div>
                          </div>
                          <div>
                            <label htmlFor="lfg-rank" className="block text-sm font-medium text-valorant-light mb-2">Your Rank</label>
                            <div className="relative">
                              <select
                                id="lfg-rank"
                                value={lfgForm.rank}
                                onChange={(e) => setLfgForm({ ...lfgForm, rank: e.target.value })}
                                className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              >
                                <option value="" disabled>Select rankΓÇª</option>
                                {allRanks.map((rank) => (
                                  <option key={rank} value={rank}>{rank}</option>
                                ))}
                              </select>
                              {lfgForm.rank && (
                              <div className="absolute right-3 top-3 w-6 h-6">
                                  <Image src={getRankImage(lfgForm.rank)} alt={lfgForm.rank} fill sizes="24px" className="object-contain" />
          </div>
                              )}
                          </div>
          </div>
        </div>

                        {/* Row 2: Server + Availability */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="lfg-server" className="block text-sm font-medium text-valorant-light mb-2">Server Location</label>
                            <select
                              id="lfg-server"
                              value={lfgForm.server}
                              onChange={(e) => setLfgForm({ ...lfgForm, server: e.target.value })}
                              className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            >
                              <option value="" disabled>Select serverΓÇª</option>
                              {Object.entries(serverOptions).map(([region, servers]) => (
                                <optgroup key={region} label={region}>
                                  {servers.map((server) => (
                                    <option key={server} value={server}>{server}</option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="lfg-availability" className="block text-sm font-medium text-valorant-light mb-2">Availability</label>
                            <select
                              id="lfg-availability"
                              value={lfgForm.availability}
                              onChange={(e) => setLfgForm({ ...lfgForm, availability: e.target.value })}
                              className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            >
                              <option value="" disabled>Select availabilityΓÇª</option>
                              {AVAILABILITY_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                          </div>

                      {/* Preferences (Playstyle) */}
                      <div className="bg-valorant-dark/30 rounded-xl p-5 md:p-6 border border-valorant-gray/20 space-y-5 md:space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold text-base md:text-lg">Preferences</h3>
                          <div className="h-px flex-1 ml-4 bg-valorant-gray/20" />
                        </div>
                          <div>
                          <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Playstyle</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                              {PLAYSTYLES.map((style) => (
                                <button
                                  key={style}
                                  type="button"
                                  onClick={() => {
                                    const newPlaystyle = lfgForm.playstyle.includes(style)
                                    ? lfgForm.playstyle.filter((p) => p !== style)
                                      : [...lfgForm.playstyle, style];
                                  setLfgForm({ ...lfgForm, playstyle: newPlaystyle });
                                  }}
                                className={`h-11 md:h-12 px-3 md:px-4 rounded-lg border text-xs md:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                                    lfgForm.playstyle.includes(style)
                                    ? 'bg-valorant-red/20 border-valorant-red/50 text-white'
                                    : 'bg-valorant-dark/50 border-valorant-gray/30 text-valorant-light hover:bg-valorant-gray/20'
                                }`}
                                >
                                  {style}
                                </button>
            ))}
        </div>
                        </div>
                      </div>

                      {/* Player Preferences (Match Create Party Player Requirements style) */}
                      <div className="bg-valorant-dark/30 rounded-xl p-5 md:p-6 border border-valorant-gray/20 space-y-5 md:space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold text-base md:text-lg">Player Preferences</h3>
                          <div className="h-px flex-1 ml-4 bg-valorant-gray/20" />
                        </div>
                        <div>
                          <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Preferences</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                            {lfgTagOptions.map((t) => {
                              const active = lfgForm.tags.includes(t);
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => {
                                    const tags = active
                                      ? lfgForm.tags.filter((x) => x !== t)
                                      : [...lfgForm.tags, t];
                                    setLfgForm({ ...lfgForm, tags });
                                  }}
                                  className={`h-11 md:h-12 px-3 md:px-4 rounded-lg border text-xs md:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                                    active
                                      ? 'bg-valorant-red/20 border-valorant-red/50 text-white'
                                      : 'bg-valorant-dark/50 border-valorant-gray/30 text-valorant-light hover:bg-valorant-gray/20'
                                  }`}
                                  aria-pressed={active}
                                  aria-label={`Preference: ${t}${active ? ' selected' : ''}`}
                                >
                                  {t}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveTab('browse')}
                          className="flex-1 px-6 py-4 bg-valorant-dark border border-valorant-gray/20 text-valorant-light rounded-lg hover:bg-valorant-gray/20 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-valorant-red/50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!isLfgFormValid || isCreatingLfg}
                          className={`flex-1 px-6 py-4 rounded-lg transition-all font-medium text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                            (!isLfgFormValid || isCreatingLfg)
                              ? 'bg-valorant-dark text-valorant-light/50 border border-valorant-gray/30 cursor-not-allowed'
                              : 'bg-valorant-red text-white hover:bg-valorant-red/80'
                          }`}
                        >
                          <UserPlus className="w-5 h-5 mr-2 inline" />
                          {isCreatingLfg ? 'PostingΓÇª' : 'Post LFG Request'}
                        </button>
                      </div>
                  </div>
                </div>
          </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

