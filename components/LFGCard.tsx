'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  User, 
  Trophy, 
  Clock, 
  Eye,
  Check,
  AlertTriangle,
  Users
} from 'lucide-react';
import { LFGRequest } from '@/types';
import { formatRelativeTime, getRankColor, getRankIcon, copyToClipboard } from '@/lib/utils';
import toast from 'react-hot-toast';

interface LFGCardProps {
  lfg: LFGRequest;
  showActions?: boolean;
}

export default function LFGCard({ lfg, showActions = true }: LFGCardProps) {
  const [copied, setCopied] = useState(false);
  const [isExpired, setIsExpired] = useState(new Date() > new Date(lfg.expiresAt));
  
  // Ensure we have valid data
  if (!lfg) {
    return null;
  }

  const handleCopyUsername = async () => {
    try {
      await copyToClipboard(lfg.username);
      setCopied(true);
      toast.success('Username copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy username');
    }
  };

  const getPlaystyleIcon = (playstyle: string) => {
    switch (playstyle) {
      case 'Duelist': return '⚔️';
      case 'Initiator': return '🎯';
      case 'Controller': return '🛡️';
      case 'Sentinel': return '🔒';
      case 'Flexible': return '🔄';
      default: return '🎮';
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
          <div className="text-2xl">🎮</div>
          <div>
            <h3 className="text-white font-semibold flex items-center">
              Looking for Group
              {typeof lfg.userId === 'object' && lfg.userId?.verified && (
                <span className="ml-2 text-valorant-red" title="Verified User">
                  ✓
                </span>
              )}
            </h3>
            <p className="text-valorant-light/60 text-sm">
              by {typeof lfg.userId === 'object' ? lfg.userId?.riotId : 'Unknown User'}
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

      {/* Username */}
      <div className="bg-valorant-dark/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-valorant-light/60 text-sm mb-1">Riot Username</p>
            <p className="text-white font-mono text-lg">{lfg.username}</p>
          </div>
          {showActions && !isExpired && (
            <button
              onClick={handleCopyUsername}
              className="btn-primary flex items-center space-x-2"
              disabled={copied}
              type="button"
              aria-label={copied ? "Username copied" : "Copy username"}
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

      {/* Player Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Trophy className={`w-4 h-4 ${getRankColor(lfg.rank)}`} />
          <span className="text-valorant-light/80 text-sm">
            {getRankIcon(lfg.rank)} {lfg.rank}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-valorant-light/60" />
          <span className="text-valorant-light/80 text-sm">{lfg.views} views</span>
        </div>
      </div>

      {/* Playstyle */}
      {lfg.playstyle.length > 0 && (
        <div className="mb-4">
          <p className="text-valorant-light/60 text-sm mb-2">Preferred Roles</p>
          <div className="flex flex-wrap gap-2">
            {lfg.playstyle.map((role, index) => (
              <span
                key={index}
                className="badge badge-secondary flex items-center space-x-1"
              >
                <span>{getPlaystyleIcon(role)}</span>
                <span>{role}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="mb-4">
        <p className="text-valorant-light/60 text-sm mb-1">Availability</p>
        <p className="text-valorant-light/80 text-sm">{lfg.availability}</p>
      </div>

      {/* Description */}
      {lfg.description && (
        <p className="text-valorant-light/80 text-sm mb-4 line-clamp-2">
          {lfg.description}
        </p>
      )}

      {/* Tags */}
      {lfg.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {lfg.tags.map((tag, index) => (
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
          <span>{formatRelativeTime(new Date(lfg.createdAt))}</span>
        </div>
        
        {!isExpired && (
          <div className="text-valorant-red">
            Expires {formatRelativeTime(new Date(lfg.expiresAt))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
