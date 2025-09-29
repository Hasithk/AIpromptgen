import { NextResponse } from 'next/server';

// POST /api/payments
export async function POST(req: Request) {
  // TODO: Integrate 2Checkout payment processing
  return NextResponse.json({ message: 'Payment processed' });
}
