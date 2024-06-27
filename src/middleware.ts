import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export default auth((req: any) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  if (req.auth && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    const newUrl = new URL('/', nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  if (!req.auth && pathname !== '/auth/signin' && pathname !== '/auth/signup') {
    const newUrl = new URL('/auth/signin', nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [ '/((?!api|_next/static|_next/image|img|favicon.ico).*)' ],
};
