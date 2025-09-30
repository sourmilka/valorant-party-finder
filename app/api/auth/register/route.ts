import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';
import { validateRiotId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, riotId } = await request.json();

    // Validation
    if (!email || !password || !riotId) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!validateRiotId(riotId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Riot ID format. Use: Username#1234' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { riotId }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email or Riot ID already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const user = new User({
      email,
      password: hashedPassword,
      riotId,
    });

    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          riotId: user.riotId,
          verified: user.verified,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
