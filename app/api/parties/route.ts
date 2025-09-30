import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartyInvite from '@/models/PartyInvite';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const region = searchParams.get('region');
    const rank = searchParams.get('rank');
    const mode = searchParams.get('mode');
    const size = searchParams.get('size');
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Build filter object
    const filter: any = { 
      status: 'Active',
      expiresAt: { $gt: new Date() }
    };

    if (region) filter.region = region;
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
      .populate('userId', 'riotId verified')
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

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { size, region, rank, mode, code, description, tags } = await request.json();

    // Validation
    if (!size || !region || !rank || !mode || !code) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Validate party code format
    const codePattern = /^[\w-]{3}-[\w-]{3}-[\w-]{3}$/;
    if (!codePattern.test(code)) {
      return NextResponse.json(
        { success: false, error: 'Invalid party code format' },
        { status: 400 }
      );
    }

    const party = new PartyInvite({
      userId,
      size,
      region,
      rank,
      mode,
      code,
      description: description || '',
      tags: tags || [],
    });

    await party.save();
    await party.populate('userId', 'riotId verified');

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
