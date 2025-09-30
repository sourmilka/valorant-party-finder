import mongoose, { Schema, Document } from 'mongoose';

export interface ILFGRequest extends Document {
  userId: string;
  username: string;
  server: string;
  rank: string;
  playstyle: string[];
  availability: string;
  description: string;
  tags: string[];
  inGameName: string;
  createdAt: Date;
  expiresAt: Date;
  views: number;
  status: 'Active' | 'Expired' | 'Cancelled';
}

const LFGRequestSchema = new Schema<ILFGRequest>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  } as any,
  username: {
    type: String,
    required: true,
    trim: true,
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
  playstyle: [{
    type: String,
    // Relax enum because UI sends values like Entry, Support, IGL, Fragger, Flex
    trim: true,
  }],
  availability: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  inGameName: {
    type: String,
    required: false,
    trim: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
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
LFGRequestSchema.index({ status: 1, expiresAt: 1 });
LFGRequestSchema.index({ rank: 1, playstyle: 1 });
LFGRequestSchema.index({ createdAt: -1 });
LFGRequestSchema.index({ userId: 1 });

// Auto-expire documents
LFGRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.LFGRequest || mongoose.model<ILFGRequest>('LFGRequest', LFGRequestSchema);
