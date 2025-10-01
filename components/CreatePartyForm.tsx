'use client';

import { useState } from 'react';
import { Users, Copy, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { PARTY_SIZES, DURATION_OPTIONS, REQUIREMENT_TAGS, ROLES, AGENTS, AGENT_ROLES } from '@/lib/constants';
import { getRankImage, getAgentImage, getAgentRole } from '@/lib/agentUtils';

interface CreatePartyFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isCreating: boolean;
}

export default function CreatePartyForm({ onSubmit, isCreating }: CreatePartyFormProps) {
  const [partyForm, setPartyForm] = useState({
    riotName: '',
    riotTag: '',
    rank: '',
    server: '',
    size: '',
    mode: '',
    durationMinutes: 30,
    description: '',
    discordLink: '',
    lookingForRoles: [] as string[],
    preferredRoles: [] as string[],
    preferredAgents: [] as string[],
    tags: [] as string[],
  });

  const [riotName, setRiotName] = useState('');
  const [riotTag, setRiotTag] = useState('');

  const isFormValid = partyForm.riotName && partyForm.riotTag && partyForm.rank && partyForm.server && partyForm.size && partyForm.mode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isCreating) return;
    
    const formData = {
      ...partyForm,
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
            <label htmlFor="riot-name" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Your In-Game Name
            </label>
            <div className="flex items-center gap-2">
              <input
                id="riot-name"
                type="text"
                placeholder="Tardic"
                value={riotName}
                onChange={(e) => {
                  setRiotName(e.target.value);
                  setPartyForm({...partyForm, riotName: e.target.value});
                }}
                className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
              />
              <div className="px-3 h-11 md:h-12 flex items-center bg-valorant-dark/60 border border-valorant-gray/30 rounded-lg text-valorant-light/80 font-semibold select-none" aria-hidden="true">#</div>
              <input
                id="riot-tag"
                type="text"
                placeholder="6969"
                value={riotTag}
                onChange={(e) => {
                  setRiotTag(e.target.value);
                  setPartyForm({...partyForm, riotTag: e.target.value});
                }}
                className="w-28 h-11 md:h-12 px-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
                maxLength={5}
              />
            </div>
          </div>

          {/* Rank */}
          <div>
            <label htmlFor="party-rank" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Your Rank
            </label>
            <select
              id="party-rank"
              value={partyForm.rank}
              onChange={(e) => setPartyForm({...partyForm, rank: e.target.value})}
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
            <label htmlFor="party-server" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Server
            </label>
            <select
              id="party-server"
              value={partyForm.server}
              onChange={(e) => setPartyForm({...partyForm, server: e.target.value})}
              className="w-full h-11 md:h-12 px-4 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
            >
              <option value="">Select server</option>
              {['North America', 'Europe', 'Asia Pacific', 'Korea', 'Brazil', 'Latin America', 'Turkey', 'Russia'].map((server) => (
                <option key={server} value={server}>{server}</option>
              ))}
            </select>
          </div>

          {/* Party Size */}
          <div>
            <label id="party-size-label" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Party Size
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-3" role="group" aria-labelledby="party-size-label">
              {PARTY_SIZES.filter(size => size !== 'Solo').map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPartyForm({...partyForm, size: size as any})}
                  className={`flex items-center justify-center gap-2 h-11 md:h-12 px-3 md:px-4 rounded-lg font-semibold transition-all border focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
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
        </div>
      </div>

      {/* Game Mode & Duration */}
      <div className="bg-valorant-dark/30 rounded-xl p-4 md:p-6 border border-valorant-gray/20">
        <h3 className="text-lg font-bold text-white mb-4 md:mb-6">Game Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Game Mode */}
          <div>
            <label htmlFor="party-mode" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { key: 'Competitive', label: 'Competitive', icon: '🏆' },
                { key: 'Unrated', label: 'Unrated', icon: '⚔️' },
                { key: 'Swift Play', label: 'Swift Play', icon: '⚡' },
                { key: 'Spike Rush', label: 'Spike Rush', icon: '💥' }
              ].map((m) => {
                const isActive = partyForm.mode === m.key;
                return (
                <button
                    key={m.key}
                  type="button"
                    onClick={() => setPartyForm({ ...partyForm, mode: m.key as any })}
                    className={`group w-full h-12 sm:h-14 flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                      isActive
                        ? 'bg-valorant-red/20 border-valorant-red text-white shadow-lg'
                        : 'bg-valorant-dark/50 border-valorant-gray/30 text-valorant-light hover:bg-valorant-dark hover:border-valorant-gray/50'
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span className="font-medium text-sm sm:text-base">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="party-duration" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DURATION_OPTIONS.map((option) => {
                const active = ((partyForm as any).durationMinutes || 30) === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPartyForm({ ...partyForm, ...( { durationMinutes: option.value } as any) })}
                    className={`h-10 rounded-lg text-xs font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${active ? 'bg-valorant-red/20 text-white border-valorant-red shadow' : 'bg-valorant-dark/50 text-valorant-light border-valorant-gray/30 hover:bg-valorant-dark'}`}
                    title={option.label}
                  >
                    {option.value} min
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-valorant-dark/30 rounded-xl p-4 md:p-6 border border-valorant-gray/20">
        <h3 className="text-lg font-bold text-white mb-4 md:mb-6">Party Description</h3>
        
        <div>
          <label htmlFor="party-description" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            What's your party about?
          </label>
          <textarea
            id="party-description"
            placeholder="Looking for chill players to grind ranked with. Mic required, good comms preferred!"
            value={partyForm.description}
            onChange={(e) => setPartyForm({...partyForm, description: e.target.value})}
            className="w-full h-24 px-4 py-3 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all resize-none"
          />
        </div>

        {/* Discord Link */}
        <div className="mt-4">
          <label htmlFor="party-discord" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            Discord Link (Optional)
          </label>
          <div className="relative">
            <input
              id="party-discord"
              type="url"
              placeholder="https://discord.gg/your-server"
              value={partyForm.discordLink}
              onChange={(e) => setPartyForm({...partyForm, discordLink: e.target.value})}
              className="w-full h-11 md:h-12 px-4 pr-12 bg-valorant-dark/50 border border-valorant-gray/30 rounded-lg text-white placeholder-valorant-light/50 focus:outline-none focus:border-valorant-red focus:ring-1 focus:ring-valorant-red transition-all"
            />
            <ExternalLink className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-valorant-light/40" />
          </div>
        </div>
      </div>

      {/* Player Requirements */}
      <div className="bg-valorant-dark/30 rounded-xl p-4 md:p-6 border border-valorant-gray/20">
        <h3 className="text-lg font-bold text-white mb-4 md:mb-6">Player Requirements</h3>
        
        {/* Looking For Roles */}
        <div className="mb-6">
          <label id="looking-for-roles-label" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            Looking For Roles
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3" role="group" aria-labelledby="looking-for-roles-label">
            {[
              { role: 'Duelist', icon: '⚔️' },
              { role: 'Initiator', icon: '🎯' },
              { role: 'Controller', icon: '🛡️' },
              { role: 'Sentinel', icon: '🔍' },
              { role: 'Flexible', icon: '🔄' }
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
                  className={`w-full flex items-center justify-center gap-2 h-11 md:h-12 px-3 rounded-lg text-sm font-medium transition-all border focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    isSelected
                       ? 'bg-valorant-red/20 text-white border-valorant-red shadow'
                       : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border-valorant-gray/30'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Roles */}
        <div className="mb-6">
          <label id="preferred-roles-label" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            Your Preferred Roles
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3" role="group" aria-labelledby="preferred-roles-label">
            {[
              { role: 'Duelist', icon: '⚔️' },
              { role: 'Initiator', icon: '🎯' },
              { role: 'Controller', icon: '🛡️' },
              { role: 'Sentinel', icon: '🔍' },
              { role: 'Flexible', icon: '🔄' }
            ].map(({ role, icon }) => {
              const isSelected = partyForm.preferredRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    const newRoles = isSelected
                      ? partyForm.preferredRoles.filter(r => r !== role)
                      : [...partyForm.preferredRoles, role];
                    setPartyForm({...partyForm, preferredRoles: newRoles});
                  }}
                  className={`w-full flex items-center justify-center gap-2 h-11 md:h-12 px-3 rounded-lg text-sm font-medium transition-all border focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    isSelected
                       ? 'bg-valorant-red/20 text-white border-valorant-red shadow'
                       : 'bg-valorant-dark/50 text-valorant-light hover:bg-valorant-dark border-valorant-gray/30'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Agents */}
        <div className="mb-6">
          <label id="preferred-agents-label" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            Your Preferred Agents
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2" role="group" aria-labelledby="preferred-agents-label">
            {AGENTS.map((agent) => {
              const isSelected = partyForm.preferredAgents.includes(agent);
              return (
                <button
                  key={`${agent}`}
                  type="button"
                  onClick={() => {
                    const newAgents = isSelected
                      ? partyForm.preferredAgents.filter(a => a !== agent)
                      : [...partyForm.preferredAgents, agent];
                    setPartyForm({...partyForm, preferredAgents: newAgents});
                  }}
                  className={`flex flex-col items-center p-1.5 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
                    isSelected
                      ? 'bg-valorant-red/20 border border-valorant-red text-white'
                      : 'bg-valorant-dark/30 border border-valorant-gray/20 text-valorant-light hover:bg-valorant-dark/50'
                  }`}
                  title={agent}
                >
                  <Image
                    src={getAgentImage(agent)}
                    alt={agent}
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    unoptimized
                  />
                  <span className="text-xs mt-1 text-center leading-none">{agent}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Requirements Tags */}
        <div>
          <label id="requirements-label" className="block text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">
            Requirements
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {REQUIREMENT_TAGS.map((tag) => {
              const Icon = tag === 'Mic Required' ? Copy : tag === 'Good Comms' ? Copy : tag === 'Chill Vibes' ? Copy : Copy;
              const id = tag;
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
                   className={`w-full h-11 md:h-12 px-3 rounded-lg text-xs font-medium transition-all border flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${
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

      {/* Action Buttons */}
      <div className="flex gap-3 md:gap-4 md:justify-end">
        <button
          type="button"
          onClick={() => {/* Handle cancel - this will be passed as prop */}}
          className="inline-flex items-center justify-center w-full md:w-auto h-12 px-6 bg-valorant-dark/50 border border-valorant-gray/30 text-valorant-light rounded-lg hover:bg-valorant-dark transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-valorant-red/50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid || isCreating}
          className={`inline-flex items-center justify-center w-full md:w-auto h-12 px-6 rounded-lg transition-all font-semibold text-base md:text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-valorant-red/50 ${isCreating ? 'bg-valorant-dark text-valorant-light/50 border border-valorant-gray/30 cursor-not-allowed' : 'bg-valorant-red text-white hover:bg-valorant-red/80'}`}
        >
          <Users className="w-5 h-5 mr-2" />
          {isCreating ? 'Creating…' : 'Create Party'}
        </button>
      </div>
    </form>
  );
}
