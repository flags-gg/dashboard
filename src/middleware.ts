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

    const companyInfoReq = req.cookies.get("companyInfo")
    if (companyInfoReq) {
      try {
        const cookieData = JSON.parse(companyInfoReq.value)
        const timestamp = cookieData._timestamp
        if (timestamp && Date.now() - timestamp < CACHE_DURATION * 1000) {
          return NextResponse.next()
        }
      } catch (e) {
        console.error("error parsing companyInfo cookie", e)
      }
    }

    const companyRes = await fetch(`${env.API_SERVER}/company`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-access-token': token.access_token as string ?? '',
        'x-user-subject': token.sub ?? '',
      },
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
      const cacheData = {
        ...companyInfo,
        _timestamp: Date.now(),
      }
      resp.cookies.set("companyInfo", JSON.stringify(cacheData), {
        maxAge: CACHE_DURATION,
        path: "/",
        sameSite: "lax",
      })
      return resp
    }

    if (!hasCompany) {
      if (path === '/company/create') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/company/create", req.url))
    } else {
      if (path === '/company/create') {
        return NextResponse.redirect(new URL("/company", req.url))
      }
    }
    return NextResponse.next()
  } catch (e) {
    console.error("middleware error", e)
    const response = NextResponse.next()
    response.cookies.delete("companyInfo")
    return response
  }
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
