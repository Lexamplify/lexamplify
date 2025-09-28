import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for the editor
  if (pathname.startsWith('/editor')) {
    // Rewrite to the editor application
    const editorUrl = new URL(pathname.replace('/editor', ''), 'http://localhost:3001');
    
    // Copy query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      editorUrl.searchParams.set(key, value);
    });
    
    return NextResponse.rewrite(editorUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/editor/:path*',
  ],
};
