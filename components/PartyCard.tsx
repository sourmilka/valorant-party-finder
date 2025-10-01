'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { PartyInvite } from '@/types';
import { getRankImage, getAgentImage } from '@/lib/agentUtils';

interface PartyCardProps {
  party: PartyInvite;
  onCopy: (text: string, type: string) => void;
  copied: boolean;
}

export default function PartyCard({ party, onCopy, copied }: PartyCardProps) {
  const isExpired = new Date() > new Date(party.expiresAt);

  const roleHasImage = (role: string) => ['Duelist','Initiator','Controller','Sentinel'].includes(role);

  const getTimeAgo = (d: Date | string) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  };

  const getTtl = (d: Date | string) => {
    const ms = new Date(d).getTime() - Date.now();
    if (ms <= 0) return 'expired';
    const m = Math.ceil(ms / 60000);
    if (m < 60) return `${m}m left`;
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm ? `${h}h ${rm}m left` : `${h}h left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-gradient-to-br from-[#0F1923] to-[#1A1D29] border-2 rounded-2xl overflow-hidden transition-all ${
        isExpired ? 'opacity-50 border-gray-700' : 'border-valorant-red/40 hover:border-valorant-red hover:shadow-2xl hover:shadow-valorant-red/20'
      }`}
    >
      {/* Red accent stripe */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-valorant-red via-orange-500 to-valorant-red" />
      
      {/* Rank badge - top right corner */}
      <div className="absolute top-4 right-4 w-16 h-16 z-10">
        <Image src={getRankImage(party.rank)} alt={party.rank} fill sizes="64px" className="object-contain drop-shadow-lg" />
      </div>

      <div className="p-5 pt-6 space-y-4">
        {/* Party Code - Hero Element */}
        <div className="text-center py-6 bg-black/30 rounded-xl border border-valorant-red/30">
          <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Party Code</div>
          <div className="font-mono text-3xl tracking-[0.3em] text-white font-bold">{party.code}</div>
          <div className="mt-3 flex justify-center gap-2">
            {!isExpired && (
              <button 
                onClick={() => onCopy(party.code, party._id)} 
                disabled={copied} 
                className="px-4 py-1.5 bg-valorant-red/20 hover:bg-valorant-red/30 border border-valorant-red/50 rounded-lg text-white text-xs font-semibold transition-all" 
                aria-label={`Copy party code ${party.code}`}
              >
                {copied ? '✓ Copied' : 'Copy Code'}
              </button>
            )}
            {party.discordLink && (
              <a 
                href={party.discordLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-1.5 bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/50 rounded-lg text-white text-xs font-semibold transition-all"
              >
                Discord
              </a>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Mode</span>
            <span className="text-white font-semibold">{party.mode}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Size</span>
            <span className="text-white font-semibold">{party.size}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Server</span>
            <span className="text-white font-semibold text-right">{party.server}</span>
          </div>
          {party.inGameName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-valorant-light/60">Player</span>
              <span className="text-white font-semibold">{party.inGameName}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Expires</span>
            <span className="text-orange-400 font-semibold">{getTtl(party.expiresAt)}</span>
          </div>
        </div>

        {/* Description */}
        {party.description && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <p className="text-valorant-light/80 text-xs leading-relaxed italic">{party.description}</p>
          </div>
        )}

        {/* Looking For Roles */}
        {party.lookingForRoles && party.lookingForRoles.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Looking For</div>
            <div className="flex flex-wrap gap-1.5">
              {party.lookingForRoles.map((role, i) => (
                <div key={`${role}-${i}`} className="flex items-center gap-1 bg-valorant-red/10 border border-valorant-red/30 rounded-md px-2 py-1">
                  {roleHasImage(role) && <Image src={`/roles/${role}ClassSymbol.png`} alt={role} width={12} height={12} className="object-contain" />}
                  <span className="text-white text-[11px] font-medium">{role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Roles (What Creator Plays) */}
        {Array.isArray((party as any).preferredRoles) && (party as any).preferredRoles.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Creator Plays</div>
            <div className="flex flex-wrap gap-1.5">
              {(party as any).preferredRoles.map((role: string, i: number) => (
                <div key={`${role}-pref-${i}`} className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 rounded-md px-2 py-1">
                  <span className="text-blue-300 text-[11px] font-medium">{role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agents Preview */}
        {party.preferredAgents && party.preferredAgents.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Preferred Agents</div>
            <div className="grid grid-cols-4 gap-2">
              {party.preferredAgents.slice(0, 4).map((agent, i) => (
                <div key={`${agent}-${i}`} className="flex flex-col items-center gap-1 group/agent">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-valorant-gray/30 bg-black/40 group-hover/agent:border-valorant-red/50 transition-all">
                    <Image src={getAgentImage(agent)} alt={agent} width={40} height={40} className="object-cover" />
                  </div>
                  <span className="text-[9px] text-valorant-light/70 truncate w-full text-center">{agent}</span>
                </div>
              ))}
              {party.preferredAgents.length > 4 && (
                <div className="flex items-center justify-center text-[10px] text-valorant-light/50">
                  +{party.preferredAgents.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Requirements/Tags */}
        {party.tags && party.tags.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Requirements</div>
            <div className="flex flex-wrap gap-1">
              {party.tags.slice(0, 4).map((t, i) => (
                <span key={`${t}-${i}`} className="px-2 py-0.5 bg-black/40 border border-valorant-gray/40 rounded text-[10px] text-valorant-light/70">
                  {t.replace(' Required', '')}
                </span>
              ))}
              {party.tags.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] text-valorant-light/50">+{party.tags.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer: Time + Views */}
        <div className="pt-3 border-t border-valorant-gray/20 flex items-center justify-between text-[10px] text-valorant-light/50">
          <span>Posted {getTimeAgo(party.createdAt)}</span>
          {typeof (party as any).views === 'number' && (
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(party as any).views}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
