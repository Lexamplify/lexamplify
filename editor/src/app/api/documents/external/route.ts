import { auth, currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { NextRequest, NextResponse } from 'next/server';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json("Missing document ID", { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    // Verify Clerk authentication
    const { sessionClaims } = await auth();
    const user = await currentUser();
    
    if (!sessionClaims || !user) {
      return NextResponse.json("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    // Get document
    const document = await convex.query(api.documents.getById, { id: documentId });
    
    if (!document) {
      return NextResponse.json("Document not found", { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    // Check permissions using Clerk organization data
    const isOwner = document.ownerId === user.id;
    const userOrgId = (sessionClaims.o as { id?: string })?.id;
    const isOrganizationMember = !!(
      document.organizationId && 
      userOrgId && 
      document.organizationId === userOrgId
    );
    
    if (!isOwner && !isOrganizationMember) {
      return NextResponse.json("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    return NextResponse.json({
      id: document._id,
      title: document.title,
      content: document.initialContent,
      ownerId: document.ownerId,
      organizationId: document.organizationId,
      clerkUserId: user.id,
      userInfo: {
        name: user.fullName || user.primaryEmailAddress?.emailAddress || "Anonymous",
        email: user.primaryEmailAddress?.emailAddress,
        avatar: user.imageUrl
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('External document access error:', error);
    return NextResponse.json("Internal Server Error", { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}




