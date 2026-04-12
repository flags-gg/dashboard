import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getDashboardSummary } from "~/server/get-dashboard-summary";
import { logError } from "~/lib/logger";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await getDashboardSummary(userId));
  } catch (error) {
    logError("failed to fetch dashboard summary", error);
    return NextResponse.json({ error: "Failed to fetch dashboard summary" }, { status: 500 });
  }
}
