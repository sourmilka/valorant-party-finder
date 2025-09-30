import mongoose, { Schema, Document } from 'mongoose';

export interface IPartyInvite extends Document {
  userId: string;
  size: 'Solo' | 'Duo' | 'Trio' | 'FourStack';
  region: string;
  rank: string;
  mode: 'Ranked' | 'Unrated' | 'Spike Rush' | 'Deathmatch' | 'Escalation' | 'Replication';
  code: string;
  description: string;
  tags: string[];
  createdAt: Date;
  expiresAt: Date;
  views: number;
  status: 'Active' | 'Expired' | 'Cancelled';
}

const PartyInviteSchema = new Schema<IPartyInvite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  } as any,
  size: {
    type: String,
    enum: ['Solo', 'Duo', 'Trio', 'FourStack'],
    required: true,
  },
  region: {
    type: String,
    required: true,
    enum: ['NA', 'EU', 'AP', 'BR', 'KR', 'LATAM'],
  },
  rank: {
    type: String,
    required: true,
    enum: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant'],
  },
  mode: {
    type: String,
    required: true,
    enum: ['Ranked', 'Unrated', 'Spike Rush', 'Deathmatch', 'Escalation', 'Replication'],
  },
  code: {
    type: String,
    required: true,
    match: /^[\w-]{3}-[\w-]{3}-[\w-]{3}$/,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  tags: [{
    type: String,
    enum: ['18+', 'Mic Required', 'Chill', 'Competitive', 'Learning', 'Fun', 'Serious', 'Beginner Friendly'],
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
  },
  views: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Cancelled'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
PartyInviteSchema.index({ status: 1, expiresAt: 1 });
PartyInviteSchema.index({ region: 1, rank: 1, mode: 1 });
PartyInviteSchema.index({ createdAt: -1 });
PartyInviteSchema.index({ userId: 1 });

// Auto-expire documents
PartyInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PartyInvite || mongoose.model<IPartyInvite>('PartyInvite', PartyInviteSchema);
