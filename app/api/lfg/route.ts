import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LFGRequest from '@/models/LFGRequest';
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
    const playstyle = searchParams.get('playstyle');
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Build filter object
    const filter: any = { 
      status: 'Active',
      expiresAt: { $gt: new Date() }
    };

    if (server) filter.server = server;
    if (rank) filter.rank = rank;
    if (playstyle) filter.playstyle = { $in: [playstyle] };

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

    const lfgRequests = await LFGRequest.find(filter)
      // Skip populate for now since we're using temporary user IDs
      // .populate('userId', 'riotId verified')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await LFGRequest.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        lfgRequests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get LFG requests error:', error);
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

    const { username, server, rank, playstyle, availability, description, tags, inGameName } = await request.json();

    // Validation
    if (!username || !server || !rank || !playstyle || !availability) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const lfgRequest = new LFGRequest({
      userId,
      username,
      server,
      rank,
      playstyle,
      availability,
      description: description || '',
      tags: tags || [],
      inGameName: inGameName || '',
    });

    await lfgRequest.save();
    // Skip populate for now since we're using temporary user IDs
    // await lfgRequest.populate('userId', 'riotId verified');

    return NextResponse.json({
      success: true,
      data: lfgRequest,
    });
  } catch (error) {
    console.error('Create LFG request error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
