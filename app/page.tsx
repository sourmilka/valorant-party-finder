'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  ChevronDown
} from 'lucide-react';
import { PartyInvite, LFGRequest, CreatePartyData, CreateLFGData } from '@/types';
import PartyCard from '@/components/PartyCard';
import LFGCard from '@/components/LFGCard';
import { getServerLatency, getPingColor, getPingStatus } from '@/lib/pingUtils';
import { agentRoles, agents, getAgentsByRole, getAllRoles, getRoleInfo, getAgentImage, getAllAgents, getAgentRole } from '@/lib/agentUtils';
import { GAME_MODES, PARTY_SIZES, PLAYSTYLES, AVAILABILITY_OPTIONS, DURATION_OPTIONS, REQUIREMENT_TAGS, PREFERENCE_TAGS } from '@/lib/constants';

export default function HomePage() {
  const [recentParties, setRecentParties] = useState<PartyInvite[]>([]);
  const [recentLFG, setRecentLFG] = useState<LFGRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'create-party' | 'create-lfg'>('browse');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Simple fetch function
  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const [partiesResponse, lfgResponse] = await Promise.all([
        fetch('/api/parties'),
        fetch('/api/lfg')
      ]);

      if (partiesResponse.ok) {
        const partiesData = await partiesResponse.json();
        if (partiesData.success) {
          setRecentParties(partiesData.data.parties || []);
        }
      }

      if (lfgResponse.ok) {
        const lfgData = await lfgResponse.json();
        if (lfgData.success) {
          setRecentLFG(lfgData.data.lfgRequests || []);
        }
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      setRecentParties([]);
      setRecentLFG([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle copy functionality
  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  useEffect(() => {
    fetchRecentPosts();
    const interval = setInterval(fetchRecentPosts, 30000);
    return () => clearInterval(interval);
  }, []);

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
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-valorant-dark/80 backdrop-blur-xl border-b border-valorant-red/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Logo and Title */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-valorant-red to-valorant-red/80 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-valorant-dark animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">VALORANT Party Finder</h1>
                  <p className="text-valorant-light/60 text-sm">Find your perfect team</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
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
                  className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    activeTab === 'create-party'
                      ? 'bg-valorant-red text-white shadow-lg'
                      : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Create Party
                </button>
                <button
                  onClick={() => setActiveTab('create-lfg')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    activeTab === 'create-lfg'
                      ? 'bg-valorant-red text-white shadow-lg'
                      : 'text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30'
                  }`}
                >
                  <UserPlus className="w-4 h-4 mr-2 inline" />
                  Post LFG
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => fetchRecentPosts()}
                    className="p-2 text-valorant-light/60 hover:text-white hover:bg-valorant-dark/30 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
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
                transition={{ duration: 0.3 }}
              >
                {/* Browse Content */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Recent Activity</h2>
                    <p className="text-valorant-light/60">Find active parties and LFG requests</p>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valorant-red"></div>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {/* Parties */}
                      {recentParties.map((party) => (
                        <PartyCard 
                          key={party._id} 
                          party={party} 
                          onCopy={handleCopy}
                          copied={copiedItem === party._id}
                        />
                      ))}
                      
                      {/* LFG Requests */}
                      {recentLFG.map((lfg) => (
                        <LFGCard 
                          key={lfg._id} 
                          lfg={lfg} 
                          onCopy={handleCopy}
                          copied={copiedItem === lfg._id}
                        />
                      ))}
                      
                      {recentParties.length === 0 && recentLFG.length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <Users className="w-16 h-16 text-valorant-light/30 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-white mb-2">No Recent Activity</h3>
                          <p className="text-valorant-light/60 mb-6">Be the first to create a party or LFG request!</p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            <button
                              onClick={() => setActiveTab('create-party')}
                              className="px-6 py-3 bg-valorant-red text-white rounded-lg font-medium hover:bg-valorant-red/90 transition-colors focus:outline-none focus:ring-2 focus:ring-valorant-red/50"
                            >
                              <Plus className="w-4 h-4 mr-2 inline" />
                              Create Party
                            </button>
                            <button
                              onClick={() => setActiveTab('create-lfg')}
                              className="px-6 py-3 bg-valorant-blue text-white rounded-lg font-medium hover:bg-valorant-blue/90 transition-colors focus:outline-none focus:ring-2 focus:ring-valorant-blue/50"
                            >
                              <UserPlus className="w-4 h-4 mr-2 inline" />
                              Post LFG
                            </button>
                          </div>
                        </div>
                      )}
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
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Party</h2>
                    <p className="text-valorant-light/60">Set up your party and find teammates</p>
                  </div>
                  
                  <div className="bg-valorant-dark/40 backdrop-blur-xl rounded-2xl border border-valorant-red/20 p-8">
                    <p className="text-center text-valorant-light/60 py-8">
                      Party creation form will be implemented here
                    </p>
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
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Post LFG Request</h2>
                    <p className="text-valorant-light/60">Let others know you're looking for a group</p>
                  </div>
                  
                  <div className="bg-valorant-dark/40 backdrop-blur-xl rounded-2xl border border-valorant-red/20 p-8">
                    <p className="text-center text-valorant-light/60 py-8">
                      LFG creation form will be implemented here
                    </p>
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
