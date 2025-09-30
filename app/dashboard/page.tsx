'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Users, 
  Eye, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  Trophy,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { PartyInvite, LFGRequest, DashboardStats } from '@/types';
import { formatRelativeTime, copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [parties, setParties] = useState<PartyInvite[]>([]);
  const [lfgRequests, setLfgRequests] = useState<LFGRequest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalViews: 0,
    activePosts: 0,
    expiredPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      // Fetch user data, parties, and LFG requests
      const [userResponse, partiesResponse, lfgResponse] = await Promise.all([
        fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/user/parties', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/user/lfg', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.data);
      }

      if (partiesResponse.ok) {
        const partiesData = await partiesResponse.json();
        setParties(partiesData.data.parties || []);
      }

      if (lfgResponse.ok) {
        const lfgData = await lfgResponse.json();
        setLfgRequests(lfgData.data.lfgRequests || []);
      }

      // Calculate stats
      const allPosts = [...parties, ...lfgRequests];
      setStats({
        totalPosts: allPosts.length,
        totalViews: allPosts.reduce((sum, post) => sum + post.views, 0),
        activePosts: allPosts.filter(post => post.status === 'Active').length,
        expiredPosts: allPosts.filter(post => post.status === 'Expired').length,
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await copyToClipboard(text);
      setCopiedItems(prev => new Set(Array.from(prev).concat([id])));
      toast.success('Copied to clipboard!');
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDeletePost = async (id: string, type: 'party' | 'lfg') => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/${type === 'party' ? 'parties' : 'lfg'}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Post deleted successfully');
        fetchUserData(); // Refresh data
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-valorant-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-600 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-valorant-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.riotId || 'Player'}!
          </h1>
          <p className="text-valorant-light/80">
            Manage your parties, LFG requests, and track your activity.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card text-center">
            <Activity className="w-6 h-6 text-valorant-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
            <div className="text-valorant-light/60 text-sm">Total Posts</div>
          </div>
          <div className="card text-center">
            <Eye className="w-6 h-6 text-valorant-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalViews}</div>
            <div className="text-valorant-light/60 text-sm">Total Views</div>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-6 h-6 text-valorant-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.activePosts}</div>
            <div className="text-valorant-light/60 text-sm">Active Posts</div>
          </div>
          <div className="card text-center">
            <Clock className="w-6 h-6 text-valorant-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.expiredPosts}</div>
            <div className="text-valorant-light/60 text-sm">Expired Posts</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create-party" className="btn-primary flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Party</span>
              </Link>
              <Link href="/create-lfg" className="btn-outline flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Post LFG Request</span>
              </Link>
              <Link href="/parties" className="btn-secondary flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Browse Parties</span>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Parties */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 text-valorant-red mr-2" />
                Your Parties
              </h2>
              {parties.length > 0 ? (
                <div className="space-y-4">
                  {parties.slice(0, 5).map((party) => (
                    <div key={party._id} className="bg-valorant-gray/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-medium">{party.size} Party</h3>
                          <p className="text-valorant-light/60 text-sm">
                            {party.region} • {party.rank} • {party.mode}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(party.code, party._id)}
                            className="btn-secondary text-xs"
                          >
                            {copiedItems.has(party._id) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeletePost(party._id, 'party')}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-valorant-light/60">
                        <span>{party.views} views</span>
                        <span className={`${
                          party.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {party.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {parties.length > 5 && (
                    <Link href="/dashboard/parties" className="text-valorant-red hover:text-red-400 text-sm">
                      View all parties →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-valorant-light/40 mx-auto mb-4" />
                  <p className="text-valorant-light/60 mb-4">No parties created yet</p>
                  <Link href="/create-party" className="btn-primary">
                    Create Your First Party
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent LFG Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 text-valorant-red mr-2" />
                Your LFG Requests
              </h2>
              {lfgRequests.length > 0 ? (
                <div className="space-y-4">
                  {lfgRequests.slice(0, 5).map((lfg) => (
                    <div key={lfg._id} className="bg-valorant-gray/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-medium">{lfg.username}</h3>
                          <p className="text-valorant-light/60 text-sm">
                            {lfg.rank} • {lfg.playstyle.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(lfg.username, lfg._id)}
                            className="btn-secondary text-xs"
                          >
                            {copiedItems.has(lfg._id) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeletePost(lfg._id, 'lfg')}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-valorant-light/60">
                        <span>{lfg.views} views</span>
                        <span className={`${
                          lfg.status === 'Active' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {lfg.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {lfgRequests.length > 5 && (
                    <Link href="/dashboard/lfg" className="text-valorant-red hover:text-red-400 text-sm">
                      View all LFG requests →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-valorant-light/40 mx-auto mb-4" />
                  <p className="text-valorant-light/60 mb-4">No LFG requests posted yet</p>
                  <Link href="/create-lfg" className="btn-primary">
                    Post Your First LFG Request
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
