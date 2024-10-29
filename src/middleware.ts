import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import { type ICompanyInfo } from "~/lib/statemanager";
import {getToken} from "next-auth/jwt";
import { env } from "~/env";

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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

    const cacheKey = `companyInfo-${token.sub}`
    const cache = await caches.open('company-info-cache')
    const cachedResponse = await cache.match(cacheKey)

    let companyInfo: ICompanyInfo | null = null
    if (cachedResponse) {
      companyInfo = await cachedResponse.json()
    } else {
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
      companyInfo = await companyRes.json() as ICompanyInfo
      const cacheResponse = new Response(JSON.stringify(companyInfo), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${CACHE_DURATION}`,
        },
      })
      await cache.put(cacheKey, cacheResponse)
    }

    const hasCompany = Boolean(companyInfo?.company?.invite_code)

    if (companyInfo) {
      const resp = NextResponse.next()
      resp.cookies.set("companyInfo", JSON.stringify(companyInfo))
      return resp
    }

    if (!hasCompany) {
      if (path === '/company/create') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/company/create', req.url))
    } else {
      if (path === '/company/create') {
        return NextResponse.redirect(new URL('/company', req.url))
      }
    }

    return NextResponse.next()
  } catch (e) {
    console.error("error in middleware", e)
    const cache = await caches.open('company-info-cache')
    await cache.delete(`companyInfo-${req.cookies.get("next-auth.session-token")}`)
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
