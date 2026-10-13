import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isUploadedImageUrl } from "~/server/api";
import { logError } from "~/lib/logger";

export async function PUT(request: Request) {
  type UpdateImage = {
    image: string
  }

  const {image}: UpdateImage = await request.json()
  if (!image) {
    return NextResponse.json({message: 'No image provided'}, { status: 400 })
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUploadedImageUrl(image)) {
    return NextResponse.json({ error: 'Invalid image url' }, { status: 400 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/image`, {
      method: 'PUT',
      headers: {
        ...(await authHeader()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({image: image}),
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({message: 'Failed to update company image'}, { status: 500 })
    }

    return NextResponse.json({ message: 'Company image updated'})
  } catch (e) {
    logError('Failed to update company image', e)
    return NextResponse.json({message: 'Internal Server Error'}, { status: 500 })
  }
}