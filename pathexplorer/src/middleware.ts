import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/auth/LogIn', '/auth/SignUp', '/auth/SignUp/additional-info', '/'];
  const managerOnlyRoutes = ['/user/employees', '/user/projects'];

  const authToken = request.cookies.get('userAuthToken')?.value;
  const isAuthenticated = !!authToken;

  const userRole = request.cookies.get('userRole')?.value;

  if (!publicRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/LogIn', request.url));
  }

  if ((pathname.startsWith('/auth/LogIn') || pathname.startsWith('/auth/SignUp')) && isAuthenticated) {
    return NextResponse.redirect(new URL('/user/basic-info', request.url));
  }

  if (managerOnlyRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated || userRole !== 'Manager') {
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
