import mongoose, { Schema, Document } from 'mongoose';

export interface ILFGRequest extends Document {
  userId: string;
  username: string;
  rank: string;
  playstyle: string[];
  availability: string;
  description: string;
  tags: string[];
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
  rank: {
    type: String,
    required: true,
    enum: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant'],
  },
  playstyle: [{
    type: String,
    enum: ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flexible'],
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
    enum: ['18+', 'Mic Required', 'Chill', 'Competitive', 'Learning', 'Fun', 'Serious', 'Beginner Friendly'],
  }],
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
