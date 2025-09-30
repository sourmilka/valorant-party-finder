import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LFGRequest from '@/models/LFGRequest';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const lfgRequests = await LFGRequest.find({ userId })
      .populate('userId', 'riotId verified')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: { lfgRequests },
    });
  } catch (error) {
    console.error('Get user LFG requests error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
