'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import { LFGRequest } from '@/types';
import { getRankImage } from '@/lib/rankUtils';

interface LFGCardProps {
  lfg: LFGRequest;
  onCopy: (text: string, type: string) => void;
  copied: boolean;
}

export default function LFGCard({ lfg, onCopy, copied }: LFGCardProps) {
  const isExpired = new Date() > new Date(lfg.expiresAt);

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden transition-all duration-300 rounded-xl border w-full ${
        isExpired ? 'opacity-60 border-gray-700' : 'hover:border-valorant-blue/60 hover:shadow-[0_0_0_1px_rgba(64,185,255,0.35)]'
      }`}
      style={{ background: 'linear-gradient(180deg, rgba(64,185,255,0.10) 0%, rgba(20,24,28,0.8) 100%)' }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-sky-500/60" />
      <div className="p-5 pt-6 space-y-4">
        {/* Username - Hero Element */}
        <div className="text-center py-6 bg-black/30 rounded-xl border border-sky-500/30">
          <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Player Looking for Group</div>
          <div className="font-mono text-2xl tracking-wider text-white font-bold">{lfg.username}</div>
          <div className="mt-3 flex justify-center gap-2">
            {!isExpired && (
              <button 
                onClick={() => onCopy(lfg.username, lfg._id)} 
                disabled={copied} 
                className="px-4 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 rounded-lg text-white text-xs font-semibold transition-all" 
                aria-label={`Copy player id ${lfg.username}`}
              >
                {copied ? '✓ Copied' : 'Copy ID'}
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Availability</span>
            <span className="text-sky-300 font-semibold">{lfg.availability}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Server</span>
            <span className="text-white font-semibold text-right">{lfg.server}</span>
          </div>
          {lfg.inGameName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-valorant-light/60">IGN</span>
              <span className="text-white font-semibold">{lfg.inGameName}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-valorant-light/60">Expires</span>
            <span className="text-orange-400 font-semibold">{getTtl(lfg.expiresAt)}</span>
          </div>
        </div>

        {/* Description */}
        {lfg.description && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <p className="text-valorant-light/80 text-xs leading-relaxed italic">{lfg.description}</p>
          </div>
        )}

        {/* Playstyle */}
        {lfg.playstyle && lfg.playstyle.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Playstyle</div>
            <div className="flex flex-wrap gap-1.5">
              {lfg.playstyle.map((style, i) => (
                <div key={`${style}-${i}`} className="flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 rounded-md px-2 py-1">
                  <span className="text-sky-300 text-[11px] font-medium">{style}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {lfg.tags && lfg.tags.length > 0 && (
          <div className="pt-3 border-t border-valorant-gray/20">
            <div className="text-[10px] uppercase tracking-widest text-valorant-light/60 mb-2">Preferences</div>
            <div className="flex flex-wrap gap-1">
              {lfg.tags.slice(0, 4).map((t, i) => (
                <span key={`${t}-${i}`} className="px-2 py-0.5 bg-black/40 border border-valorant-gray/40 rounded text-[10px] text-valorant-light/70">
                  {t}
                </span>
              ))}
              {lfg.tags.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] text-valorant-light/50">+{lfg.tags.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer: Time + Views */}
        <div className="pt-3 border-t border-valorant-gray/20 flex items-center justify-between text-[10px] text-valorant-light/50">
          <span>Posted {getTimeAgo(lfg.createdAt)}</span>
          {typeof (lfg as any).views === 'number' && (
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(lfg as any).views}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
