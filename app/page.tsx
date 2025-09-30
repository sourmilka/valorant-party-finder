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
  Trophy
} from 'lucide-react';
import PartyCard from '@/components/PartyCard';
import LFGCard from '@/components/LFGCard';
import { PartyInvite, LFGRequest } from '@/types';

export default function HomePage() {
  const [recentParties, setRecentParties] = useState<PartyInvite[]>([]);
  const [recentLFG, setRecentLFG] = useState<LFGRequest[]>([]);
  const [loading, setLoading] = useState(true);

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

      {/* Live Feeds Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Live Community Activity
            </h2>
            <p className="text-valorant-light/80 text-lg">
              See what's happening right now in the Valorant community
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Parties */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Users className="w-6 h-6 mr-2 text-valorant-red" />
                  Recent Parties
                </h3>
                <Link
                  href="/parties"
                  className="text-valorant-red hover:text-red-400 transition-colors flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="card animate-pulse">
                        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentParties.length > 0 ? (
                  recentParties.map((party) => (
                    <PartyCard key={party._id} party={party} />
                  ))
                ) : (
                  <div className="card text-center py-8">
                    <p className="text-valorant-light/60">No recent parties found</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent LFG Requests */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Search className="w-6 h-6 mr-2 text-valorant-red" />
                  LFG Requests
                </h3>
                <Link
                  href="/lfg"
                  className="text-valorant-red hover:text-red-400 transition-colors flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="card animate-pulse">
                        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentLFG.length > 0 ? (
                  recentLFG.map((lfg) => (
                    <LFGCard key={lfg._id} lfg={lfg} />
                  ))
                ) : (
                  <div className="card text-center py-8">
                    <p className="text-valorant-light/60">No recent LFG requests found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
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
