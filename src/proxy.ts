import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

// "/" renders its own <SignIn />; UploadThing callbacks and webhooks are called by third parties.
const isPublicRoute = createRouteMatcher(["/", "/api/uploadthing(.*)", "/api/webhooks(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);
const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  if (!isApiRoute(req)) {
    await auth.protect({unauthenticatedUrl: new URL("/", req.url).toString()});
    return;
  }

  if (!(await auth()).userId) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  // JSON-only API: blocks cross-site form posts (text/plain, urlencoded, multipart).
  const contentType = req.headers.get("content-type");
  if (MUTATING.has(req.method) && (contentType ?? req.body) && !contentType?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({error: "Unsupported Media Type"}, {status: 415});
  }
});

export const config = {
  matcher: [
    // Clerk's default: skip only real static files, so dotted page paths still get Clerk before auth().
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api)(.*)',
  ]
}
