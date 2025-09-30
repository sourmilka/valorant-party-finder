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
  Lock
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
  const [gameName, setGameName] = useState('');

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

  const [lfgForm, setLfgForm] = useState<CreateLFGData>({
    username: '',
    server: 'Chicago, IL (USA)',
    rank: 'Gold 1',
    playstyle: [],
    availability: 'Now',
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
          inGameName: gameName
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
        setGameName('');
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
          inGameName: gameName
        })
      });
      
      if (response.ok) {
        setActiveTab('browse');
        fetchRecentPosts();
        // Reset form
        setLfgForm({
          username: '',
          server: 'Chicago, IL (USA)',
          rank: 'Gold 1',
          playstyle: [],
          availability: 'Now',
          description: '',
          tags: []
        });
        setGameName('');
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
                <div className="w-10 h-10 bg-valorant-red rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
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
                  <Users className="w-4 h-4 mr-2 inline" />
                  Create Party
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
                <div className="space-y-4">
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
                className="max-w-4xl mx-auto"
              >
                <div className="card">
                  <div className="p-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
                        <Users className="w-8 h-8 mr-3 text-valorant-red" />
                        Create Party
                      </h2>
                      <p className="text-valorant-light/80 text-lg max-w-2xl mx-auto">
                        Share your party code and find teammates who match your skill level and playstyle. 
                        Your party will appear in the live feed for other players to join.
                      </p>
                    </div>
                    
                    <form onSubmit={handleCreateParty} className="space-y-8">
                      {/* Basic Settings */}
                      <div className="space-y-6">
                        {/* Party Size & Game Mode Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-white mb-3">
                              Party Size
                            </label>
                            <div className="flex gap-3">
                              {['Duo', 'Trio', 'FourStack'].map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => setPartyForm({...partyForm, size: size as any})}
                                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                                    partyForm.size === size
                                      ? 'bg-valorant-red text-white shadow-lg'
                                      : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border border-valorant-gray/30'
                                  }`}
                                >
                                  {size === 'FourStack' ? 'Four Stack' : size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white mb-3">
                              Game Mode
                            </label>
                            <div className="flex gap-2">
                              {['Ranked', 'Unrated'].map((mode) => (
                                <button
                                  key={mode}
                                  type="button"
                                  onClick={() => setPartyForm({...partyForm, mode: mode as any})}
                                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                                    partyForm.mode === mode
                                      ? 'bg-valorant-red text-white shadow-lg'
                                      : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border border-valorant-gray/30'
                                  }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Server & Rank Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-white mb-3">
                              Server Location
                            </label>
                            <select
                              value={partyForm.server}
                              onChange={(e) => setPartyForm({...partyForm, server: e.target.value})}
                              className="w-full py-3 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:border-valorant-red focus:ring-2 focus:ring-valorant-red/20 transition-all"
                            >
                              {Object.entries(serverOptions).map(([region, servers]) => (
                                <optgroup key={region} label={region}>
                                  {servers.map(server => {
                                    const ping = getMockPing(server);
                                    const pingStatus = getPingStatus(ping);
                                    return (
                                      <option key={server} value={server}>
                                        {server} - {ping}ms
                                      </option>
                                    );
                                  })}
                                </optgroup>
                              ))}
                            </select>
                    </div>

                          {/* In-Game Name Input */}
                          <div>
                            <label className="block text-sm font-semibold text-white mb-3">
                              Your In-Game Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter: YourName#Tag (e.g., Tardic#6969)"
                              value={gameName}
                              onChange={(e) => setGameName(e.target.value)}
                              className="w-full px-4 py-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            />
                            <p className="mt-2 text-sm text-valorant-light/60">
                              💡 Enter your Valorant in-game name (e.g., Tardic#6969)
                            </p>
                    </div>

                          <div>
                            <label className="block text-sm font-semibold text-white mb-3">
                              Your Rank
                            </label>
                            <div className="relative">
                              <select
                                value={partyForm.rank}
                                onChange={(e) => setPartyForm({...partyForm, rank: e.target.value})}
                                className="w-full py-3 pl-12 pr-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:border-valorant-red focus:ring-2 focus:ring-valorant-red/20 transition-all appearance-none"
                              >
                                {allRanks.map(rank => (
                                  <option key={rank} value={rank}>{rank}</option>
                                ))}
                              </select>
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6">
                                <Image
                                  src={getRankImage(partyForm.rank)}
                                  alt={partyForm.rank}
                                  fill
                                  sizes="24px"
                                  className="object-contain"
                                />
                  </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Party Code */}
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                          Party Code
                        </label>
                        <input
                          type="text"
                          value={partyForm.code}
                          onChange={(e) => setPartyForm({...partyForm, code: e.target.value.toUpperCase()})}
                          placeholder="Enter your 6-character party code"
                          maxLength={6}
                          className="w-full py-3 px-6 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/40 focus:border-valorant-red focus:ring-2 focus:ring-valorant-red/20 transition-all font-mono text-xl tracking-widest text-center"
                          required
                        />
                        <p className="text-xs text-valorant-light/60 mt-2 text-center">
                          💡 Find in Valorant: Main Menu → Play → Party → Copy Code
                        </p>
                    </div>

                      {/* Team Preferences */}
                      <div className="space-y-6">
                        {/* Looking For */}
                        <div>
                          <label className="block text-sm font-semibold text-white mb-3">
                            Looking For (What roles you need teammates to play)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                              { role: 'Duelist', icon: '/roles/DuelistClassSymbol.png' },
                              { role: 'Initiator', icon: '/roles/InitiatorClassSymbol.png' },
                              { role: 'Controller', icon: '/roles/ControllerClassSymbol.png' },
                              { role: 'Sentinel', icon: '/roles/SentinelClassSymbol.png' },
                              { role: 'Flexible', icon: Users }
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
                                  className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                    isSelected
                                      ? 'bg-valorant-red text-white shadow-lg'
                                      : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border border-valorant-gray/30'
                                  }`}
                                >
                                  {typeof icon === 'string' ? (
                                    <Image
                                      src={icon}
                                      alt={`${role} icon`}
                                      width={16}
                                      height={16}
                                      className="object-contain"
                                    />
                                  ) : (
                                    <Users className="w-4 h-4" />
                                  )}
                                  <span>{role}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Agent Selection - Only show if roles are selected */}
                          {partyForm.lookingForRoles.length > 0 && (
                            <div className="mt-4">
                              <label className="block text-sm font-semibold text-white mb-3">
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
                                        <span className="text-sm font-medium text-valorant-light">
                                          {role}s
                                        </span>
                                        <span className="text-xs text-valorant-light/60">
                                          ({selectedAgents.length}/{roleAgents.length})
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-6 md:grid-cols-8 gap-1">
                                        {roleAgents.map(agent => {
                                          const isSelected = partyForm.preferredAgents.includes(agent);
                                          return (
                                            <button
                                              key={agent}
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
                                              <div className="w-6 h-6 relative mb-1">
                                                <Image
                                                  src={getAgentImage(agent)}
                                                  alt={agent}
                                                  fill
                                                  sizes="24px"
                                                  className="object-contain"
                                                />
                                              </div>
                                              <span className="text-xs font-medium truncate w-full text-center">
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
                                <p className="text-xs text-valorant-light/70 flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  Select agents from roles you're looking for
                                </p>
                    </div>
              </div>
            )}
                          
                          {/* Player Requirements */}
                          <div className="mt-4">
                            <label className="block text-sm font-semibold text-white mb-3">
                              Player Requirements
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                                    className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium transition-all ${
                                      isSelected
                                        ? 'bg-valorant-red text-white shadow-md'
                                        : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border border-valorant-gray/30'
                                    }`}
                                  >
                                    <Icon className="w-3 h-3" />
                                    <span className="truncate">{id.replace(' Required', '')}</span>
                                  </button>
                                );
                              })}
              </div>
                          </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                          <label className="block text-sm font-semibold text-white mb-3">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                            value={partyForm.description}
                            onChange={(e) => setPartyForm({...partyForm, description: e.target.value})}
                            placeholder="Any additional information about your playstyle or what you're looking for..."
                            rows={3}
                            className="w-full py-3 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/40 focus:border-valorant-red focus:ring-2 focus:ring-valorant-red/20 transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-6">
                        <button
                          type="button"
                          onClick={() => setActiveTab('browse')}
                          className="flex-1 py-3 px-6 bg-valorant-dark/50 border border-valorant-gray/30 text-valorant-light rounded-lg hover:bg-valorant-dark transition-all font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 px-6 bg-valorant-red text-white rounded-lg hover:bg-valorant-red/80 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
                        >
                          <Users className="w-5 h-5 mr-2 inline" />
                          Create Party
                        </button>
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-valorant-light mb-2">
                              Riot ID / Username
                            </label>
                            <input
                              type="text"
                              value={lfgForm.username}
                              onChange={(e) => setLfgForm({...lfgForm, username: e.target.value})}
                              placeholder="Your Riot ID (e.g., PlayerName#1234)"
                              className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              required
                            />
                            <p className="text-xs text-valorant-light/60 mt-1">
                              Your full Riot ID that others will use to add you
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-valorant-light mb-2">
                              Server
                            </label>
                            <select
                              value={lfgForm.server}
                              onChange={(e) => setLfgForm({...lfgForm, server: e.target.value})}
                              className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            >
                              {Object.entries(serverOptions).map(([region, servers]) => (
                                <optgroup key={region} label={region}>
                                  {servers.map(server => (
                                    <option key={server} value={server}>{server}</option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                            <p className="text-xs text-valorant-light/60 mt-1">
                              Select your specific server for optimal ping
                            </p>
                </div>

                          {/* In-Game Name Input for LFG */}
                          <div>
                            <label className="block text-sm font-medium text-valorant-light mb-2">
                              Your In-Game Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter: YourName#Tag (e.g., Tardic#6969)"
                              value={gameName}
                              onChange={(e) => setGameName(e.target.value)}
                              className="w-full px-4 py-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            />
                            <p className="mt-2 text-sm text-valorant-light/60">
                              💡 Enter your Valorant in-game name (e.g., Tardic#6969)
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-valorant-light mb-2">
                              Rank
                            </label>
                            <div className="relative">
                              <select
                                value={lfgForm.rank}
                                onChange={(e) => setLfgForm({...lfgForm, rank: e.target.value})}
                                className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                              >
                                {allRanks.map(rank => (
                                  <option key={rank} value={rank}>{rank}</option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-3 w-6 h-6">
                                <Image
                                  src={getRankImage(lfgForm.rank)}
                                  alt={lfgForm.rank}
                                  fill
                                  sizes="24px"
                                  className="object-contain"
                                />
          </div>
        </div>
                            <p className="text-xs text-valorant-light/60 mt-1">
                              Your current rank for skill-based matching
                            </p>
                          </div>
          </div>
        </div>

                      {/* Availability & Playstyle */}
                      <div className="bg-valorant-dark/30 rounded-xl p-6 border border-valorant-gray/20">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-valorant-red" />
                          Availability & Playstyle
                </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-valorant-light mb-2">
                              When are you available?
                            </label>
                            <select
                              value={lfgForm.availability}
                              onChange={(e) => setLfgForm({...lfgForm, availability: e.target.value})}
                              className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                            >
                              <option value="Now">Now (Ready to play)</option>
                              <option value="Tonight">Tonight (Later today)</option>
                              <option value="This Week">This Week (Flexible)</option>
                              <option value="Weekend">Weekend (Sat/Sun)</option>
                            </select>
                            <p className="text-xs text-valorant-light/60 mt-1">
                              When you're looking to play
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-valorant-light mb-2">
                              Playstyle
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { name: 'Entry', desc: 'First contact, site entry' },
                                { name: 'Support', desc: 'Healing, utility support' },
                                { name: 'IGL', desc: 'In-game leader, shot caller' },
                                { name: 'Fragger', desc: 'High kill potential' },
                                { name: 'Flex', desc: 'Adaptable to team needs' }
                              ].map(style => (
                                <button
                                  key={style.name}
                                  type="button"
                                  onClick={() => {
                                    const newPlaystyle = lfgForm.playstyle.includes(style.name)
                                      ? lfgForm.playstyle.filter(p => p !== style.name)
                                      : [...lfgForm.playstyle, style.name];
                                    setLfgForm({...lfgForm, playstyle: newPlaystyle});
                                  }}
                                  className={`px-4 py-2 rounded-lg text-sm transition-all border ${
                                    lfgForm.playstyle.includes(style.name)
                                      ? 'bg-valorant-red text-white border-valorant-red'
                                      : 'bg-valorant-dark border-valorant-gray/20 text-valorant-light hover:bg-valorant-gray/20 hover:border-valorant-gray/40'
                                  }`}
                                  title={style.desc}
                                >
                                  {style.name}
                                </button>
            ))}
          </div>
                            <p className="text-xs text-valorant-light/60 mt-2">
                              💡 Select your preferred roles (you can choose multiple)
                            </p>
        </div>
                        </div>
                      </div>

                      {/* Description Section */}
                      <div className="bg-valorant-dark/30 rounded-xl p-6 border border-valorant-gray/20">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                          <Search className="w-5 h-5 mr-2 text-valorant-red" />
                          Tell Us More
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-valorant-light mb-2">
                            Description (Optional)
                          </label>
                          <textarea
                            value={lfgForm.description}
                            onChange={(e) => setLfgForm({...lfgForm, description: e.target.value})}
                            placeholder="Describe your playstyle, what kind of teammates you're looking for, your communication style, or any specific requirements..."
                            rows={4}
                            className="w-full px-4 py-3 bg-valorant-dark border border-valorant-gray/20 rounded-lg text-white focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all resize-none"
                          />
                          <p className="text-xs text-valorant-light/60 mt-2">
                            💬 Help parties understand if you're a good fit for their team
                          </p>
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
                          className="flex-1 px-6 py-4 bg-valorant-red text-white rounded-lg hover:bg-valorant-red/80 transition-all font-medium text-lg shadow-lg hover:shadow-xl"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`card transition-all duration-300 ${
        isExpired ? 'opacity-60 border-gray-600' : 'hover:border-valorant-red/50 hover:shadow-xl'
      }`}
    >
      <div className="p-6">
      <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
              <div className="text-3xl">{getSizeIcon(party.size)}</div>
              <div className="relative w-16 h-16">
                <Image
                  src={getRankImage(party.rank)}
                  alt={party.rank}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
            </div>
            
          <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
              {party.size} Party
              {isExpired && <span className="ml-2 text-yellow-400 text-xs">(Expired)</span>}
              </h3>
              <div className="flex items-center space-x-4 text-valorant-light/60 text-sm mt-1">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {party.server}
                </div>
                <div className="flex items-center">
                  <Gamepad2 className="w-4 h-4 mr-1" />
                  {party.mode}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(party.createdAt).toLocaleTimeString()}
          </div>
        </div>
              {party.description && (
                <p className="text-valorant-light/80 text-sm mt-2 max-w-md">
                  {party.description}
                </p>
              )}
              
              {/* Preferred Agents */}
              {party.preferredAgents && party.preferredAgents.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-valorant-light/60">Preferred Agents:</span>
          </div>
                  <div className="flex flex-wrap gap-2">
                    {party.preferredAgents.slice(0, 6).map((agent, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-valorant-dark/30 rounded-lg px-2 py-1 border border-valorant-gray/20">
                        <div className="w-4 h-4 relative">
                          <Image
                            src={getAgentImage(agent)}
                            alt={agent}
                            fill
                            sizes="16px"
                            className="object-contain"
                          />
        </div>
                        <span className="text-xs text-valorant-light">{agent}</span>
                      </div>
                    ))}
                    {party.preferredAgents.length > 6 && (
                      <div className="flex items-center bg-valorant-dark/30 rounded-lg px-2 py-1 border border-valorant-gray/20">
                        <span className="text-xs text-valorant-light/60">
                          +{party.preferredAgents.length - 6} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Looking For Roles */}
              {party.lookingForRoles && party.lookingForRoles.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-valorant-light/60">Looking for:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {party.lookingForRoles.map((role, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-valorant-red/20 rounded-lg px-2 py-1 border border-valorant-red/30">
                        {roleHasImage(role) ? (
                          <div className="w-3 h-3 relative">
                            <Image
                              src={`/roles/${role}ClassSymbol.png`}
                              alt={role}
                              fill
                              sizes="12px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Users className="w-3 h-3" />
                        )}
                        <span className="text-xs text-white">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
        
          <div className="flex items-center space-x-3">
            <div className="bg-valorant-dark/50 rounded-lg px-4 py-2 border border-valorant-gray/20">
              <p className="text-white font-mono text-lg">{party.code}</p>
          </div>
          {!isExpired && (
            <button
                onClick={() => onCopy(party.code, party._id)}
                className="btn-primary px-4 py-2 text-sm"
              disabled={copied}
            >
                {copied ? 'Copied!' : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
            </button>
          )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced LFG Card Component
function LFGCard({ lfg, onCopy, copied }: { lfg: LFGRequest; onCopy: (text: string, type: string) => void; copied: boolean }) {
  const isExpired = new Date() > new Date(lfg.expiresAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`card transition-all duration-300 ${
        isExpired ? 'opacity-60 border-gray-600' : 'hover:border-valorant-blue/50 hover:shadow-xl'
      }`}
    >
      <div className="p-6">
      <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
              <div className="text-3xl">🎮</div>
              <div className="relative w-16 h-16">
                <Image
                  src={getRankImage(lfg.rank)}
                  alt={lfg.rank}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
            </div>
            
          <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
              Looking for Group
              {isExpired && <span className="ml-2 text-yellow-400 text-xs">(Expired)</span>}
              </h3>
              <div className="flex items-center space-x-4 text-valorant-light/60 text-sm mt-1">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {lfg.availability}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {lfg.playstyle.join(', ')}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(lfg.createdAt).toLocaleTimeString()}
          </div>
        </div>
              {lfg.description && (
                <p className="text-valorant-light/80 text-sm mt-2 max-w-md">
                  {lfg.description}
                </p>
              )}
              
              {/* Playstyle Roles */}
              {lfg.playstyle && lfg.playstyle.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-valorant-light/60">Playstyle:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lfg.playstyle.map((role, index) => (
                      <div key={index} className="flex items-center space-x-1 bg-valorant-blue/20 rounded-lg px-2 py-1 border border-valorant-blue/30">
                        <div className="w-3 h-3 relative">
                          <Image
                            src={`/roles/${role}ClassSymbol.png`}
                            alt={role}
                            fill
                            sizes="12px"
                            className="object-contain"
                          />
                        </div>
                        <span className="text-xs text-white">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
        
          <div className="flex items-center space-x-3">
            <div className="bg-valorant-dark/50 rounded-lg px-4 py-2 border border-valorant-gray/20">
              <p className="text-white font-mono text-lg">{lfg.username}</p>
          </div>
          {!isExpired && (
            <button
                onClick={() => onCopy(lfg.username, lfg._id)}
                className="btn-outline px-4 py-2 text-sm"
              disabled={copied}
            >
                {copied ? 'Copied!' : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
            </button>
          )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}