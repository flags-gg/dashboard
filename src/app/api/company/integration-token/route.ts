import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader } from "~/server/api";
import { logError } from "~/lib/logger";

// Integration tokens (Tracklines, MCP). The raw token is only in the POST response.
async function proxy(method: string, path: string, body?: unknown) {
  if (!(await currentUser())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const res = await fetch(`${env.API_SERVER}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
    })
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 })
    }
    if (!res.ok) {
      return NextResponse.json({ error: 'Request failed' }, { status: res.status })
    }
    return new NextResponse(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    logError('integration token', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  return proxy('GET', '/company/integration-tokens')
}

export async function POST(request: Request) {
  const { name } = await request.json() as { name: string }
  if (typeof name !== "string" || !name.trim() || name.length > 255) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  return proxy('POST', '/company/integration-token', { name: name.trim() })
}

export async function DELETE(request: Request) {
  const { id } = await request.json() as { id: number }
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  return proxy('DELETE', `/company/integration-token/${id}`)
}
