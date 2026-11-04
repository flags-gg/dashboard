import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isFlagId, invalidId } from "~/server/api";
import { logError } from "~/lib/logger";

// Replaces a flag's targeting rules in one environment; the API validates them and reports why it refused.
export async function PUT(request: Request) {
  const { flag_id, rules } = await request.json() as { flag_id: string, rules: unknown }
  if (!(await currentUser())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isFlagId(flag_id)) {
    return invalidId()
  }
  if (!Array.isArray(rules)) {
    return NextResponse.json({ error: 'Rules must be a list' }, { status: 400 })
  }

  try {
    const res = await fetch(`${env.API_SERVER}/flag/${encodeURIComponent(flag_id)}/rules`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({ rules }),
      cache: 'no-store',
    })
    if (res.status === 400) {
      const text = await res.text()
      return new NextResponse(text || JSON.stringify({ error: 'Invalid rules' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to save rules' }, { status: 500 })
    }
    return NextResponse.json({ rules })
  } catch (e) {
    logError('Failed to save rules', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
