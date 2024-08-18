import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url()
    ),

    KEYCLOAK_ID: z.string(),
    KEYCLOAK_SECRET: z.string(),
    KEYCLOAK_ISSUER: z.string(),

    UPLOADTHING_SECRET: z.string(),
    UPLOADTHING_APP_ID: z.string(),

    STRIPE_KEY: z.string(),
    STRIPE_SECRET: z.string(),

    FLAGS_AGENT: z.string().optional(),
    FLAGS_PROJECT: z.string().optional(),
    FLAGS_ENVIRONMENT: z.string().optional(),
    FLAGS_SERVER: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    KEYCLOAK_ID: process.env.KEYCLOAK_ID,
    KEYCLOAK_SECRET: process.env.KEYCLOAK_SECRET,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,

    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,

    STRIPE_KEY: process.env.STRIPE_KEY,
    STRIPE_SECRET: process.env.STRIPE_SECRET,

    FLAGS_AGENT: process.env.FLAGS_AGENT,
    FLAGS_PROJECT: process.env.FLAGS_PROJECT,
    FLAGS_ENVIRONMENT: process.env.FLAGS_ENVIRONMENT,
    FLAGS_SERVER: process.env.FLAGS_SERVER,

    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
