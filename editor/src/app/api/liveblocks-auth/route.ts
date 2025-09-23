import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";
import { NextRequest, NextResponse } from 'next/server';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { sessionClaims } = await auth();

    if (!sessionClaims) {
      console.log("❌ No session claims found");
      return NextResponse.json("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const user = await currentUser();

    if (!user) {
      console.log("❌ No user found");
      return NextResponse.json("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const { room } = await req.json();
    console.log("🔍 Liveblocks auth request for room:", room);
    console.log("👤 User:", { id: user.id, email: user.primaryEmailAddress?.emailAddress });
    console.log("🏢 Organization claims:", { 
      org_id: sessionClaims.org_id, 
      org_role: sessionClaims.org_role,
      organization_id: sessionClaims.organization_id,
      org_from_o_field: sessionClaims.o,
      all_claims: Object.keys(sessionClaims)
    });

    // Debug: Log all session claims to understand the structure
    console.log("🔍 Full session claims:", JSON.stringify(sessionClaims, null, 2));

    const document = await convex.query(api.documents.getById, { id: room });

    if (!document) {
      console.log("❌ Document not found:", room);
      return NextResponse.json("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    console.log("📄 Document found:", { 
      id: document._id, 
      ownerId: document.ownerId, 
      organizationId: document.organizationId 
    });

    const isOwner = document.ownerId === user.id;
    
    // Extract organization ID from the 'o' field in session claims
    const userOrgId = (sessionClaims.o as { id?: string })?.id;
    const isOrganizationMember = !!(
      document.organizationId && 
      userOrgId && 
      document.organizationId === userOrgId
    );

    console.log("🔐 Access check:", { 
      isOwner, 
      isOrganizationMember, 
      userOrgId,
      docOrgId: document.organizationId 
    });

    if (!isOwner && !isOrganizationMember) {
      console.log("❌ Access denied - user is neither owner nor organization member");
      return NextResponse.json("Unauthorized", { 
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const name = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
    const nameToNumber = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = Math.abs(nameToNumber) % 360;
    const color = `hsl(${hue}, 80%, 60%)`;
    
    console.log("✅ Access granted, creating Liveblocks session for:", name);
    
    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name,
        avatar: user.imageUrl,
        color,
      },
    });
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    console.log("🎉 Liveblocks session authorized successfully");
    return new NextResponse(body, { 
      status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error("❌ Liveblocks auth error:", error);
    return NextResponse.json("Internal Server Error", { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}
