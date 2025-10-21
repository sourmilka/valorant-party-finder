import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartyInvite from '@/models/PartyInvite';
import User from '@/models/User';
import { getUserIdFromRequest } from '@/lib/auth';
import { createPartyRateLimit, getClientIdentifier } from '@/lib/rateLimitPro';
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

    // Require authentication for creating parties
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in to create a party.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Party creation request body:', body);
    
    let { size, server, rank, mode, code, description, tags, inGameName, preferredRoles, preferredAgents, lookingForRoles, durationMinutes, discordLink } = body;

    // Normalize inputs
    if (typeof code === 'string') {
      code = code.trim().toUpperCase();
    }

    // Validation
    const missing: string[] = [];
    if (!size) missing.push('size');
    if (!server) missing.push('server');
    if (!rank) missing.push('rank');
    if (!mode) missing.push('mode');
    if (!code) missing.push('code');
    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Required fields missing: ${missing.join(', ')}` },
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

    // Professional rate limiting for party creation
    const identifier = getClientIdentifier(request, userId);
    const rateLimitResult = await createPartyRateLimit.checkLimit(identifier);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please wait before creating another party.',
          resetTime: rateLimitResult.resetTime
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toISOString()
          }
        }
      );
    }

    // Server-controlled TTL: clamp duration between 5 and 120 minutes, default 30
    const now = Date.now();
    const clampedMinutes = Math.max(5, Math.min(parseInt(durationMinutes || '30', 10) || 30, 120));
    const expiresAt = new Date(now + clampedMinutes * 60 * 1000);

    // Basic discord link validation (optional)
    if (discordLink && typeof discordLink === 'string') {
      const trimmed = discordLink.trim();
      const looksLikeDiscord = /discord\.gg|discord\.com\/.*/i.test(trimmed);
      discordLink = looksLikeDiscord ? trimmed : '';
    }

    const party = new PartyInvite({
      userId,
      size,
      server,
      rank,
      mode,
      code,
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      inGameName: inGameName || '',
      discordLink: discordLink || '',
      preferredRoles: Array.isArray(preferredRoles) ? preferredRoles : [],
      preferredAgents: Array.isArray(preferredAgents) ? preferredAgents : [],
      lookingForRoles: Array.isArray(lookingForRoles) ? lookingForRoles : [],
      expiresAt,
    });

    await party.save();
    // Populate user data for response
    await party.populate('userId', 'riotId verified');

    return NextResponse.json({
      success: true,
      data: { ...party.toObject(), ttlMinutes: clampedMinutes },
    });
  } catch (error: any) {
    console.error('Create party error:', error);
    if (error?.name === 'ValidationError') {
      const details = Object.values(error.errors || {}).map((e: any) => e.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
