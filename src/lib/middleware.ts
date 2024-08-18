import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import { getServerAuthSession } from "~/server/auth";

export async function middleware(req: NextRequest) {
  const session = await getServerAuthSession();
  const isRootPath = req.nextUrl.pathname === '/';

  const protectedPaths = [
    '/company',
    '/company/setup',

    '/user',
    '/user/account',

    '/agents',
    '/environments',
    '/secretmenu',
    '/projects'
  ]
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
  if (!session && isProtectedPath) {
    return NextResponse.redirect('/');
  }

  return null
}

export const config = {
  matcher: [
    '/company/:path*',
    '/user/:path*',
    '/agents/:path*',
    ' /environments/:path*',
    '/secretmenu/:path*',
    '/projects/:path*',
  ]
}
