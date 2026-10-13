import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { env } from "~/env";
import { authHeader, isUuid, invalidId } from "~/server/api";
import { IEnvironment } from "~/lib/interfaces";
import { logError } from "~/lib/logger";

export async function PUT(request: Request) {
  type UpdateEnvironmentName = {
    name: string
    environmentId: string
    enabled: boolean
  }

  const { name, environmentId, enabled }: UpdateEnvironmentName = await request.json() as UpdateEnvironmentName
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(environmentId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/environment/${encodeURIComponent(environmentId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      body: JSON.stringify({
        name: name,
        enabled: enabled,
        environment_id: environmentId
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update environment name' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Environment name updated successfully' })
  } catch (e) {
    logError('Failed to update environment name', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  type DeleteEnv = {
    environmentId: string
  }

  const { environmentId }: DeleteEnv = await request.json() as DeleteEnv
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(environmentId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/environment/${encodeURIComponent(environmentId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(await authHeader()),
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to delete environment' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Environment deleted successfully' })
  } catch (e) {
    logError('Failed to delete environment', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url)
  const environmentId = searchParams.get('environmentId')
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isUuid(environmentId)) {
    return invalidId()
  }

  try {
    const response = await fetch(`${env.API_SERVER}/environment/${encodeURIComponent(environmentId)}`, {
      method: 'GET',
      headers: {
        ...(await authHeader()),
      },
      cache: 'no-store'
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch environment' }, { status: 500 })
    }

    const data = await response.json() as IEnvironment
    return NextResponse.json(data)
  } catch (e) {
    logError('Failed to fetch environment', e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}