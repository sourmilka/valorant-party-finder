'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Users, 
  MapPin, 
  Trophy, 
  Clock, 
  Eye,
  Check,
  AlertTriangle
} from 'lucide-react';
import { PartyInvite } from '@/types';
import { formatRelativeTime, getRankColor, getRankIcon, copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PartyCardProps {
  party: PartyInvite;
  showActions?: boolean;
}

export default function PartyCard({ party, showActions = true }: PartyCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpired, setIsExpired] = useState(new Date() > new Date(party.expiresAt));
  
  // Ensure we have valid data
  if (!party) {
    return null;
  }

  const handleCopyCode = async () => {
    try {
      await copyToClipboard(party.code);
      setCopied(true);
      toast.success('Party code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy party code');
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

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Ranked': return 'text-yellow-400';
      case 'Unrated': return 'text-green-400';
      case 'Spike Rush': return 'text-blue-400';
      case 'Deathmatch': return 'text-red-400';
      case 'Escalation': return 'text-purple-400';
      case 'Replication': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`card card-hover transition-all duration-300 ${
        isExpired ? 'opacity-60 border-gray-600' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getSizeIcon(party.size)}</div>
          <div>
            <h3 className="text-white font-semibold flex items-center">
              {party.size} Party
              {typeof party.userId === 'object' && party.userId?.verified && (
                <span className="ml-2 text-valorant-red" title="Verified User">
                  ✓
                </span>
              )}
            </h3>
            <p className="text-valorant-light/60 text-sm">
              by {typeof party.userId === 'object' ? party.userId?.riotId : 'Unknown User'}
            </p>
          </div>
        </div>
        
        {isExpired && (
          <div className="flex items-center text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Expired
          </div>
        )}
      </div>

      {/* Party Code */}
      <div className="bg-valorant-dark/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-valorant-light/60 text-sm mb-1">Party Code</p>
            <p className="text-white font-mono text-lg">{party.code}</p>
          </div>
          {showActions && !isExpired && (
            <button
              onClick={handleCopyCode}
              className="btn-primary flex items-center space-x-2"
              disabled={copied}
              type="button"
              aria-label={copied ? "Code copied" : "Copy party code"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Party Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Trophy className={`w-4 h-4 ${getRankColor(party.rank)}`} />
          <span className="text-valorant-light/80 text-sm">
            {getRankIcon(party.rank)} {party.rank}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-valorant-light/60" />
          <span className="text-valorant-light/80 text-sm">{party.region}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`w-4 h-4 rounded-full ${getModeColor(party.mode)}`} />
          <span className="text-valorant-light/80 text-sm">{party.mode}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-valorant-light/60" />
          <span className="text-valorant-light/80 text-sm">{party.views} views</span>
        </div>
      </div>

      {/* Description */}
      {party.description && (
        <p className="text-valorant-light/80 text-sm mb-4 line-clamp-2">
          {party.description}
        </p>
      )}

      {/* Tags */}
      {party.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {party.tags.map((tag, index) => (
            <span
              key={index}
              className="badge badge-primary text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-valorant-light/60">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{formatRelativeTime(new Date(party.createdAt))}</span>
        </div>
        
        {!isExpired && (
          <div className="text-valorant-red">
            Expires {formatRelativeTime(new Date(party.expiresAt))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
