import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')?.value;
  let isAdmin = false;
  
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      isAdmin = user.type === 0 || user.type === 2;
      
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }

  const currentPath = request.nextUrl.pathname;

  if (currentPath.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}
