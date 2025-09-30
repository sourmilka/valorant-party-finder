'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Zap, 
  Shield, 
  Globe, 
  Clock, 
  Star,
  ArrowRight,
  Play,
  Target,
  Trophy,
  Filter,
  X,
  ChevronDown
} from 'lucide-react';
import PartyCard from '@/components/PartyCard';
import LFGCard from '@/components/LFGCard';
import { PartyInvite, LFGRequest } from '@/types';

export default function HomePage() {
  const [recentParties, setRecentParties] = useState<PartyInvite[]>([]);
  const [recentLFG, setRecentLFG] = useState<LFGRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'parties' | 'lfg'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const [partiesResponse, lfgResponse] = await Promise.all([
        fetch('/api/parties?limit=5'),
        fetch('/api/lfg?limit=5')
      ]);

      const partiesData = await partiesResponse.json();
      const lfgData = await lfgResponse.json();

      if (partiesData.success) {
        setRecentParties(partiesData.data.parties);
      }

      if (lfgData.success) {
        setRecentLFG(lfgData.data.lfgRequests);
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Updates',
      description: 'Live party feeds with instant notifications when new opportunities arise.',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safe & Secure',
      description: 'Built-in moderation and reporting system to ensure a positive community.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Community',
      description: 'Connect with players from all regions and skill levels worldwide.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Smart Matching',
      description: 'Advanced filtering to find the perfect teammates for your playstyle.',
    },
  ];

  const stats = [
    { label: 'Active Parties', value: '1,234', icon: <Users className="w-5 h-5" /> },
    { label: 'LFG Requests', value: '567', icon: <Search className="w-5 h-5" /> },
    { label: 'Successful Matches', value: '8,901', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Global Players', value: '12,345', icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-valorant-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-valorant-red/10 via-transparent to-valorant-blue/20" />
          <div className="absolute inset-0 bg-[url('/patterns/valorant-bg.svg')] opacity-5 bg-cover bg-center" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Find Your
              <span className="text-valorant-red block">Perfect Squad</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-valorant-light/80 max-w-3xl mx-auto">
              Connect with Valorant players worldwide. Create parties, find teammates, 
              and dominate the battlefield together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-party" className="btn-primary text-lg px-8 py-4">
                <Plus className="w-5 h-5 mr-2" />
                Create Party
              </Link>
              <Link href="/parties" className="btn-outline text-lg px-8 py-4">
                <Search className="w-5 h-5 mr-2" />
                Browse Parties
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <ArrowRight className="w-6 h-6 text-valorant-red rotate-90" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-valorant-gray/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2 text-valorant-red">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-valorant-light/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feeds Section - Compact Design */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Live Community Activity
            </h2>
            <p className="text-valorant-light/80 text-lg">
              See what's happening right now in the Valorant community
            </p>
          </motion.div>

          {/* Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex bg-valorant-dark/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'all'
                      ? 'bg-valorant-red text-white'
                      : 'text-valorant-light/60 hover:text-white'
                  }`}
                >
                  All Activity
                </button>
                <button
                  onClick={() => setActiveFilter('parties')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'parties'
                      ? 'bg-valorant-red text-white'
                      : 'text-valorant-light/60 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2 inline" />
                  Parties
                </button>
                <button
                  onClick={() => setActiveFilter('lfg')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'lfg'
                      ? 'bg-valorant-red text-white'
                      : 'text-valorant-light/60 hover:text-white'
                  }`}
                >
                  <Search className="w-4 h-4 mr-2 inline" />
                  LFG Requests
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Link href="/create-party" className="btn-primary text-sm px-4 py-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Party
                </Link>
                <Link href="/create-lfg" className="btn-outline text-sm px-4 py-2">
                  <Search className="w-4 h-4 mr-2" />
                  Post LFG
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Compact Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="grid gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded"></div>
                        <div>
                          <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-600 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-8 bg-gray-600 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {/* Show all, parties only, or LFG only based on filter */}
                {activeFilter === 'all' && (
                  <>
                    {recentParties.slice(0, 3).map((party) => (
                      <CompactPartyCard key={party._id} party={party} />
                    ))}
                    {recentLFG.slice(0, 3).map((lfg) => (
                      <CompactLFGCard key={lfg._id} lfg={lfg} />
                    ))}
                  </>
                )}
                {activeFilter === 'parties' && recentParties.map((party) => (
                  <CompactPartyCard key={party._id} party={party} />
                ))}
                {activeFilter === 'lfg' && recentLFG.map((lfg) => (
                  <CompactLFGCard key={lfg._id} lfg={lfg} />
                ))}
                
                {/* Empty state */}
                {((activeFilter === 'all' && recentParties.length === 0 && recentLFG.length === 0) ||
                  (activeFilter === 'parties' && recentParties.length === 0) ||
                  (activeFilter === 'lfg' && recentLFG.length === 0)) && (
                  <div className="card text-center py-12">
                    <div className="text-valorant-light/60 mb-4">
                      {activeFilter === 'all' && <Users className="w-12 h-12 mx-auto mb-4" />}
                      {activeFilter === 'parties' && <Users className="w-12 h-12 mx-auto mb-4" />}
                      {activeFilter === 'lfg' && <Search className="w-12 h-12 mx-auto mb-4" />}
                    </div>
                    <p className="text-valorant-light/60 mb-4">
                      No {activeFilter === 'all' ? 'activity' : activeFilter} found
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Link href="/create-party" className="btn-primary text-sm">
                        Create Party
                      </Link>
                      <Link href="/create-lfg" className="btn-outline text-sm">
                        Post LFG
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* View All Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 mt-8"
          >
            <Link
              href="/parties"
              className="btn-outline flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Browse All Parties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/lfg"
              className="btn-outline flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse All LFG
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-valorant-gray/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Valorant Party Finder?
            </h2>
            <p className="text-valorant-light/80 text-lg max-w-3xl mx-auto">
              Built specifically for the Valorant community with features that matter to competitive players.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:border-valorant-red/50 transition-all duration-300"
              >
                <div className="text-valorant-red mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-valorant-light/80">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Find Your Squad?
            </h2>
            <p className="text-valorant-light/80 text-lg">
              Join thousands of players who have already found their perfect teammates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-primary text-lg px-8 py-4">
                Get Started Now
              </Link>
              <Link href="/about" className="btn-outline text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Compact Party Card Component
function CompactPartyCard({ party }: { party: PartyInvite }) {
  const [copied, setCopied] = useState(false);
  const isExpired = new Date() > new Date(party.expiresAt);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(party.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy party code');
    }
  };

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
      whileHover={{ y: -1 }}
      className={`card transition-all duration-300 ${
        isExpired ? 'opacity-60 border-gray-600' : 'hover:border-valorant-red/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getSizeIcon(party.size)}</div>
          <div>
            <h4 className="text-white font-semibold flex items-center">
              {party.size} Party
              {isExpired && <span className="ml-2 text-yellow-400 text-xs">(Expired)</span>}
            </h4>
            <p className="text-valorant-light/60 text-sm">
              {party.rank} • {party.region} • {party.mode}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-valorant-dark/50 rounded-lg px-3 py-2">
            <p className="text-white font-mono text-sm">{party.code}</p>
          </div>
          {!isExpired && (
            <button
              onClick={handleCopyCode}
              className="btn-primary text-xs px-3 py-1"
              disabled={copied}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Compact LFG Card Component
function CompactLFGCard({ lfg }: { lfg: LFGRequest }) {
  const [copied, setCopied] = useState(false);
  const isExpired = new Date() > new Date(lfg.expiresAt);

  const handleCopyUsername = async () => {
    try {
      await navigator.clipboard.writeText(lfg.username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy username');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      className={`card transition-all duration-300 ${
        isExpired ? 'opacity-60 border-gray-600' : 'hover:border-valorant-blue/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🎮</div>
          <div>
            <h4 className="text-white font-semibold flex items-center">
              Looking for Group
              {isExpired && <span className="ml-2 text-yellow-400 text-xs">(Expired)</span>}
            </h4>
            <p className="text-valorant-light/60 text-sm">
              {lfg.rank} • {lfg.playstyle.join(', ')} • {lfg.availability}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-valorant-dark/50 rounded-lg px-3 py-2">
            <p className="text-white font-mono text-sm">{lfg.username}</p>
          </div>
          {!isExpired && (
            <button
              onClick={handleCopyUsername}
              className="btn-outline text-xs px-3 py-1"
              disabled={copied}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
