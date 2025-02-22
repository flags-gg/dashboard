import {clerkMiddleware} from "@clerk/nextjs/server";

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
