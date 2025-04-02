import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/auth/LogIn', '/auth/SignUp', '/auth/SignUp/additional-info', '/'];

  const authToken = request.cookies.get('userAuthToken')?.value;
  const isAuthenticated = !!authToken;

  if (!publicRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/LogIn', request.url));
  }

  if ((pathname.startsWith('/auth/LogIn') || pathname.startsWith('/auth/SignUp')) && isAuthenticated) {
    return NextResponse.redirect(new URL('/user/basic-info', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
