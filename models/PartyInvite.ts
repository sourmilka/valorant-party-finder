import mongoose, { Schema, Document } from 'mongoose';

export interface IPartyInvite extends Document {
  userId: string;
  size: 'Solo' | 'Duo' | 'Trio' | 'FourStack';
  server: string;
  rank: string;
  mode: 'Ranked' | 'Unrated' | 'Spike Rush' | 'Deathmatch' | 'Escalation' | 'Replication';
  code: string;
  description: string;
  tags: string[];
  inGameName: string;
  discordLink?: string;
  preferredRoles: string[];
  preferredAgents: string[];
  lookingForRoles: string[];
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
  server: {
    type: String,
    required: true,
    enum: [
      // North America (NA)
      'Chicago, IL (USA)',
      'Los Angeles, CA (USA)',
      'New York, NY (USA)',
      'Dallas, TX (USA)',
      'Phoenix, AZ (USA)',
      // Latin America North (LATAM North)
      'Miami, FL (USA)',
      'Mexico City, Mexico',
      // Brazil (BR)
      'São Paulo, Brazil',
      'Rio de Janeiro, Brazil',
      // EMEA (Europe/Middle East/North Africa)
      'Frankfurt, Germany',
      'London, UK',
      'Paris, France',
      'Madrid, Spain',
      'Warsaw, Poland',
      'Stockholm, Sweden',
      'Manama, Bahrain',
      'Cape Town, South Africa',
      // Asia-Pacific (APAC)
      'Mumbai, India',
      'Singapore',
      'Hong Kong',
      'Tokyo, Japan',
      'Seoul, South Korea',
      'Sydney, Australia',
      // China
      'Tianjin',
      'Nanjing',
      'Chongqing',
      'Guangzhou'
    ],
  },
  rank: {
    type: String,
    required: true,
    enum: ['Iron 1', 'Iron 2', 'Iron 3', 'Bronze 1', 'Bronze 2', 'Bronze 3', 'Silver 1', 'Silver 2', 'Silver 3', 'Gold 1', 'Gold 2', 'Gold 3', 'Platinum 1', 'Platinum 2', 'Platinum 3', 'Diamond 1', 'Diamond 2', 'Diamond 3', 'Ascendant 1', 'Ascendant 2', 'Ascendant 3', 'Immortal 1', 'Immortal 2', 'Immortal 3', 'Radiant'],
  },
  mode: {
    type: String,
    required: true,
    enum: ['Ranked', 'Unrated', 'Spike Rush', 'Deathmatch', 'Escalation', 'Replication'],
  },
  code: {
    type: String,
    required: true,
    match: /^[A-Z0-9]{6}$/,
  },
      description: {
        type: String,
        maxlength: 500,
      },
      inGameName: {
    type: String,
    required: false,
    trim: true,
      },
  discordLink: {
    type: String,
    required: false,
    trim: true,
    maxlength: 300,
  },
  // Relax tag validation to avoid 500s when UI sends new labels (e.g., "18+ Only", "Microphone Required")
  tags: [{
    type: String,
    trim: true,
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
PartyInviteSchema.index({ server: 1, rank: 1, mode: 1 });
PartyInviteSchema.index({ createdAt: -1 });
PartyInviteSchema.index({ userId: 1 });

// Auto-expire documents
PartyInviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PartyInvite || mongoose.model<IPartyInvite>('PartyInvite', PartyInviteSchema);
