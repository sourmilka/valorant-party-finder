'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  RefreshCw, 
  User, 
  Trophy, 
  Users,
  Clock,
  Eye
} from 'lucide-react';
import LFGCard from '@/components/LFGCard';
import { LFGRequest, FilterOptions } from '@/types';

export default function BrowseLFGPage() {
  const [lfgRequests, setLfgRequests] = useState<LFGRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ranks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant'];
  const playstyles = ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flexible'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'mostViewed', label: 'Most Viewed' },
  ];

  useEffect(() => {
    fetchLFGRequests();
  }, [filters, page]);

  const fetchLFGRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.length > 0) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.set(key, value);
          }
        }
      });

      const response = await fetch(`/api/lfg?${params}`);
      const data = await response.json();

      if (data.success) {
        if (page === 1) {
          setLfgRequests(data.data.lfgRequests);
        } else {
          setLfgRequests(prev => [...prev, ...data.data.lfgRequests]);
        }
        setHasMore(data.data.pagination.page < data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching LFG requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key as keyof FilterOptions] === value ? undefined : value,
    }));
    setPage(1);
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortBy as any,
    }));
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const refreshLFG = () => {
    setPage(1);
    fetchLFGRequests();
  };

  return (
    <div className="min-h-screen bg-valorant-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            LFG Requests
          </h1>
          <p className="text-valorant-light/80 text-lg max-w-2xl mx-auto">
            Find solo players looking for groups. Connect with teammates who match your playstyle and rank.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-valorant-light/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search LFG requests..."
                  className="input-field pl-10 w-full sm:w-80"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <button
                onClick={refreshLFG}
                className="btn-secondary flex items-center space-x-2"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <SortAsc className="w-4 h-4 text-valorant-light/60" />
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input-field w-40"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 card"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Rank Filter */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    Rank
                  </label>
                  <div className="space-y-2">
                    {ranks.map((rank) => (
                      <label key={rank} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.rank?.includes(rank) || false}
                          onChange={() => handleFilterChange('rank', rank)}
                          className="h-4 w-4 text-valorant-red focus:ring-valorant-red border-gray-600 rounded"
                        />
                        <span className="ml-2 text-valorant-light/80">{rank}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Playstyle Filter */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    Preferred Role
                  </label>
                  <div className="space-y-2">
                    {playstyles.map((playstyle) => (
                      <label key={playstyle} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.playstyle?.includes(playstyle) || false}
                          onChange={() => handleFilterChange('playstyle', playstyle)}
                          className="h-4 w-4 text-valorant-red focus:ring-valorant-red border-gray-600 rounded"
                        />
                        <span className="ml-2 text-valorant-light/80">{playstyle}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    Tags
                  </label>
                  <div className="space-y-2">
                    {['18+', 'Mic Required', 'Chill', 'Competitive', 'Learning', 'Fun', 'Serious', 'Beginner Friendly'].map((tag) => (
                      <label key={tag} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.tags?.includes(tag)}
                          onChange={() => {
                            const currentTags = filters.tags || [];
                            const newTags = currentTags.includes(tag)
                              ? currentTags.filter(t => t !== tag)
                              : [...currentTags, tag];
                            setFilters(prev => ({ ...prev, tags: newTags }));
                            setPage(1);
                          }}
                          className="h-4 w-4 text-valorant-red focus:ring-valorant-red border-gray-600 rounded"
                        />
                        <span className="ml-2 text-valorant-light/80">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="card text-center">
            <User className="w-6 h-6 text-valorant-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{lfgRequests.length}</div>
            <div className="text-valorant-light/60 text-sm">Active LFG</div>
          </div>
          <div className="card text-center">
            <Trophy className="w-6 h-6 text-valorant-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{ranks.length}</div>
            <div className="text-valorant-light/60 text-sm">Ranks</div>
          </div>
          <div className="card text-center">
            <Users className="w-6 h-6 text-valorant-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{playstyles.length}</div>
            <div className="text-valorant-light/60 text-sm">Roles</div>
          </div>
          <div className="card text-center">
            <Clock className="w-6 h-6 text-valorant-red mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">1h</div>
            <div className="text-valorant-light/60 text-sm">Avg. Duration</div>
          </div>
        </motion.div>

        {/* LFG Requests Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading && lfgRequests.length === 0 ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-2/3"></div>
              </div>
            ))
          ) : lfgRequests.length > 0 ? (
            lfgRequests.map((lfg) => (
              <LFGCard key={lfg._id} lfg={lfg} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-valorant-light/60 text-lg mb-4">
                No LFG requests found matching your criteria
              </div>
              <button
                onClick={() => {
                  setFilters({});
                  setPage(1);
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Load More Button */}
        {hasMore && lfgRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <button
              onClick={loadMore}
              disabled={loading}
              className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner" />
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More Requests'
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
