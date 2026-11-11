import "server-only";
import { auth } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader } from "~/server/api";

export async function staffAccess(): Promise<"allowed" | "denied" | "unavailable"> {
  if (!(await auth()).userId) return "denied";
  try {
    const response = await fetch(`${env.API_SERVER}/staff/me`, { headers: await authHeader(), cache: "no-store" });
    if ([401, 403, 404].includes(response.status)) return "denied";
    return response.ok ? "allowed" : "unavailable";
  } catch { return "unavailable"; }
}
