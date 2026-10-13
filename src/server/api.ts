import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// The Go API verifies this Clerk session JWT; it no longer trusts x-user-subject.
export async function authHeader(): Promise<{ Authorization: string }> {
  const token = await (await auth()).getToken();
  if (!token) {
    throw new Error("No session token");
  }
  return { Authorization: `Bearer ${token}` };
}

// Project, agent, environment and secret-menu ids are UUIDs; flag ids are the numeric row id.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID.test(v);
export const isFlagId = (v: unknown): v is string => typeof v === "string" && (/^\d{1,19}$/.test(v) || UUID.test(v));
export const invalidId = () => NextResponse.json({ error: "Invalid id" }, { status: 400 });

// Only UploadThing-hosted images may be stored as user/company/project images.
export function isUploadedImageUrl(v: unknown): v is string {
  if (typeof v !== "string") return false;
  try {
    const url = new URL(v);
    return url.protocol === "https:" && !url.port && (url.hostname === "utfs.io" || url.hostname.endsWith(".ufs.sh"));
  } catch {
    return false;
  }
}
