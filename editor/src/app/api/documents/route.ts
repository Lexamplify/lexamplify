import { NextResponse } from 'next/server';
import { createDocument } from '@/lib/firebase/documents';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { fileName, templateType } = await request.json();
    
    if (!fileName || !templateType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fileId = await createDocument(userId, fileName, templateType);
    
    return NextResponse.json({ fileId });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
