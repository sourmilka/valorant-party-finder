'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Users, 
  MapPin, 
  Trophy, 
  Gamepad2, 
  Hash, 
  MessageSquare,
  Tag,
  ArrowRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const createPartySchema = z.object({
  size: z.enum(['Solo', 'Duo', 'Trio', 'FourStack']),
  region: z.enum(['NA', 'EU', 'AP', 'BR', 'KR', 'LATAM']),
  rank: z.enum(['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant']),
  mode: z.enum(['Ranked', 'Unrated', 'Spike Rush', 'Deathmatch', 'Escalation', 'Replication']),
  code: z.string().regex(/^[\w-]{3}-[\w-]{3}-[\w-]{3}$/, 'Invalid party code format'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  tags: z.array(z.string()).optional(),
});

type CreatePartyForm = z.infer<typeof createPartySchema>;

export default function CreatePartyPage() {
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreatePartyForm>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {
      tags: [],
    },
  });

  const watchedSize = watch('size');
  const watchedMode = watch('mode');

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

  const onSubmit = async (data: CreatePartyForm) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to create a party');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/parties', {
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
        toast.success('Party created successfully!');
        router.push('/parties');
      } else {
        toast.error(result.error || 'Failed to create party');
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

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generateSegment = () => {
      let result = '';
      for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
  };

  const isRankedRestricted = (size: string, mode: string) => {
    return mode === 'Ranked' && size === 'FourStack';
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
            Create Party Invitation
          </h1>
          <p className="text-valorant-light/80 text-lg max-w-2xl mx-auto mb-8">
            Share your party code and find teammates to join your Valorant game.
          </p>
          
          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-valorant-red text-white' 
                      : 'bg-valorant-dark border border-valorant-light/30 text-valorant-light/60'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step ? 'bg-valorant-red' : 'bg-valorant-light/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-valorant-light/60">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Basic Information' :
              currentStep === 2 ? 'Game Details' : 'Final Details'
            }
          </div>
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
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-white mb-2">Basic Information</h3>
                      <p className="text-valorant-light/60">Tell us about your party setup</p>
                    </div>

                    {/* Party Size */}
                    <div>
                      <label className="block text-sm font-medium text-valorant-light mb-3">
                        <Users className="w-4 h-4 inline mr-2" />
                        Party Size
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Solo', 'Duo', 'Trio', 'FourStack'].map((size) => (
                          <label
                            key={size}
                            className={`card cursor-pointer transition-all duration-200 ${
                              watchedSize === size 
                                ? 'border-valorant-red bg-valorant-red/10' 
                                : 'hover:border-valorant-red/50'
                            }`}
                          >
                            <input
                              {...register('size')}
                              type="radio"
                              value={size}
                              className="sr-only"
                            />
                            <div className="text-center">
                              <div className="text-2xl mb-2">
                                {size === 'Solo' && '👤'}
                                {size === 'Duo' && '👥'}
                                {size === 'Trio' && '👨‍👩‍👧'}
                                {size === 'FourStack' && '👨‍👩‍👧‍👦'}
                              </div>
                              <div className="text-sm font-medium text-white">{size}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.size && (
                        <p className="mt-2 text-sm text-red-400">{errors.size.message}</p>
                      )}
                    </div>

                    {/* Region */}
                    <div>
                      <label className="block text-sm font-medium text-valorant-light mb-3">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Region
                      </label>
                      <select
                        {...register('region')}
                        className="input-field"
                      >
                        <option value="">Select Region</option>
                        {['NA', 'EU', 'AP', 'BR', 'KR', 'LATAM'].map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                      {errors.region && (
                        <p className="mt-2 text-sm text-red-400">{errors.region.message}</p>
                      )}
                    </div>

                    {/* Rank */}
                    <div>
                      <label className="block text-sm font-medium text-valorant-light mb-3">
                        <Trophy className="w-4 h-4 inline mr-2" />
                        Rank
                      </label>
                      <select
                        {...register('rank')}
                        className="input-field"
                      >
                        <option value="">Select Rank</option>
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
                  </motion.div>
                )}

                {/* Step 2: Game Details */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-white mb-2">Game Details</h3>
                      <p className="text-valorant-light/60">Choose your game mode and party code</p>
                    </div>

                    {/* Mode */}
                    <div>
                      <label className="block text-sm font-medium text-valorant-light mb-3">
                        <Gamepad2 className="w-4 h-4 inline mr-2" />
                        Game Mode
                      </label>
                      <select
                        {...register('mode')}
                        className="input-field"
                      >
                        <option value="">Select Mode</option>
                        {['Ranked', 'Unrated', 'Spike Rush', 'Deathmatch', 'Escalation', 'Replication'].map((mode) => (
                          <option key={mode} value={mode}>
                            {mode}
                          </option>
                        ))}
                      </select>
                      {errors.mode && (
                        <p className="mt-2 text-sm text-red-400">{errors.mode.message}</p>
                      )}
                      
                      {/* Ranked Mode Warning */}
                      {isRankedRestricted(watchedSize, watchedMode) && (
                        <div className="mt-3 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                            <div className="text-sm text-yellow-200">
                              <p className="font-medium">Ranked Mode Restriction</p>
                              <p>4-stack parties are not allowed in Ranked mode. Consider using a different party size or game mode.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Party Code */}
                    <div>
                      <label className="block text-sm font-medium text-valorant-light mb-3">
                        <Hash className="w-4 h-4 inline mr-2" />
                        Party Code
                      </label>
                      <div className="flex space-x-3">
                        <input
                          {...register('code')}
                          type="text"
                          placeholder="ABC-DEF-GHI"
                          className="input-field flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setValue('code', generateRandomCode())}
                          className="btn-secondary"
                        >
                          Generate
                        </button>
                      </div>
                      {errors.code && (
                        <p className="mt-2 text-sm text-red-400">{errors.code.message}</p>
                      )}
                      <p className="mt-2 text-xs text-valorant-light/60">
                        Get your party code from the Valorant client (Social → Party → Invite Code)
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Final Details */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-white mb-2">Final Details</h3>
                      <p className="text-valorant-light/60">Add description and tags to attract the right players</p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-valorant-light mb-3">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Description (Optional)
                      </label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        placeholder="Tell players what you're looking for..."
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
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-valorant-light/10">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="btn-outline"
                    >
                      Previous
                    </button>
                  )}
                  
                  <div className="flex-1" />
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="btn-primary"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={loading ? "Creating party..." : "Create party"}
                    >
                      {loading ? (
                        <div className="spinner" />
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>Create Party</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
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
                  <span>Be specific about your playstyle and expectations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red mt-1">•</span>
                  <span>Include relevant tags to attract the right players</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red mt-1">•</span>
                  <span>Keep your party code active and ready to accept invites</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red mt-1">•</span>
                  <span>Be respectful and communicate clearly with your team</span>
                </li>
              </ul>
            </div>

            {/* Party Code Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">
                How to Get Your Party Code
              </h3>
              <ol className="space-y-3 text-sm text-valorant-light/80">
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red font-bold">1.</span>
                  <span>Open Valorant and go to the Social tab</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red font-bold">2.</span>
                  <span>Click on "Party" to create or join a party</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red font-bold">3.</span>
                  <span>Click "Invite Code" to generate your party code</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-valorant-red font-bold">4.</span>
                  <span>Copy the code and paste it in the form above</span>
                </li>
              </ol>
            </div>

            {/* Expiration Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">
                Party Expiration
              </h3>
              <div className="text-sm text-valorant-light/80 space-y-2">
                <p>Your party invitation will automatically expire after 30 minutes to keep the listings fresh and active.</p>
                <p>You can always create a new party invitation if needed.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
