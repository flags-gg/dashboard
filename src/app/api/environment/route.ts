import { NextResponse } from "next/server";
import { getServerAuthSession } from "~/server/auth";
import { env } from "~/env";
import { IEnvironment } from "~/lib/interfaces";
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(request: Request) {
  type UpdateEnvironmentName = {
    name: string
    environmentId: string
    enabled: boolean
  }

  const { name, environmentId, enabled }: UpdateEnvironmentName = await request.json() as UpdateEnvironmentName
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/environment/${environmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      body: JSON.stringify({
        name: name,
        enabled: enabled,
        environment_id: environmentId
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to update environment name' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Environment name updated successfully' })
  } catch (e) {
    console.error('Failed to update environment name', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  type DeleteEnv = {
    environmentId: string
  }

  const { environmentId }: DeleteEnv = await request.json() as DeleteEnv
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/environment/${environmentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-subject': user.id,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to delete environment' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Environment deleted successfully' })
  } catch (e) {
    console.error('Failed to delete environment', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const environmentId = searchParams.get('environmentId')
  const user = await currentUser();
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const response = await fetch(`${env.API_SERVER}/environment/${environmentId}`, {
      method: 'GET',
      headers: {
        'x-user-subject': user.id,
      },
      cache: 'no-store'
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch environment' }, { status: 500 })
    }

    const data = await response.json() as IEnvironment
    return NextResponse.json(data)
  } catch (e) {
    console.error('Failed to fetch environment', e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}