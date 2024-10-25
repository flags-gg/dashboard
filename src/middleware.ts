import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import { type ICompanyInfo } from "~/lib/statemanager";
import {getToken} from "next-auth/jwt";
import { env } from "~/env";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path === '/' || path === '/user/account') {
    return NextResponse.next()
  }

  try {
    const token = await getToken({ req })
    if (!token) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url))
    }

    const companyInfoReq = req.cookies.get("companyInfo")
    if (companyInfoReq) {
      return NextResponse.next()
    }


    const companyRes = await fetch(`${env.API_SERVER}/company`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': token.access_token as string ?? '',
        'x-user-subject': token.sub ?? '',
      },
      cache: 'no-store',
    })
    if (!companyRes.ok) {
      if (path === '/company/create') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/company/create", req.url))
    }

    const companyInfo = await companyRes.json() as ICompanyInfo
    const hasCompany = Boolean(companyInfo?.company?.invite_code)

    if (companyInfo) {
      const resp = NextResponse.next()
      resp.cookies.set("companyInfo", JSON.stringify(companyInfo))
    }

    if (!hasCompany) {
      return NextResponse.redirect(new URL('/company/create', req.url))
    }

    if (hasCompany && path === '/company/create') {
      return NextResponse.redirect(new URL('/company', req.url))
    }

    return NextResponse.next()
  } catch (e) {
    console.error("error in middleware", e)
  }

  return NextResponse.next()
}

export {default} from "next-auth/middleware";
export const config = {
  matcher: [
    '/company/:path*',

    '/user/:path*',

    '/projects',
    '/project/:path*',
    '/agents/:path*',
    '/environments/:path*',
    '/secretmenu/:path*',
  ]
}
