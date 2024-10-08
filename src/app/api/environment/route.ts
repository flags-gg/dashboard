import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  console.info("request", request)

  return new NextResponse('Not Implemented', { status: 501 })
}