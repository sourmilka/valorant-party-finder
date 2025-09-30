import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartyInvite from '@/models/PartyInvite';
import User from '@/models/User';
import { getUserIdFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const server = searchParams.get('server');
    const rank = searchParams.get('rank');
    const mode = searchParams.get('mode');
    const size = searchParams.get('size');
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Build filter object
    const filter: any = { 
      status: 'Active',
      expiresAt: { $gt: new Date() }
    };

    if (server) filter.server = server;
    if (rank) filter.rank = rank;
    if (mode) filter.mode = mode;
    if (size) filter.size = size;

    // Build sort object
    let sort: any = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'mostViewed':
        sort = { views: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const parties = await PartyInvite.find(filter)
      // Skip populate for now since we're using temporary user IDs
      // .populate('userId', 'riotId verified')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await PartyInvite.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        parties,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get parties error:', error);
    return NextResponse.json(
      { success: false, error: 'Database connection failed. Please check your MongoDB setup.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Temporary: Allow posts without authentication for testing
    const userId = getUserIdFromRequest(request) || new mongoose.Types.ObjectId().toString();
    // if (!userId) {
    //   return NextResponse.json(
    //     { success: false, error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    console.log('Party creation request body:', body);
    
    let { size, server, rank, mode, code, description, tags, inGameName, preferredRoles, preferredAgents, lookingForRoles } = body;

    // Normalize inputs
    if (typeof code === 'string') {
      code = code.trim().toUpperCase();
    }

    // Validation
    if (!size || !server || !rank || !mode || !code) {
      console.log('Missing fields:', { size, server, rank, mode, code });
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Valorant party code format: 6 alphanumeric, uppercase (e.g., OUL992)
    const valorantCodePattern = /^[A-Z0-9]{6}$/;
    if (!valorantCodePattern.test(code)) {
      return NextResponse.json(
        { success: false, error: 'Invalid party code. Use 6 letters/numbers like OUL992.' },
        { status: 400 }
      );
    }

    const party = new PartyInvite({
      userId,
      size,
      server,
      rank,
      mode,
      code,
      description: description || '',
      tags: tags || [],
      inGameName: inGameName || '',
      preferredRoles: preferredRoles || [],
      preferredAgents: preferredAgents || [],
      lookingForRoles: lookingForRoles || [],
    });

    await party.save();
    // Skip populate for now since we're using temporary user IDs
    // await party.populate('userId', 'riotId verified');

    return NextResponse.json({
      success: true,
      data: party,
    });
  } catch (error) {
    console.error('Create party error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
