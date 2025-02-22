import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";

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
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/company/image`, {
      method: 'PUT',
      headers: {
        'x-user-subject': user.id,
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
    console.error('Failed to update company image', e)
    return NextResponse.json({message: 'Internal Server Error'}, { status: 500 })
  }
}