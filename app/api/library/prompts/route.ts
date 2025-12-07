import { NextResponse } from 'next/server';
import { getAllLibraryPrompts } from '@/lib/library-storage';

export async function GET() {
  try {
    const prompts = await getAllLibraryPrompts();
    
    return NextResponse.json({
      success: true,
      prompts: prompts,
      total: prompts.length
    });
  } catch (error) {
    console.error('Error fetching library prompts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}
