import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // We only want to redirect for non-api and non-static routes
    const isApiRoute = pathname.startsWith('/api');
    const isStaticFile = pathname.includes('.'); // Very basic check for files like logo.png, favicon.ico

    if (!isApiRoute && !isStaticFile) {
      return NextResponse.redirect(
        new URL(`/${i18n.defaultLocale}${pathname}`, request.url)
      );
    }
  }

  // Admin route security check
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : i18n.defaultLocale;
  const isAdminRoute = pathname.match(/^\/[a-z]{2}\/admin(\/|$)/);
  const isLoginRoute = pathname.match(/^\/[a-z]{2}\/admin\/login(\/|$)/);

  if (isAdminRoute) {
    const isAuthenticated = request.cookies.has('admin_session');

    if (!isAuthenticated && !isLoginRoute) {
      // Redirect unauthenticated user to login page
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }

    if (isAuthenticated && isLoginRoute) {
      // Redirect already authenticated user to dashboard
      return NextResponse.redirect(new URL(`/${locale}/admin/dashboard`, request.url));
    }
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
