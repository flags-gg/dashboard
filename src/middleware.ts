import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";
import { ICompanyInfo } from "~/lib/statemanager";

export async function middleware(req: NextRequest) {
  const session = await getServerAuthSession();
  const protectedPaths = [
    '/company',
    '/company/create',

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

  if (session && req.nextUrl.pathname.startsWith('/company')) {
    try {
      const companyRes = await fetch(`${env.API_SERVER}/company/info`)
      if (!companyRes.ok) {
        throw new Error('Failed to fetch company info')
      }

      const companyInfo = await companyRes.json() as ICompanyInfo
      const path = req.nextUrl.pathname

      if (companyInfo?.company?.invite_code && path === '/company/create') {
        return NextResponse.redirect('/company')
      }

      if (!companyInfo?.company?.invite_code && path.startsWith("/company") && !path.includes("/create")) {
        return NextResponse.redirect('/company/create')
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error('Error fetching company info', e)
      }
      console.error('Error fetching company info')
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/company/:path*',

    '/user/:path*',

    '/agents/:path*',
    '/environments/:path*',
    '/secretmenu/:path*',
    '/projects/:path*',
  ]
}
