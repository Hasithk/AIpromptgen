import { NextResponse } from 'next/server';

let mockCredits = 70;
let mockPlan = 'free';
let mockResetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

export async function GET() {
  try {
    // In a real app, this would fetch from database based on authenticated user
    return NextResponse.json({
      success: true,
      data: {
        credits: mockCredits,
        plan: mockPlan,
        resetDate: mockResetDate,
      }
    });
  } catch (error) {
    console.error('Credits fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }
    // Reduce credits (mock)
    if (mockCredits - amount < 0) {
      return NextResponse.json({ success: false, error: 'Insufficient credits' }, { status: 400 });
    }
    mockCredits -= amount;
    return NextResponse.json({ success: true, data: { credits: mockCredits } });
  } catch (error) {
    console.error('Credits update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}