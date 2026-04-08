import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  countryLocaleMap,
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from '@/i18n/config';

const LOCALE_COOKIE = 'cubico_locale';
/** Paths that should never be locale-prefixed. */
const NON_LOCALIZED_PREFIXES = [
  '/api',
  '/auth',
  '/admin',
  '/dashboard',
  '/_next',
  '/preview',
  '/templates/', // /templates/<key>/... static HTML template assets under public/
  '/favicon',
  '/robots',
  '/sitemap',
];

function pathIsNonLocalized(pathname: string): boolean {
  return NON_LOCALIZED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p),
  );
}

/** Pull the first path segment and return it if it looks like a locale. */
function extractLocaleFromPath(pathname: string): Locale | null {
  const segment = pathname.split('/')[1] ?? '';
  return isLocale(segment) ? segment : null;
}

/**
 * Pick a default locale for a first-time visitor based on (in order):
 *   1. previously-saved cookie
 *   2. Cloudflare/Vercel geo header country code
 *   3. accept-language header
 *   4. global default
 */
function detectPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    '';
  if (country && countryLocaleMap[country.toUpperCase()]) {
    return countryLocaleMap[country.toUpperCase()];
  }

  const accept = request.headers.get('accept-language') ?? '';
  // Check for Arabic first, then Urdu — Roman Urdu browsers usually report en-PK
  if (/\bar\b/i.test(accept)) return 'ar';
  if (/\bur\b/i.test(accept)) return 'ur';

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ── 1. Localized-route handling ──
  // Skip non-localized routes (dashboard, admin, api, static templates, etc.)
  if (!pathIsNonLocalized(pathname)) {
    const currentLocale = extractLocaleFromPath(pathname);

    if (!currentLocale) {
      // No locale in the URL → redirect to the preferred locale
      const preferred = detectPreferredLocale(request);
      const url = request.nextUrl.clone();
      url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`;
      const res = NextResponse.redirect(url);
      res.cookies.set(LOCALE_COOKIE, preferred, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
      return res;
    }

    // Locale is in the URL → persist it in a cookie so future visits stick
    // and expose the pathname to server layouts via a request header so
    // the root layout can set <html lang dir> correctly on first paint.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname + search);

    let supabaseResponse = NextResponse.next({
      request: { headers: requestHeaders },
    });
    supabaseResponse.cookies.set(LOCALE_COOKIE, currentLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    // Still refresh the Supabase session on localized routes.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({
              request: { headers: requestHeaders },
            });
            supabaseResponse.cookies.set(LOCALE_COOKIE, currentLocale, {
              path: '/',
              maxAge: 60 * 60 * 24 * 365,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );
    await supabase.auth.getUser();

    return supabaseResponse;
  }

  // ── 2. Non-localized route handling (dashboard/admin/api) ──
  // Expose pathname for root layout and run existing auth checks.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname + search);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !user) {
    const url = request.nextUrl.clone();
    // Redirect to the locale-prefixed login so the user lands on their language
    const preferred = detectPreferredLocale(request);
    url.pathname = `/${preferred}/login`;
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // Match everything except Next's internals and static files.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js|mp4|webm|woff|woff2|ttf|otf)).*)',
  ],
};

// Export for tests / other modules if ever needed
export { locales, defaultLocale };
