import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: {
          email: existingUser.email,
          credits: existingUser.credits,
          plan: existingUser.plan
        }
      });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: session.user.email,
        name: session.user.name || '',
        credits: 50,
        monthlyCreditsUsed: 0,
        lastCreditResetDate: new Date(),
        plan: 'free'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully!',
      user: {
        email: newUser.email,
        credits: newUser.credits,
        plan: newUser.plan
      }
    });

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
