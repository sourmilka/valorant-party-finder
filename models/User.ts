import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  riotId: string;
  bio?: string;
  verified: boolean;
  blocked: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  riotId: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  blocked: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }] as any,
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
