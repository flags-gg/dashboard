/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import type {NextConfig} from "next";
import "./src/env"

const origin = (url?: string) => {
  try {
    return url ? new URL(url).origin : "";
  } catch {
    return "";
  }
};

// Clerk's Frontend API host is base64-encoded in the publishable key (pk_live_<base64("clerk.example.com$")>).
const clerkHost = (() => {
  try {
    const encoded = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.split("_")[2];
    return encoded ? `https://${atob(encoded).replace(/\$$/, "")}` : "";
  } catch {
    return "";
  }
})();

const clerk = `${clerkHost} https://*.clerk.accounts.dev`;
const apiOrigins = [origin(process.env.API_SERVER), origin(process.env.NEXT_PUBLIC_FLAGS_SERVER), "https://api.flags.gg"].join(" ");
const uploadthing = "https://utfs.io https://*.ufs.sh https://*.uploadthing.com";

// Report-only until validated in production; then move it to Content-Security-Policy.
const cspReportOnly = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} ${clerk} https://js.stripe.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://img.clerk.com https://avatars.githubusercontent.com https://*.stripe.com ${uploadthing}`,
  "font-src 'self' data:",
  `connect-src 'self' ${clerk} ${apiOrigins} https://api.stripe.com https://merchant-ui-api.stripe.com ${uploadthing}`,
  "frame-src https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ").replace(/ {2,}/g, " ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

/** @type {import("next").NextConfig} */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      }
    ]
  },
  output: "standalone",
};

export default nextConfig;
