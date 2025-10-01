'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { PLAYSTYLES, PREFERENCE_TAGS } from '@/lib/constants';

interface CreateLFGFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isCreating: boolean;
}

export default function CreateLFGForm({ onSubmit, isCreating }: CreateLFGFormProps) {
  const [lfgForm, setLfgForm] = useState({
    riotName: '',
    riotTag: '',
    rank: '',
    server: '',
    availability: '',
    playstyle: [] as string[],
    description: '',
    tags: [] as string[],
  });

  const [riotName, setRiotName] = useState('');
  const [riotTag, setRiotTag] = useState('');

  const isLfgFormValid = lfgForm.riotName && lfgForm.riotTag && lfgForm.rank && lfgForm.server && lfgForm.availability && lfgForm.playstyle.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLfgFormValid || isCreating) return;
    
    const formData = {
      ...lfgForm,
      riotId: `${riotName}#${riotTag}`,
    };
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Player Information */}
      <div className="bg-valorant-dark/30 rounded-xl p-4 md:p-6 border border-valorant-gray/20">
        <h3 className="text-lg font-bold text-white mb-4 md:mb-6">Player Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Riot ID */}
          <div>
            <label htmlFor="lfg-riot-name" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Your In-Game Name
            </label>
            <div className="flex items-center gap-2">
              <input
                id="lfg-riot-name"
                type="text"
                placeholder="Tardic"
                value={riotName}
                onChange={(e) => {
                  setRiotName(e.target.value);
                  setLfgForm({...lfgForm, riotName: e.target.value});
                }}
                className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
              />
              <div className="px-3 h-11 md:h-12 flex items-center bg-valorant-dark/60 border border-valorant-gray/30 rounded-lg text-valorant-light/80 font-semibold select-none" aria-hidden="true">#</div>
              <input
                id="lfg-riot-tag"
                type="text"
                placeholder="6969"
                value={riotTag}
                onChange={(e) => {
                  setRiotTag(e.target.value);
                  setLfgForm({...lfgForm, riotTag: e.target.value});
                }}
                className="w-28 h-11 md:h-12 px-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                maxLength={5}
              />
            </div>
          </div>

          {/* Rank */}
          <div>
            <label htmlFor="lfg-rank" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Your Rank
            </label>
            <select
              id="lfg-rank"
              value={lfgForm.rank}
              onChange={(e) => setLfgForm({...lfgForm, rank: e.target.value})}
              className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
            >
              <option value="">Select your rank</option>
              {['Iron 1', 'Iron 2', 'Iron 3', 'Bronze 1', 'Bronze 2', 'Bronze 3', 'Silver 1', 'Silver 2', 'Silver 3', 'Gold 1', 'Gold 2', 'Gold 3', 'Platinum 1', 'Platinum 2', 'Platinum 3', 'Diamond 1', 'Diamond 2', 'Diamond 3', 'Ascendant 1', 'Ascendant 2', 'Ascendant 3', 'Immortal 1', 'Immortal 2', 'Immortal 3', 'Radiant'].map((rank) => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>
          </div>

          {/* Server */}
          <div>
            <label htmlFor="lfg-server" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Server
            </label>
            <select
              id="lfg-server"
              value={lfgForm.server}
              onChange={(e) => setLfgForm({...lfgForm, server: e.target.value})}
              className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
            >
              <option value="">Select server</option>
              {['North America', 'Europe', 'Asia Pacific', 'Korea', 'Brazil', 'Latin America', 'Turkey', 'Russia'].map((server) => (
                <option key={server} value={server}>{server}</option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="lfg-availability" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Availability
            </label>
            <select
              id="lfg-availability"
              value={lfgForm.availability}
              onChange={(e) => setLfgForm({...lfgForm, availability: e.target.value})}
              className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
            >
              <option value="">Select availability</option>
              {['Right Now', 'Next 30 minutes', 'Next hour', 'Next few hours', 'This evening', 'Tonight', 'Tomorrow'].map((availability) => (
                <option key={availability} value={availability}>{availability}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-valorant-dark/30 rounded-xl p-4 md:p-6 border border-valorant-gray/20">
        <h3 className="text-lg font-bold text-white mb-4 md:mb-6">Preferences</h3>
        
        {/* Playstyle */}
        <div className="mb-6">
          <label id="playstyle-label" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            Playstyle
          </label>
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

        {/* Tags */}
        <div>
          <label id="lfg-tags-label" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            What are you looking for?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {PREFERENCE_TAGS.map((t) => {
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

      {/* Description */}
      <div className="bg-valorant-dark/30 rounded-xl p-4 md:p-6 border border-valorant-gray/20">
        <h3 className="text-lg font-bold text-white mb-4 md:mb-6">Tell us more</h3>
        
        <div>
          <label htmlFor="lfg-description" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            What are you looking for in a party?
          </label>
          <div className="relative">
            <textarea
              id="lfg-description"
              placeholder="Looking for a chill group to play ranked with. I main Sage and prefer strategic gameplay. Mic required!"
              value={lfgForm.description}
              onChange={(e) => setLfgForm({...lfgForm, description: e.target.value})}
              maxLength={300}
              className="w-full h-24 px-4 py-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all resize-none"
            />
            <div className="absolute bottom-2 right-2 text-xs text-valorant-light/50">
              {lfgForm.description.length}/300
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => {/* Handle cancel - this will be passed as prop */}}
          className="flex-1 px-6 py-4 bg-valorant-dark border border-valorant-gray/20 text-valorant-light rounded-lg hover:bg-valorant-gray/20 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-valorant-red/50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isLfgFormValid || isCreating}
          className={`flex-1 px-6 py-4 rounded-lg transition-all font-medium text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
            (!isLfgFormValid || isCreating)
              ? 'bg-valorant-dark text-valorant-light/50 border border-valorant-gray/30 cursor-not-allowed'
              : 'bg-valorant-red text-white hover:bg-valorant-red/80'
          }`}
        >
          <UserPlus className="w-5 h-5 mr-2 inline" />
          {isCreating ? 'Posting…' : 'Post LFG Request'}
        </button>
      </div>
    </form>
  );
}
