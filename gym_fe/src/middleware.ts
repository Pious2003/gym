import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user')?.value;
  let isAdmin = false;
  let isLoggedIn = false;
  
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      isAdmin = user.type === 0 || user.type === 2;
      isLoggedIn = true;
      
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }

  const currentPath = request.nextUrl.pathname;

  // Protect admin routes
  if (currentPath.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Protect user routes except /user/buy (which should be public)
  // Also allow root path (/) to be public since it now contains the course browsing
  if (currentPath.startsWith('/user') && !currentPath.startsWith('/user/buy') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*']
}
