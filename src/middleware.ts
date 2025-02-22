import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {getToken} from "next-auth/jwt";
import {cookies} from "next/headers";
import {clerkMiddleware} from "@clerk/nextjs/server";

const PUBLIC_PATHS = [
  '/api',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap.xml.gz',
  '/.next',
  '/onboarding',
  '/user/account',
  '/',
]

// export async function middleware(req: NextRequest) {
//   const cookieStore = await cookies();
//
//   if (PUBLIC_PATHS.some(path => req.nextUrl.pathname.startsWith(path))) {
//     return NextResponse.next();
//   }
//
//   try {
//     const token = await getToken({ req });
//     if (!token?.sub) {
//       return NextResponse.redirect(new URL('/api/auth/signin', req.url));
//     }
//
//     const hasCompletedOnboarding = cookieStore.get("hasCompletedOnboarding");
//     if (!hasCompletedOnboarding && !req.nextUrl.pathname.startsWith('/onboarding')) {
//       return NextResponse.redirect(new URL('/onboarding', req.url));
//     }
//
//     if (hasCompletedOnboarding && req.nextUrl.pathname.startsWith('/onboarding')) {
//       return NextResponse.redirect(new URL('/', req.url));
//     }
//   } catch (e) {
//     console.error("failed in middleware", e);
//     return NextResponse.redirect(new URL('/api/auth/signin', req.url));
//   }
//
//   return NextResponse.next()
// }

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',

    '/company/:path*',
    '/user/:path*',
    '/projects',
    '/project/:path*',
    '/agents/:path*',
    '/environments/:path*',
    '/secretmenu/:path*',
    '/',

    '/(api)(.*)',
  ]
}
