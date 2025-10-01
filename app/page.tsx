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
import { getRankImage, allRanks } from '@/lib/rankUtils';
import { serverOptions, allServers } from '@/lib/serverUtils';
import { getMockPing, getPingColor, getPingStatus } from '@/lib/pingUtils';
import { agentRoles, agents, getAgentsByRole, getAllRoles, getRoleInfo, getAgentImage, getAllAgents, getAgentRole } from '@/lib/agentUtils';

export default function HomePage() {
  const [recentParties, setRecentParties] = useState<PartyInvite[]>([]);
  const [recentLFG, setRecentLFG] = useState<LFGRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'create-party' | 'create-lfg'>('browse');
  const [activeFilter, setActiveFilter] = useState<'all' | 'parties' | 'lfg'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

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

  const fetchRecentPosts = async () => {
    try {
      const [partiesResponse, lfgResponse] = await Promise.all([
        fetch('/api/parties?limit=10'),
        fetch('/api/lfg?limit=10')
      ]);

      if (partiesResponse.ok) {
      const partiesData = await partiesResponse.json();
      if (partiesData.success) {
        setRecentParties(partiesData.data.parties);
        }
      }

      if (lfgResponse.ok) {
        const lfgData = await lfgResponse.json();
      if (lfgData.success) {
        setRecentLFG(lfgData.data.lfgRequests);
        }
      }
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
    }
  };

  const handleCreateLFG = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
    }
  };

  const filteredData = () => {
    if (activeFilter === 'parties') return recentParties;
    if (activeFilter === 'lfg') return recentLFG;
    return [...recentParties, ...recentLFG].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const gameModes: { key: string; label: string; icon: string }[] = [
    { key: 'Ranked', label: 'Competitive', icon: '/gamemode/Competetrive.webp' },
    { key: 'Premier', label: 'Premier', icon: '/gamemode/Premier.webp' },
  ];

  // Common tag options for LFG (mirrors Create Party vibe)
  const lfgTagOptions: string[] = [
    'Mic Required',
    '18+',
    'Chill',
    'Competitive',
    'Learning',
    'Fun',
    'Serious',
    'Beginner Friendly',
    'No Toxicity',
    'English Speaking',
    'Team Communication'
  ];

  const isLfgFormValid = (
    riotName.trim().length > 0 &&
    riotTag.trim().length > 0 &&
    lfgForm.rank.trim().length > 0 &&
    lfgForm.server.trim().length > 0 &&
    lfgForm.availability.trim().length > 0
  );

  return (
    <div className="min-h-screen bg-valorant-dark relative overflow-hidden">
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
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
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
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
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
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
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
                  className="p-2 text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30 rounded-lg transition-all"
                  disabled={loading}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                </div>
          </div>
        </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  onClick={() => setActiveFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'all'
                          ? 'bg-valorant-red text-white shadow-lg'
                          : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  All Activity
                </button>
                <button
                  onClick={() => setActiveFilter('parties')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'parties'
                          ? 'bg-valorant-red text-white shadow-lg'
                          : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2 inline" />
                  Parties
                </button>
                <button
                  onClick={() => setActiveFilter('lfg')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'lfg'
                          ? 'bg-valorant-red text-white shadow-lg'
                          : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                      <UserPlus className="w-4 h-4 mr-2 inline" />
                      LFG
                </button>
              </div>

                  <div className="text-valorant-light/60 text-sm">
                    {loading ? 'Loading...' : `${filteredData().length} active ${activeFilter === 'all' ? 'posts' : activeFilter}`}
              </div>
            </div>

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
                  ) : filteredData().length > 0 ? (
                    filteredData().map((item) => (
                      'code' in item ? (
                        <PartyCard key={item._id} party={item} onCopy={handleCopy} copied={copiedItem === item._id} />
                      ) : (
                        <LFGCard key={item._id} lfg={item} onCopy={handleCopy} copied={copiedItem === item._id} />
                      )
                    ))
                  ) : (
                    <div className="card text-center py-16">
                      <div className="text-valorant-light/60 mb-6">
                        {activeFilter === 'all' && <Search className="w-16 h-16 mx-auto mb-4" />}
                        {activeFilter === 'parties' && <Users className="w-16 h-16 mx-auto mb-4" />}
                        {activeFilter === 'lfg' && <UserPlus className="w-16 h-16 mx-auto mb-4" />}
                    </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                      No {activeFilter === 'all' ? 'activity' : activeFilter} found
                      </h3>
                      <p className="text-valorant-light/60 mb-6">
                        Be the first to create a {activeFilter === 'all' ? 'post' : activeFilter === 'parties' ? 'party' : 'LFG request'}!
                      </p>
                  </div>
                )}
              </div>
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
                    
                    <form onSubmit={handleCreateParty} className="space-y-8">
                      {/* Basic Settings */}
                      <div className="bg-valorant-dark/30 rounded-xl p-5 md:p-6 border border-valorant-gray/20 space-y-5 md:space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold text-base md:text-lg">Basic Settings</h3>
                          <div className="h-px flex-1 ml-4 bg-valorant-gray/20" />
                        </div>
                        {/* Party Size & Game Mode Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                              Party Size
                            </label>
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                              {['Duo', 'Trio', 'FourStack'].map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => setPartyForm({...partyForm, size: size as any})}
                                  className={`flex items-center justify-center gap-2 h-11 md:h-12 px-3 md:px-4 rounded-lg font-semibold transition-all border ${
                                    partyForm.size === size
                                      ? 'bg-valorant-red/20 text-white border-valorant-red shadow-lg'
                                      : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border-valorant-gray/30'
                                  }`}
                                >
                                  <span>{size === 'FourStack' ? 'Four Stack' : size}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                              Game Mode
                            </label>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                              {gameModes.map((m) => {
                                const isActive = partyForm.mode === m.key;
                                return (
                                  <button
                                    key={m.key}
                                    type="button"
                                    onClick={() => setPartyForm({ ...partyForm, mode: m.key as any })}
                                    className={`group w-full h-12 sm:h-14 flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all ${
                                      isActive
                                        ? 'bg-valorant-red/20 border-valorant-red text-white shadow-lg'
                                        : 'bg-valorant-dark/50 border-valorant-gray/30 text-valorant-light hover:bg-valorant-dark hover:border-valorant-gray/50'
                                    }`}
                                  >
                                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-md overflow-hidden ring-1 ring-valorant-gray/30 group-hover:ring-valorant-red/40">
                                      <Image src={m.icon} alt={m.label} fill sizes="36px" className="object-cover" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                      <span className="text-sm sm:text-base font-semibold leading-none">{m.label}</span>
                                      {m.label !== m.key && (
                                        <span className={`text-[10px] sm:text-[11px] uppercase tracking-widest ${isActive ? 'text-valorant-red' : 'text-valorant-light/50'}`}>{m.key}</span>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Identity Row: Your In-Game Name — Your Rank */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                          {/* Riot ID split: name # tag */}
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                              Your In-Game Name
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Tardic"
                                value={riotName}
                                onChange={(e) => setRiotName(e.target.value)}
                                className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              />
                              <div className="px-3 h-11 md:h-12 flex items-center bg-valorant-dark/60 border border-valorant-gray/30 rounded-lg text-valorant-light/80 font-semibold select-none">#</div>
                              <input
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
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
                              Your Rank
                            </label>
                            <div className="relative">
                              <div className="relative">
                                <select
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

                        {/* Connection Row: Server Location — Discord Link */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                          {/* Server Location */}
                          <div>
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Server Location</label>
                            <div className="relative">
                              <select
                                value={partyForm.server}
                                onChange={(e) => setPartyForm({...partyForm, server: e.target.value})}
                                className="w-full h-11 md:h-12 pl-4 pr-10 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:border-valorant-red focus:ring-2 focus:ring-valorant-red/20 transition-all appearance-none"
                              >
                                {Object.entries(serverOptions).map(([region, servers]) => (
                                  <optgroup key={region} label={region}>
                                    {servers.map(server => {
                                      const ping = getMockPing(server);
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
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Discord Link (optional)</label>
                            <input
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
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Party Code</label>
                            <div className="flex flex-col gap-2">
                              <input
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
                                  Reads your clipboard and auto-fills a 6‑character party code (A–Z, 0–9). Your
                                  clipboard is never uploaded; if permission is blocked, paste with Ctrl/Cmd+V.
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Active For (segmented chips) */}
                          <div className="h-full flex flex-col">
                            <label className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Active For</label>
                            <div className="grid grid-cols-4 gap-2 flex-1 content-start">
                              {[5,10,15,30,45,60,90,120].map((m) => {
                                const active = ((partyForm as any).durationMinutes || 30) === m;
                                return (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={() => setPartyForm({ ...partyForm, ...( { durationMinutes: m } as any) })}
                                    className={`h-10 rounded-lg text-xs font-medium border transition-all ${active ? 'bg-valorant-red/20 text-white border-valorant-red shadow' : 'bg-valorant-dark/50 text-valorant-light border-valorant-gray/30 hover:bg-valorant-dark'}`}
                                    title={`${m} minutes`}
                                  >
                                    {m} min
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
                                  className={`w-full flex items-center justify-center gap-2 h-11 md:h-12 px-3 rounded-lg text-sm font-medium transition-all border ${
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
                                              className={`flex flex-col items-center p-1.5 rounded-md transition-all ${
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
                              {[
                                { id: 'Microphone Required', icon: Mic },
                                { id: 'Headset Required', icon: Headphones },
                                { id: 'Discord Required', icon: MessageSquare },
                                { id: 'English Speaking', icon: Globe },
                                { id: '18+ Only', icon: Shield },
                                { id: 'No Toxicity', icon: Heart },
                                { id: 'Competitive Mindset', icon: Target },
                                { id: 'Team Communication', icon: MessageCircle }
                              ].map(({ id, icon: Icon }) => {
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
                                     className={`w-full h-11 md:h-12 px-3 rounded-lg text-xs font-medium transition-all border flex items-center justify-center gap-2 ${
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
                          <button
                            type="button"
                            onClick={() => setActiveTab('browse')}
                            className="inline-flex items-center justify-center w-full md:w-auto h-12 px-6 bg-valorant-dark/50 border border-valorant-gray/30 text-valorant-light rounded-lg hover:bg-valorant-dark transition-all font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center w-full md:w-auto h-12 px-6 bg-valorant-red text-white rounded-lg hover:bg-valorant-red/80 transition-all font-semibold text-base md:text-lg shadow-lg hover:shadow-xl"
                          >
                            <Users className="w-5 h-5 mr-2" />
                            Create Party
                          </button>
                        </div>
                      </div>
                    </form>
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
                            <label className="block text-sm font-medium text-valorant-light mb-2">Your In-Game Name</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={riotName}
                                onChange={(e) => setRiotName(e.target.value)}
                                placeholder="Name"
                                className="w-full px-4 py-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              />
                              <span className="px-3 py-3 bg-valorant-dark/60 border border-valorant-gray/30 rounded-lg text-valorant-light/70">#</span>
                              <input
                                type="text"
                                value={riotTag}
                                onChange={(e) => setRiotTag(e.target.value)}
                                placeholder="Tag"
                                className="w-32 px-4 py-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-valorant-light mb-2">Your Rank</label>
                            <div className="relative">
                              <select
                                value={lfgForm.rank}
                                onChange={(e) => setLfgForm({ ...lfgForm, rank: e.target.value })}
                                className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              >
                                <option value="" disabled>Select rank…</option>
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
                            <label className="block text-sm font-medium text-valorant-light mb-2">Server Location</label>
                            <select
                              value={lfgForm.server}
                              onChange={(e) => setLfgForm({ ...lfgForm, server: e.target.value })}
                              className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            >
                              <option value="" disabled>Select server…</option>
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
                            <label className="block text-sm font-medium text-valorant-light mb-2">Availability</label>
                            <select
                              value={lfgForm.availability}
                              onChange={(e) => setLfgForm({ ...lfgForm, availability: e.target.value })}
                              className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            >
                              <option value="" disabled>Select availability…</option>
                              <option value="Now">Now</option>
                              <option value="Tonight">Tonight</option>
                              <option value="This Week">This Week</option>
                              <option value="Weekend">Weekend</option>
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
                            {[
                              { name: 'Entry', desc: 'First contact, site entry' },
                              { name: 'Support', desc: 'Healing, utility support' },
                              { name: 'IGL', desc: 'In-game leader, shot caller' },
                              { name: 'Fragger', desc: 'High kill potential' },
                              { name: 'Flex', desc: 'Adaptable to team needs' }
                            ].map((style) => (
                              <button
                                key={style.name}
                                type="button"
                                onClick={() => {
                                  const newPlaystyle = lfgForm.playstyle.includes(style.name)
                                    ? lfgForm.playstyle.filter((p) => p !== style.name)
                                    : [...lfgForm.playstyle, style.name];
                                  setLfgForm({ ...lfgForm, playstyle: newPlaystyle });
                                }}
                                className={`h-11 md:h-12 px-3 md:px-4 rounded-lg border text-xs md:text-sm transition-all ${
                                  lfgForm.playstyle.includes(style.name)
                                    ? 'bg-valorant-red/20 border-valorant-red/50 text-white'
                                    : 'bg-valorant-dark/50 border-valorant-gray/30 text-valorant-light hover:bg-valorant-gray/20'
                                }`}
                                title={style.desc}
                              >
                                {style.name}
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
                                  className={`h-11 md:h-12 px-3 md:px-4 rounded-lg border text-xs md:text-sm transition-all ${
                                    active
                                      ? 'bg-valorant-red/20 border-valorant-red/50 text-white'
                                      : 'bg-valorant-dark/50 border-valorant-gray/30 text-valorant-light hover:bg-valorant-gray/20'
                                  }`}
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
                          className="flex-1 px-6 py-4 bg-valorant-dark border border-valorant-gray/20 text-valorant-light rounded-lg hover:bg-valorant-gray/20 transition-all font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!isLfgFormValid}
                          className={`flex-1 px-6 py-4 rounded-lg transition-all font-medium text-lg shadow-lg hover:shadow-xl ${
                            isLfgFormValid
                              ? 'bg-valorant-red text-white hover:bg-valorant-red/80'
                              : 'bg-valorant-dark text-valorant-light/50 border border-valorant-gray/30 cursor-not-allowed'
                          }`}
                        >
                          <UserPlus className="w-5 h-5 mr-2 inline" />
                          Post LFG Request
                        </button>
                      </div>
                    </form>
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

// Enhanced Party Card Component
function PartyCard({ party, onCopy, copied }: { party: PartyInvite; onCopy: (text: string, type: string) => void; copied: boolean }) {
  const isExpired = new Date() > new Date(party.expiresAt);

  const roleHasImage = (role: string) => ['Duelist','Initiator','Controller','Sentinel'].includes(role);

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'Solo': return '👤';
      case 'Duo': return '👥';
      case 'Trio': return '👨‍👩‍👧';
      case 'FourStack': return '👨‍👩‍👧‍👦';
      default: return '👥';
    }
  };

  const getTimeAgo = (d: Date | string) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  };

  const getTtl = (d: Date | string) => {
    const ms = new Date(d).getTime() - Date.now();
    if (ms <= 0) return 'expired';
    const m = Math.ceil(ms / 60000);
    if (m < 60) return `${m}m left`;
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm ? `${h}h ${rm}m left` : `${h}h left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-gradient-to-br from-[#0F1923] to-[#1A1D29] border-2 rounded-2xl overflow-hidden transition-all ${
        isExpired ? 'opacity-50 border-gray-700' : 'border-valorant-red/40 hover:border-valorant-red hover:shadow-2xl hover:shadow-valorant-red/20'
      }`}
    >
      {/* Red accent stripe */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-valorant-red via-orange-500 to-valorant-red" />
      
      {/* Rank badge - top right corner */}
      <div className="absolute top-4 right-4 w-16 h-16 z-10">
        <Image src={getRankImage(party.rank)} alt={party.rank} fill sizes="64px" className="object-contain drop-shadow-lg" />
      </div>

      <div className="p-5 pt-6 space-y-4">
        {/* Party Code - Hero Element */}
        <div className="text-center py-6 bg-black/30 rounded-xl border border-valorant-red/30">
          <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Party Code</div>
          <div className="font-mono text-3xl tracking-[0.3em] text-white font-bold">{party.code}</div>
          <div className="mt-3 flex justify-center gap-2">
            {!isExpired && (
              <button onClick={() => onCopy(party.code, party._id)} disabled={copied} className="px-4 py-1.5 bg-valorant-red/20 hover:bg-valorant-red/30 border border-valorant-red/50 rounded-lg text-white text-xs font-semibold transition-all">
                {copied ? '✓ Copied' : 'Copy Code'}
              </button>
            )}
            {party.discordLink && (
              <a href={party.discordLink} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/50 rounded-lg text-white text-xs font-semibold transition-all">
                Discord
              </a>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Mode</span>
            <span className="text-white font-semibold">{party.mode}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Size</span>
            <span className="text-white font-semibold">{party.size}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Server</span>
            <span className="text-white font-semibold text-right">{party.server}</span>
          </div>
          {party.inGameName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-valorant-light/60">Player</span>
              <span className="text-white font-semibold">{party.inGameName}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Expires</span>
            <span className="text-orange-400 font-semibold">{getTtl(party.expiresAt)}</span>
          </div>
        </div>

        {/* Description */}
        {party.description && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <p className="text-valorant-light/80 text-xs leading-relaxed italic">{party.description}</p>
          </div>
        )}

        {/* Looking For Roles */}
        {party.lookingForRoles && party.lookingForRoles.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Looking For</div>
            <div className="flex flex-wrap gap-1.5">
              {party.lookingForRoles.map((role, i) => (
                <div key={`${role}-${i}`} className="flex items-center gap-1 bg-valorant-red/10 border border-valorant-red/30 rounded-md px-2 py-1">
                  {roleHasImage(role) && <Image src={`/roles/${role}ClassSymbol.png`} alt={role} width={12} height={12} className="object-contain" />}
                  <span className="text-white text-[11px] font-medium">{role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Roles (What Creator Plays) */}
        {Array.isArray((party as any).preferredRoles) && (party as any).preferredRoles.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Creator Plays</div>
            <div className="flex flex-wrap gap-1.5">
              {(party as any).preferredRoles.map((role: string, i: number) => (
                <div key={`${role}-pref-${i}`} className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 rounded-md px-2 py-1">
                  <span className="text-blue-300 text-[11px] font-medium">{role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agents Preview */}
        {party.preferredAgents && party.preferredAgents.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Preferred Agents</div>
            <div className="grid grid-cols-4 gap-2">
              {party.preferredAgents.slice(0, 4).map((agent, i) => (
                <div key={`${agent}-${i}`} className="flex flex-col items-center gap-1 group/agent">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-valorant-gray/30 bg-black/40 group-hover/agent:border-valorant-red/50 transition-all">
                    <Image src={getAgentImage(agent)} alt={agent} width={40} height={40} className="object-cover" />
                  </div>
                  <span className="text-[9px] text-valorant-light/70 truncate w-full text-center">{agent}</span>
                </div>
              ))}
              {party.preferredAgents.length > 4 && (
                <div className="flex items-center justify-center text-[10px] text-valorant-light/50">
                  +{party.preferredAgents.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requirements/Tags */}
        {party.tags && party.tags.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Requirements</div>
            <div className="flex flex-wrap gap-1">
              {party.tags.slice(0, 4).map((t, i) => (
                <span key={`${t}-${i}`} className="px-2 py-0.5 bg-black/40 border border-valorant-gray/40 rounded text-[10px] text-valorant-light/70">
                  {t.replace(' Required', '')}
                </span>
              ))}
              {party.tags.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] text-valorant-light/50">+{party.tags.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer: Time + Views */}
        <div className="pt-3 border-t border-valorant-gray/20 flex items-center justify-between text-[10px] text-valorant-light/50">
          <span>Posted {getTimeAgo(party.createdAt)}</span>
          {typeof (party as any).views === 'number' && (
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(party as any).views}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced LFG Card Component
function LFGCard({ lfg, onCopy, copied }: { lfg: LFGRequest; onCopy: (text: string, type: string) => void; copied: boolean }) {
  const isExpired = new Date() > new Date(lfg.expiresAt);

  const roleHasImage = (role: string) => ['Duelist','Initiator','Controller','Sentinel'].includes(role);

  const getTimeAgo = (d: Date | string) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  };

  const getTtl = (d: Date | string) => {
    const ms = new Date(d).getTime() - Date.now();
    if (ms <= 0) return 'expired';
    const m = Math.ceil(ms / 60000);
    if (m < 60) return `${m}m left`;
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm ? `${h}h ${rm}m left` : `${h}h left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden transition-all duration-300 rounded-xl border w-full ${
        isExpired ? 'opacity-60 border-gray-700' : 'hover:border-valorant-blue/60 hover:shadow-[0_0_0_1px_rgba(64,185,255,0.35)]'
      }`}
      style={{ background: 'linear-gradient(180deg, rgba(64,185,255,0.10) 0%, rgba(20,24,28,0.8) 100%)' }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-sky-500/60" />
      <div className="p-5 pt-6 space-y-4">
        {/* Username - Hero Element */}
        <div className="text-center py-6 bg-black/30 rounded-xl border border-sky-500/30">
          <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Player Looking for Group</div>
          <div className="font-mono text-2xl tracking-wider text-white font-bold">{lfg.username}</div>
          <div className="mt-3 flex justify-center gap-2">
            {!isExpired && (
              <button onClick={() => onCopy(lfg.username, lfg._id)} disabled={copied} className="px-4 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 rounded-lg text-white text-xs font-semibold transition-all">
                {copied ? '✓ Copied' : 'Copy ID'}
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Availability</span>
            <span className="text-sky-300 font-semibold">{lfg.availability}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Server</span>
            <span className="text-white font-semibold text-right">{lfg.server}</span>
          </div>
          {lfg.inGameName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-valorant-light/60">IGN</span>
              <span className="text-white font-semibold">{lfg.inGameName}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Expires</span>
            <span className="text-orange-400 font-semibold">{getTtl(lfg.expiresAt)}</span>
          </div>
        </div>

        {/* Description */}
        {lfg.description && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <p className="text-valorant-light/80 text-xs leading-relaxed italic">{lfg.description}</p>
          </div>
        )}

        {/* Playstyle */}
        {lfg.playstyle && lfg.playstyle.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Playstyle</div>
            <div className="flex flex-wrap gap-1.5">
              {lfg.playstyle.map((style, i) => (
                <div key={`${style}-${i}`} className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 rounded-md px-2 py-1">
                  <span className="text-sky-300 text-[11px] font-medium">{style}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {lfg.tags && lfg.tags.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Preferences</div>
            <div className="flex flex-wrap gap-1">
              {lfg.tags.slice(0, 4).map((t, i) => (
                <span key={`${t}-${i}`} className="px-2 py-0.5 bg-black/40 border border-valorant-gray/40 rounded text-[10px] text-valorant-light/70">
                  {t}
                </span>
              ))}
              {lfg.tags.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] text-valorant-light/50">+{lfg.tags.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer: Time + Views */}
        <div className="pt-3 border-t border-valorant-gray/20 flex items-center justify-between text-[10px] text-valorant-light/50">
          <span>Posted {getTimeAgo(lfg.createdAt)}</span>
          {typeof (lfg as any).views === 'number' && (
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(lfg as any).views}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
