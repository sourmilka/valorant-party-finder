'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  User, 
  Trophy, 
  Clock, 
  MessageSquare,
  Tag,
  ArrowRight,
  CheckCircle,
  Users,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

const createLFGSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  rank: z.enum(['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant']),
  playstyle: z.array(z.enum(['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flexible'])).min(1, 'Select at least one role'),
  availability: z.string().min(1, 'Availability is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  tags: z.array(z.string()).optional(),
});

type CreateLFGForm = z.infer<typeof createLFGSchema>;

export default function CreateLFGPage() {
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateLFGForm>({
    resolver: zodResolver(createLFGSchema),
    defaultValues: {
      tags: [],
    },
  });

  const availableTags = [
    '18+',
    'Mic Required',
    'Chill',
    'Competitive',
    'Learning',
    'Fun',
    'Serious',
    'Beginner Friendly',
  ];

  const playstyles = [
    { value: 'Duelist', icon: '⚔️', description: 'Entry fraggers and aggressive players' },
    { value: 'Initiator', icon: '🎯', description: 'Support players who gather intel' },
    { value: 'Controller', icon: '🛡️', description: 'Smoke and area control specialists' },
    { value: 'Sentinel', icon: '🔒', description: 'Defensive players and site anchors' },
    { value: 'Flexible', icon: '🔄', description: 'Can play any role as needed' },
  ];

  const onSubmit = async (data: CreateLFGForm) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to create an LFG request');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/lfg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          tags: selectedTags,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('LFG request created successfully!');
        router.push('/lfg');
      } else {
        toast.error(result.error || 'Failed to create LFG request');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePlaystyleToggle = (playstyle: string) => {
    const currentPlaystyles = watch('playstyle') || [];
    const newPlaystyles = currentPlaystyles.includes(playstyle as any)
      ? currentPlaystyles.filter(p => p !== playstyle)
      : [...currentPlaystyles, playstyle as any];
    setValue('playstyle', newPlaystyles);
  };

  return (
    <div className="min-h-screen bg-valorant-dark py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create LFG Request
          </h1>
          <p className="text-valorant-light/80 text-lg max-w-2xl mx-auto">
            Let other players know you're looking for a group. Share your playstyle, availability, and preferences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    <User className="w-4 h-4 inline mr-2" />
                    Riot Username
                  </label>
                  <input
                    {...register('username')}
                    type="text"
                    placeholder="Your Riot username (e.g., PlayerName#1234)"
                    className="input-field"
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-400">{errors.username.message}</p>
                  )}
                  <p className="mt-2 text-xs text-valorant-light/60">
                    This is how other players will find and add you in-game
                  </p>
                </div>

                {/* Rank */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    <Trophy className="w-4 h-4 inline mr-2" />
                    Current Rank
                  </label>
                  <select
                    {...register('rank')}
                    className="input-field"
                  >
                    <option value="">Select your rank</option>
                    {['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant'].map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                  {errors.rank && (
                    <p className="mt-2 text-sm text-red-400">{errors.rank.message}</p>
                  )}
                </div>

                {/* Preferred Roles */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    <Target className="w-4 h-4 inline mr-2" />
                    Preferred Roles
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {playstyles.map((playstyle) => (
                      <label
                        key={playstyle.value}
                        className={`card cursor-pointer transition-all duration-200 ${
                          watch('playstyle')?.includes(playstyle.value as any)
                            ? 'border-valorant-red bg-valorant-red/10' 
                            : 'hover:border-valorant-red/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={watch('playstyle')?.includes(playstyle.value as any) || false}
                          onChange={() => handlePlaystyleToggle(playstyle.value)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">{playstyle.icon}</div>
                          <div className="text-sm font-medium text-white mb-1">{playstyle.value}</div>
                          <div className="text-xs text-valorant-light/60">{playstyle.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.playstyle && (
                    <p className="mt-2 text-sm text-red-400">{errors.playstyle.message}</p>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Availability
                  </label>
                  <textarea
                    {...register('availability')}
                    rows={3}
                    placeholder="When are you available to play? (e.g., 'Weekdays 7-10 PM EST', 'Weekends all day', 'Flexible schedule')"
                    className="input-field"
                  />
                  {errors.availability && (
                    <p className="mt-2 text-sm text-red-400">{errors.availability.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Description (Optional)
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Tell players about yourself, your playstyle, what you're looking for in teammates..."
                    className="input-field"
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-400">{errors.description.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-valorant-light mb-3">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Tags (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`badge transition-all duration-200 ${
                          selectedTags.includes(tag)
                            ? 'badge-primary'
                            : 'badge-secondary'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create LFG Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tips */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-valorant-red mr-2" />
                Tips for Success
              </h3>
              <ul className="space-y-3 text-sm text-valorant-light/80">
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red mt-1">•</span>
                  <span>Be specific about your availability and timezone</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red mt-1">•</span>
                  <span>Include your preferred roles and playstyle</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red mt-1">•</span>
                  <span>Mention your communication preferences (mic, text, etc.)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red mt-1">•</span>
                  <span>Be honest about your skill level and goals</span>
                </li>
              </ul>
            </div>

            {/* Role Guide */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">
                Role Guide
              </h3>
              <div className="space-y-3 text-sm text-valorant-light/80">
                {playstyles.map((playstyle) => (
                  <div key={playstyle.value} className="flex items-start space-x-2">
                    <span className="text-lg">{playstyle.icon}</span>
                    <div>
                      <div className="font-medium text-white">{playstyle.value}</div>
                      <div className="text-xs">{playstyle.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expiration Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">
                Request Expiration
              </h3>
              <div className="text-sm text-valorant-light/80 space-y-2">
                <p>Your LFG request will automatically expire after 1 hour to keep the listings fresh and active.</p>
                <p>You can always create a new LFG request if needed.</p>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">
                Community Guidelines
              </h3>
              <div className="text-sm text-valorant-light/80 space-y-2">
                <p>• Be respectful and inclusive to all players</p>
                <p>• Provide accurate information about your rank and availability</p>
                <p>• Use appropriate language and avoid toxicity</p>
                <p>• Report any inappropriate behavior</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
