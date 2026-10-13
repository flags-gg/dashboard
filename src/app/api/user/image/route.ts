import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { env } from "~/env";
import { authHeader, isUploadedImageUrl } from "~/server/api";
import { logError } from "~/lib/logger";

export async function PUT(request: Request) {
  type UpdateImage = {
    image: string
  }

  const {image}: UpdateImage = await request.json() as UpdateImage
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUploadedImageUrl(image)) {
    return NextResponse.json({ error: 'Invalid image url' }, { status: 400 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/user/image`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      body: JSON.stringify({image: image}),
      cache: 'no-store',
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update user image' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User image updated successfully' })
  } catch (e) {
    logError('Failed to update user image', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}